import exec from "child_process";
import fs from "fs";
import Mustache from "mustache";
import { task } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import {
  PLUGIN_NAME,
  OUTPUT_DIR,
  OUTPUT_SRC_DIR,
  INDEX_TS_FILE,
  TS_CONFIG_FILE,
  PACKAGE_JSON_FILE,
  README_MD_FILE,
  NPMRC_FILE,
} from "../constants";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  ABI_TS,
  INDEX_TS,
  PACKAGE_JSON,
  TS_CONFIG_JSON,
  README_MD,
  NPMRC_NPM,
  NPMRC_GHP,
} from "./templates";
import { parseArtifacts } from "./helper";

task("publish-typechain", "Publish typechain to registry").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // run `typechain` task before all operations
    await hre.run("typechain");
    // other task has builtin: `import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";`

    // read configs from `hardhat.constants.ts`
    const configs = hre.config.publishTypechain;

    // create `publish-typechain` dir, if exists, remove it first
    if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true });
    fs.mkdirSync(OUTPUT_DIR);

    // copy `src/contracts` dir and `src/common.ts` file
    fs.cpSync("typechain-types/contracts", `${OUTPUT_SRC_DIR}/contracts`, {
      recursive: true,
    });
    fs.copyFileSync("typechain-types/common.ts", `${OUTPUT_SRC_DIR}/common.ts`);

    // parse artifacts
    const { contracts } = await parseArtifacts(hre, configs.ignoreContracts);

    // create `src/abi` dir and create `src/abi/index.ts` file
    fs.mkdirSync(`${OUTPUT_SRC_DIR}/abi`);
    const abiCode = Mustache.render(ABI_TS, { contracts });
    fs.writeFileSync(`${OUTPUT_SRC_DIR}/abi/${INDEX_TS_FILE}`, abiCode, {
      flag: "a+",
    });

    // create `src/index.ts` file
    const indexCode = Mustache.render(INDEX_TS, { contracts });
    fs.writeFileSync(`${OUTPUT_SRC_DIR}/${INDEX_TS_FILE}`, indexCode, {
      flag: "a+",
    });

    // create `tsconfig.json` file
    fs.writeFileSync(`${OUTPUT_DIR}/${TS_CONFIG_FILE}`, TS_CONFIG_JSON);

    // create `package.json` file
    fs.writeFileSync(
      `${OUTPUT_DIR}/${PACKAGE_JSON_FILE}`,
      Mustache.render(PACKAGE_JSON, configs),
    );

    // create `README.md` file
    fs.writeFileSync(
      `${OUTPUT_DIR}/${README_MD_FILE}`,
      Mustache.render(README_MD, {
        configs,
        contracts,
        contract: contracts[0],
      }),
    );

    // create `.npmrc` file
    if (configs.authToken.startsWith("npm_")) {
      fs.writeFileSync(
        `${OUTPUT_DIR}/${NPMRC_FILE}`,
        Mustache.render(NPMRC_NPM, configs),
      );
    } else if (configs.authToken.startsWith("ghp_")) {
      fs.writeFileSync(
        `${OUTPUT_DIR}/${NPMRC_FILE}`,
        Mustache.render(NPMRC_GHP, configs),
      );
    } else {
      throw new HardhatPluginError(PLUGIN_NAME, "authToken is incorrect");
    }

    // execute `npm run build` and `npm publish` to build and publish package
    exec.execSync("npm run build", { cwd: OUTPUT_DIR });
    exec.execSync("npm publish", { cwd: OUTPUT_DIR });
  },
);

// task alias
task("pub-type", "alias of `publish-typechain` task").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    await hre.run("publish-typechain");
  },
);

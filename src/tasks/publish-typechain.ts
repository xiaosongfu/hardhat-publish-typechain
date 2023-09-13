import exec from "child_process";
import fs from "fs";
import Mustache from "mustache";
import { task } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import {
  PLUGIN_NAME,
  TASK_PUBLISH_TYPECHAIN,
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
  ABI_INDEX_TS,
  INDEX_TS,
  DEPLOYED_INDEX_TS,
  PACKAGE_JSON,
  TS_CONFIG_JSON,
  README_MD,
  NPMRC_NPM,
  NPMRC_GHP,
} from "./templates";
import { parseArtifacts, parseDeployedAddresses } from "./helper";

task(TASK_PUBLISH_TYPECHAIN, "Publish typechain to registry").setAction(
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
    // contracts: [{contractName: "MockERC20", importPath: "contracts/mock", abi: ...}, ...]
    const { contracts } = await parseArtifacts(hre, configs.ignoreContracts);

    // create `src/abi` dir
    fs.mkdirSync(`${OUTPUT_SRC_DIR}/abi`);
    const abiCode = Mustache.render(ABI_INDEX_TS, { contracts });
    //  write `src/abi/index.ts` file
    fs.writeFileSync(`${OUTPUT_SRC_DIR}/abi/${INDEX_TS_FILE}`, abiCode, {
      flag: "a+",
    });

    // if `includeDeployed` is `true`, parse and handle deployed addresses
    let contractsWithDeployedAddress: {
      contractName: string;
      importPath: string;
      addresses: { network: string; address: string }[];
    }[] = [];
    if (configs.includeDeployed) {
      // create `src/deployed` dir
      fs.mkdirSync(`${OUTPUT_SRC_DIR}/deployed`);
      // wrap `contracts` with deployed addresses
      contractsWithDeployedAddress = parseDeployedAddresses(
        configs.deployedDir,
        contracts,
      );
      //  write `src/deployed/index.ts` file
      const deployedCode = Mustache.render(DEPLOYED_INDEX_TS, {
        contractsWithDeployedAddress,
      });
      fs.writeFileSync(
        `${OUTPUT_SRC_DIR}/deployed/${INDEX_TS_FILE}`,
        deployedCode,
        {
          flag: "a+",
        },
      );
    }

    // create `src/index.ts` file
    const indexCode = Mustache.render(INDEX_TS, {
      contracts: configs.includeDeployed
        ? contractsWithDeployedAddress
        : contracts,
      configs,
    });
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
        contractsWithDeployedAddress,
        // a `contract` and a `network` to render example code
        contract: configs.includeDeployed
          ? contractsWithDeployedAddress[0]
          : {},
        network: configs.includeDeployed
          ? contractsWithDeployedAddress[0].addresses[0].network
          : "",
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

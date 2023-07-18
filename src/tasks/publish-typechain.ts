import exec from "child_process";
import fs from "fs";
import { task } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import { PLUGIN_NAME, OUTPUT_DIR } from "../config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("publish-typechain", "Publish typechain to registry").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // run `typechain` task before all operations
    await hre.run("typechain");
    // other task has builtin: `import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";`

    // read configs from `hardhat.config.ts`
    const configs = hre.config.publishTypechain;

    // create `publish-typechain` dir
    if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true });
    // fs.rmdirSync(OUTPUT_DIR, {recursive: true});
    fs.mkdirSync(OUTPUT_DIR);

    // copy `contracts` dir and `common.ts` file
    fs.cpSync("typechain-types/contracts", `${OUTPUT_DIR}/contracts`, {
      recursive: true,
    });
    fs.copyFileSync("typechain-types/common.ts", `${OUTPUT_DIR}/common.ts`);

    // create `index.ts` file which exports abis
    for (const contract of configs.contracts) {
      const artifacts = await hre.artifacts.readArtifact(contract);
      const abi = JSON.stringify(artifacts.abi, null, 4);
      const code = `export const ${contract}ABI = ${abi}\n`;
      fs.writeFileSync(`${OUTPUT_DIR}/index.ts`, code, { flag: "a+" });
    }
    // append `export * from './contracts'` to `index.ts` file end for more convenient using
    fs.writeFileSync(
      `${OUTPUT_DIR}/index.ts`,
      `\nexport * from './contracts'\n`,
      { flag: "a+" },
    );

    // create `tsconfig.json` file
    fs.writeFileSync(
      `${OUTPUT_DIR}/tsconfig.json`,
      `{ "compilerOptions": { "target": "es2020", "module": "commonjs", "declaration": true, "outDir": "./dist", "esModuleInterop": true, "forceConsistentCasingInFileNames": true, "strict": true, "skipLibCheck": true }, "exclude": ["./dist"] }`,
    );

    // create `package.json` file
    fs.writeFileSync(
      `${OUTPUT_DIR}/package.json`,
      `{ "name": "${configs.name}", "version": "${configs.version}", "main": "./dist/index.js", "types": "./dist/index.d.ts", "scripts": { "build": "tsc" }, "dependencies": { "ethers": "${configs.ethers}" }, "devDependencies": { "typescript": "${configs.typescript}" } }`,
    );

    // create `.npmrc` file
    if (configs.authToken.startsWith("ghp_")) {
      fs.writeFileSync(
        `${OUTPUT_DIR}/.npmrc`,
        `//npm.pkg.github.com/:_authToken=${configs.authToken}`,
      );
    } else if (configs.authToken.startsWith("npm_")) {
      fs.writeFileSync(
        `${OUTPUT_DIR}/.npmrc`,
        `//registry.npmjs.org/:_authToken=${configs.authToken}`,
      );
    } else {
      throw new HardhatPluginError(PLUGIN_NAME, "authToken is incorrect");
    }

    // run `npm publish`
    exec.execSync("npm run build", { cwd: OUTPUT_DIR });
    exec.execSync("npm publish", { cwd: OUTPUT_DIR });
  },
);

// task alias
task("pub-type", "Publish typechain to registry").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    await hre.run("publish-typechain");
  },
);

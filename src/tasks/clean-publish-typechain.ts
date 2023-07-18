import fs from "fs";
import { task } from "hardhat/config";
import { OUTPUT_DIR } from "../config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("clean-publish-typechain", `Clean '${OUTPUT_DIR}' dir`).setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true });
    }
  },
);

// task alias
task("clean-pub-type", "").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    await hre.run("clean-publish-typechain");
  },
);

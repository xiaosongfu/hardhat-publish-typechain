import { extendConfig } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import { PLUGIN_NAME, defaultEthers, defaultTypescript } from "./config";
import "./tasks/publish-typechain"; // import `publish-typechain` task
import "./type-extensions"; // This import is needed to let the TypeScript compiler know that it should include your type extensions in your npm package's types file.

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const name = userConfig.publishTypechain?.name || "";
    const version = userConfig.publishTypechain?.version || "";

    const ethers = userConfig.publishTypechain?.ethers || defaultEthers;
    const typescript =
      userConfig.publishTypechain?.typescript || defaultTypescript;
    const pretty = userConfig.publishTypechain?.pretty || false;
    const contracts = userConfig.publishTypechain?.contracts || [];

    const authToken = userConfig.publishTypechain?.authToken || "";

    if (contracts.length === 0) {
      throw new HardhatPluginError(PLUGIN_NAME, "contracts is empty");
    }

    if (authToken === "") {
      throw new HardhatPluginError(PLUGIN_NAME, "authToken is required");
    }

    // inject config fields
    config.publishTypechain.name = name;
    config.publishTypechain.version = version;
    //
    config.publishTypechain.ethers = ethers;
    config.publishTypechain.typescript = typescript;
    config.publishTypechain.pretty = pretty;
    config.publishTypechain.contracts = contracts;
    //
    config.publishTypechain.authToken = authToken;
  },
);

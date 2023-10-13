import { extendConfig } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { PLUGIN_NAME, DEFAULT_DEPLOYED_DIR } from "./constants";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

// Import tasks
import "./tasks/publish-typechain";
import "./tasks/clean-publish-typechain";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // read user config
    const name = userConfig.publishTypechain?.name || "";
    const version = userConfig.publishTypechain?.version || "";
    const homepage = userConfig.publishTypechain?.homepage || "";
    const repository = userConfig.publishTypechain?.repository || "";

    const iifeGlobalObjectName =
      userConfig.publishTypechain?.iifeGlobalObjectName;
    const ignoreContracts = userConfig.publishTypechain?.ignoreContracts ?? [];

    const includeDeployed =
      userConfig.publishTypechain?.includeDeployed ?? false;
    const deployedDir =
      userConfig.publishTypechain?.deployedDir ?? DEFAULT_DEPLOYED_DIR;
    const ignoreDeployedNetworks =
      userConfig.publishTypechain?.ignoreDeployedNetworks ?? [];

    const authToken = userConfig.publishTypechain?.authToken || "";

    if (iifeGlobalObjectName === undefined) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "'iifeGlobalObjectName' is required",
      );
    }
    if (authToken === "") {
      throw new HardhatPluginError(PLUGIN_NAME, "'authToken' is required");
    }

    // inject config fields
    config.publishTypechain = {
      name,
      version,
      homepage,
      repository,
      iifeGlobalObjectName,
      ignoreContracts,
      includeDeployed,
      deployedDir,
      ignoreDeployedNetworks,
      authToken,
    };
  },
);

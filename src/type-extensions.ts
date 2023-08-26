// If your plugin extends types from another plugin, you should import the plugin here.

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface PublishTypechainUserConfig {
    name: string;
    version: string;
    homepage?: string;
    repository?: string;

    ethers?: string;
    typescript?: string;
    pretty?: boolean;
    ignoreContracts?: string[];
    includeDeployed?: boolean;
    deployedDir?: string;

    authToken: string;
  }

  export interface PublishTypechainConfig {
    name: string;
    version: string;
    homepage?: string;
    repository?: string;

    ethers?: string;
    typescript?: string;
    pretty?: boolean;
    ignoreContracts: string[];
    includeDeployed: boolean;
    deployedDir: string;

    authToken: string;
  }

  export interface HardhatUserConfig {
    publishTypechain?: PublishTypechainUserConfig;
  }

  export interface HardhatConfig {
    publishTypechain: PublishTypechainConfig;
  }
}

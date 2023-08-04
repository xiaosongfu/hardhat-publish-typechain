import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";

export async function parseArtifacts(
  hre: HardhatRuntimeEnvironment,
  ignoreContracts: string[],
): Promise<{
  contracts: { contractName: string; importPath: string; abi: any }[];
}> {
  const fullNames = await hre.artifacts.getAllFullyQualifiedNames();
  // console.log("~~~~", fullNames);
  // examples:
  // ~~~~ [
  //   '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol:OwnableUpgradeable',
  //   '@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol:SafeMathUpgradeable',
  //   '@openzeppelin/contracts-upgradeable/utils/math/SignedMathUpgradeable.sol:SignedMathUpgradeable',
  //   'contracts/SeeDAO.sol:SeeDAO',
  //   'contracts/mock/MockERC20.sol:MockERC20'
  // ]

  let contracts: { contractName: string; importPath: string; abi: string }[] =
    [];
  // [{contractName: "MockERC20", importPath: "contracts/mock", abi: ...}, ...]
  for (const fullName of fullNames) {
    // skip libraries
    if (!fullName.startsWith("contracts/")) continue;

    // get sourceName and contractName
    const { sourceName, contractName, abi } = await hre.artifacts.readArtifact(
      fullName,
    );
    // console.log("~~~~", sourceName, contractName);
    // examples:
    // ~~~~ contracts/SeeDAO.sol SeeDAO
    // ~~~~ contracts/mock/MockERC20.sol MockERC20

    // skip ignored contracts
    if (ignoreContracts.includes(contractName)) continue;

    // convert from sourceName to importPath
    // `contracts/SeeDAO.sol` -> `"contracts"`
    // `contracts/mock/MockERC20.sol` -> `"contracts/mock"`
    const importPath = sourceName.slice(0, sourceName.lastIndexOf("/"));

    contracts.push({
      contractName,
      importPath,
      abi: JSON.stringify(abi, null, 2),
    });
  }

  return new Promise((resolve) => {
    resolve({
      contracts,
    });
  });
}

export function parseDeployedAddresses(
  deployedDir: string,
  contracts: { contractName: string; importPath: string }[],
): {
  contractName: string;
  importPath: string;
  addresses: { network: string; address: string }[];
}[] {
  let result: {
    contractName: string;
    importPath: string;
    addresses: { network: string; address: string }[];
  }[] = [];

  // deployedDir: `scripts/deployed`
  //
  // $ tree deployed
  // deployed
  // ├── index.ts
  // ├── polygon
  // │   └── contracts.json
  // └── sepolia
  //     └── contracts.json
  let deployedJson: { network: string; json: any }[] = [];
  fs.readdirSync(deployedDir, { recursive: false }).forEach((network) => {
    const manifest = `${deployedDir}/${network}/contracts.json`;
    // NOTICE: `fs.existsSync('scripts/deployed/index.ts/contracts.json')` will be `false`
    if (fs.existsSync(manifest)) {
      const content = fs.readFileSync(manifest, "utf-8");
      deployedJson.push({
        network: network.toString(),
        json: JSON.parse(content),
      });
    }
  });

  for (const contract of contracts) {
    let addresses: any[] = [];

    for (const addressJson of deployedJson) {
      let data = addressJson.json;
      if (contract.importPath.includes("/")) {
        const paths = contract.importPath.split("/");
        for (let i = 1; i < paths.length; i++) {
          data = data[paths[i]];
        }
      }

      addresses.push({
        network:
          addressJson.network.charAt(0).toUpperCase() +
          addressJson.network.slice(1),
        address: data[contract.contractName],
      });
    }

    result.push({
      contractName: contract.contractName,
      importPath: contract.importPath,
      addresses: addresses,
    });
  }

  return result;
}

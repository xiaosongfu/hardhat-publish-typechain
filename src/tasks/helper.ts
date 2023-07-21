import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function parseArtifacts(
  hre: HardhatRuntimeEnvironment,
  ignoreContracts: string[],
): Promise<{
  contracts: { contractName: string; importPath: string[]; abi: any }[];
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

  let contracts: { contractName: string; importPath: string[]; abi: string }[] =
    [];
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
    // `contracts/mock/MockERC20.sol` -> `["contracts", "mock"]`
    const importPath = sourceName
      .slice(0, sourceName.lastIndexOf("/"))
      .split("/");

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

export const ABI_INDEX_TS = `/* Autogenerated file. Do not edit manually. */
{{#contracts}}
export const {{contractName}}ABI = {{&abi}};

{{/contracts}}
export default { {{#contracts}}{{contractName}}ABI, {{/contracts}}};
`;

export const DEPLOYED_INDEX_TS = `/* Autogenerated file. Do not edit manually. */
{{#contractsWithDeployedAddress}}
{{#addresses}}
export const {{contractName}}{{network}}Addr = "{{address}}";
{{/addresses}}

{{/contractsWithDeployedAddress}}
export default { {{#contractsWithDeployedAddress}}{{#addresses}}{{contractName}}{{network}}Addr, {{/addresses}}{{/contractsWithDeployedAddress}}};
`;

export const INDEX_TS = `/* Autogenerated file. Do not edit manually. */
import { Contract } from "ethers";

{{#contracts}}
import type { {{contractName}} } from "./{{&importPath}}";
{{/contracts}}

import abi from "./abi";
{{#configs.includeDeployed}}

import deployed from "./deployed";
{{/configs.includeDeployed}}
{{#contracts}}

export namespace {{contractName}}Contract {
    export function at(address: string): {{contractName}} {
        return new Contract(address, abi.{{contractName}}ABI, null) as unknown as {{contractName}};
    }
    {{#configs.includeDeployed}}
    {{#addresses}}
    
    export function at{{network}}(): {{contractName}} {
        return new Contract(deployed.{{contractName}}{{network}}Addr, abi.{{contractName}}ABI, null) as unknown as {{contractName}};
    }
    {{/addresses}}
    {{/configs.includeDeployed}}
}
{{/contracts}}`;

export const TS_CONFIG_JSON = `{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./lib",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "exclude": ["./lib"]
}
`;

export const PACKAGE_JSON = `{
  "name": "{{name}}",
  "version": "{{version}}",
  "homepage": "{{&homepage}}",
  "repository": "{{&repository}}",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": [
    "lib/",
    "src/",
    "README.md"
  ],
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "ethers": "{{ethers}}"
  },
  "devDependencies": {
    "typescript": "{{typescript}}"
  }
}`;

export const README_MD = `> Autogenerated file. Do not edit manually.

## {{configs.name}}

#### Install

\`\`\`
$ npm install {{configs.name}}@{{configs.version}}
\`\`\`

#### Contracts

{{#contracts}}
* {{contractName}}
{{/contracts}}

{{#configs.includeDeployed}}
#### Deployed Addresses

{{#contractsWithDeployedAddress}}
* {{contractName}}
    {{#addresses}}
    - {{network}}: {{address}}
    {{/addresses}}
{{/contractsWithDeployedAddress}}

{{/configs.includeDeployed}}
#### Usage Example

we can import contract's typescript type definition and abi, and then use them to create a contract instance and interactive with on-chain contracts using the instance:

\`\`\`
import { {{contract.contractName}} } from "{{configs.name}}/lib/{{&contract.importPath}}";
import { {{contract.contractName}}ABI } from "{{configs.name}}/lib/abi";

const contract: {{contract.contractName}} = new ethers.Contract("0xAb...yZ", {{contract.contractName}}_ABI, provider) as unknown as {{contract.contractName}};
\`\`\`

or, we can create a contract instance use \`at(address)\` directly and interactive with on-chain contracts using the instance:

\`\`\`
import { {{contract.contractName}} } from "{{configs.name}}/lib/{{&contract.importPath}}";
import { {{contract.contractName}}Contract } from "{{configs.name}}";

const contract: {{contract.contractName}} = {{contract.contractName}}Contract.at("0xAb...yZ").connect(provider);
\`\`\`

if you are using \`hardhat-deployed-records\` plugin and config \`includeDeployed: true\`, you can create a contract instance use \`at[network]()\` with builtin **contract address** from this package:

\`\`\`
import { {{contract.contractName}} } from "{{configs.name}}/lib/{{&contract.importPath}}";
import { {{contract.contractName}}Contract } from "{{configs.name}}";

const contract: {{contract.contractName}} = {{contract.contractName}}Contract.at{{network}}().connect(provider);
\`\`\``;

export const NPMRC_NPM = `//registry.npmjs.org/:_authToken={{authToken}}`;
export const NPMRC_GHP = `//npm.pkg.github.com/:_authToken={{authToken}}`;

export const ABI_TS = `
{{#contracts}}export const {{contractName}}ABI = {{abi}};{{/contracts}}`;

export const INDEX_TS = `import { Contract } from "ethers";

{{#contracts}}
import type { {{contractName}} } from ".{{#importPath}}/{{.}}{{/importPath}}";
{{/contracts}}

import { {{#contracts}}{{contractName}}ABI, {{/contracts}} } from "./abi";

{{#contracts}}
export namespace {{contractName}}Contract {
    export function at(address: string): {{contractName}} {
        return new Contract(address, {{contractName}}ABI, null) as unknown as {{contractName}};
    }
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

export const README_MD = `## {{configs.name}}

#### Install

\`\`\`
$ npm install {{configs.name}}@{{configs.version}}
\`\`\`

#### Contracts

{{#contracts}}
* {{contractName}}
{{/contracts}}

#### Usage Example

we can import contract's typescript type definition and abi, and then use them to create a contract instance and interactive with on-chain contracts using the instance:

\`\`\`
import { {{contract.contractName}} } from "{{configs.name}}/lib{{#contract.importPath}}/{{.}}{{/contract.importPath}}";
import { {{contract.contractName}}ABI } from "{{configs.name}}/lib/abi";

const contract: {{contract.contractName}} = await new ethers.Contract("0xAb...yZ", {{contract.contractName}}ABI, provider) as unknown as {{contract.contractName}};
\`\`\`

or, we can create a contract instance use \`at(address)\` directly and interactive with on-chain contracts using the instance:

\`\`\`
import { {{contract.contractName}}Contract } from "{{configs.name}}";

const contract: {{contract.contractName}} = {{contract.contractName}}Contract.at("0xAb...yZ").connect(provider);
\`\`\``;

export const NPMRC_NPM = `//registry.npmjs.org/:_authToken={{authToken}}`;
export const NPMRC_GHP = `//npm.pkg.github.com/:_authToken={{authToken}}`;
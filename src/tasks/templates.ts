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
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": [
    "lib/",
    "src/"
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

export const NPMRC_NPM = `//registry.npmjs.org/:_authToken={{authToken}}`;
export const NPMRC_GHP = `//npm.pkg.github.com/:_authToken={{authToken}}`;

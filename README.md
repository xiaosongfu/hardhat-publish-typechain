## Hardhat Publish Typechain

Publish generated typechain-types to NPM.

`npx hardhat typechain` task will generate `typechain-types` directory, which contains full-featured typescript code for interactive with our contracts, so we can use those code in our web project to let interacting with contracts more efficiency with power of typescript, like code hint, read function definition.

#### 1. Install

```
$ npm install --save-dev hardhat-publish-typechain
# or
$ yarn add --dev hardhat-publish-typechain
```

#### 2. Included Commands

- `npx hardhat pub-type` is alias of `npx hardhat publish-typechain`: Publish typechain to NPM.
- `npx hardhat clean-pub-type` is alias of `npx hardhat clean-publish-typechain`: Delete `publish-typechain` directory.

#### 3. Usage

Load plugin in Hardhat config:

```
require('hardhat-publish-typechain');
# or
import 'hardhat-publish-typechain';
```

Add configuration under `publishTypechain` key:

| option                   | description                                                                                     | type            | optional | default            |
|--------------------------|-------------------------------------------------------------------------------------------------|-----------------|----------|--------------------|
| `name`                   | npm package's name                                                                              | `string`        | false    |                    |
| `version`                | npm package's version                                                                           | `string`        | false    |                    |
| `homepage`               | npm package's homepage                                                                          | `string`        | true     | `""`               |
| `repository`             | npm package's repository                                                                        | `string`        | true     | `""`               |
| `iifeGlobalObjectName`   | iife format javascript script file's global name                                                | string          | false    |                    |
| `prettyABI`              | use `Solidity JSON ABI` or `Human-Readable ABI`, `true` means use `Human-Readable ABI`          | `bool`          | true     | `false`            |
| `ignoreContracts`        | which contracts wants to ignore                                                                 | array of string | true     | `[]`               |
| `includeDeployed`        | if need to include the `deployed` directory maintained by the `hardhat-deployed-records` plugin | `boolean`       | true     | false              |
| `deployedDir`            | `hardhat-deployed-records` plugin's `deployedDir` config value                                  | `string`        | true     | `scripts/deployed` |
| `ignoreDeployedNetworks` | deployed network's address want to ignore                                                       | array of string | true     | []                 |
| `authToken`              | auth token for publish npm package to npm official registry or GitHub registry                  | `string`        | false    |                    |

example:

```
publishTypechain: {
    name: "erc-tokens",
    version: "0.2.0",
    repository: "https://github.com/xiaosongfu/erc-tokens",
    iifeGlobalObjectName: "mock",
    ignoreContracts: ["MockERC20"],
    includeDeployed: true,
    ignoreDeployedNetworks: ["localhost"],
    authToken: process.env.AUTH_TOKEN || "npm_pZB...zyP",
}
```

- !! before executing `npx hardhat publish-typechain` task, you must logined to npm official registry or GitHub registry, for how to login please read official documents.
- !! **npm official registry** and **GitHub registry** has different format auth token, **npm official registry**'s auth token is start with `npm_` and **GitHub registry**'s auth token is start with `ghp_`, this plugin will publish to relevant registry according to your auth token automatic, so please make sure you use the right auth token for the right registry.

> don't forget to add `publish-typechain` directory to `.gitignore` file.

#### 4. Use published npm package in web project

When npm package published, we can install it, import it and use it in our web project.

Here we use [erc-tokens](https://www.npmjs.com/package/erc-tokens) package as example.

first, install it:

```
$ npm i erc-tokens
```

then, you can import **abi** from `erc-tokens` package and provide your **contract address** to create a contract instance:

```
import { MMERC20 } from "erc-tokens/lib/contracts";
import { MMERC20ABI } from "erc-tokens/lib/abi";

const usdc: MMERC20 = await new ethers.Contract("0xAb...yZ", MMERC20ABI, provider) as unknown as MMERC20;
const balance = await usdc.balanceOf("0x81c4cb77485d163D8623Cc18E1D2A3aFc93CA4f3");
```

or, you can only provide your **contract address** to create a contract instance with `at(address)` function:

```
import { MMERC20 } from "erc-tokens/lib/contracts";
import { MMERC20Contract } from "erc-tokens";

const usdc: MMERC20 = MMERC20Contract.at("0xAb...yZ").connect(provider);
const balance = await usdc.balanceOf("0x81c4cb77485d163D8623Cc18E1D2A3aFc93CA4f3");
```

if you are using `hardhat-deployed-records` plugin and config `includeDeployed: true`, you can create a contract instance use `At[network]()` with builtin **contract address** from this package:

```
import { MMERC20 } from "erc-tokens/lib/contracts";
import { MMERC20Contract } from "erc-tokens";

const usdc: MMERC20 = MMERC20Contract.AtSepolia().connect(provider);
const balance = await usdc.balanceOf("0x81c4cb77485d163D8623Cc18E1D2A3aFc93CA4f3");
```

~ Have fun!

#### 5. Version History

- v0.7.1 (2023/10/24)

  - add `prettyABI` config option to use pretty abi or not

- v0.7.0 (2023/10/13)

  - add `esbuild` to build browser esm+iife signal-script file

- v0.6.0 (2023/10/13)

  - rename config option `ignoreNetworks` to `ignoreDeployedNetworks`

- v0.5.0 (2023/09/26)

  - rename deployed contract address constant's name

- v0.4.2 (2023/09/26)

  - support skip networks with `skipNetworks` option when using including deployed contracts

- v0.4.1 (2023/09/15)

  - auto skip solidity `library` contract

- v0.4.0 (2023/09/15)
  - auto skip `interface` type contract

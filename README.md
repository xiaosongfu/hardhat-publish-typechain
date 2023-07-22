## hardhat Publish Typechain

Publish generated typechain-types to NPM.

`npx hardhat typechain` task will generate `typechain-types` directory, which contains full-featured typescript code for interactive with our contracts, so we can use those code in our web project to let interacting with contracts more efficiency with power of typescript, like code hint, read function definition.

## Install

```
npm install --save-dev hardhat-publish-typechain
# or
yarn add --dev hardhat-publish-typechain
```

## Included Commands

- `npx hardhat publish-typechain`: Publish typechain to NPM.
- `npx hardhat clean-publish-typechain`: Delete `publish-typechain` directory.

## Usage

Load plugin in Hardhat config:

```
require('hardhat-publish-typechain');
# or
import 'hardhat-publish-typechain';
```

Add configuration under `publishTypechain` key:

| option            | description                                                                    | optional | default  |
|-------------------|--------------------------------------------------------------------------------|----------|----------|
| `name`            | npm package's name                                                             | false    |          |
| `version`         | npm package's version                                                          | false    |          |
| `ethers`          | version of `ethers` library                                                    | true     | `^5.7.2` |
| `typescript`      | version of `typescript` library                                                | true     | `^4.9.5` |
| `ignoreContracts` | which contracts wants to ignore                                                | true     | `[]`     |
| `authToken`       | auth token for publish npm package to npm official registry or GitHub registry | false    |          |

example:

```
publishTypechain: {
    name: "pepefork-contracts",
    version: "0.1.0",
    ignoreContracts: ["MockERC20"],
    authToken: process.env.AUTH_TOKEN || "npm_pZB...zyP",
}
```

* !! before executing `npx hardhat publish-typechain` task, you must logined to npm official registry or GitHub registry, for how to login please read official documents.
* !! **npm official registry** and **GitHub registry** has different format auth token, **npm official registry**'s auth token is start with `npm_` and **GitHub registry**'s auth token is start with `ghp_`, this plugin will publish to relevant registry according to your auth token automatic, so please make sure you use the right auth token for the right registry.

> don't forget to add `publish-typechain` directory to `.gitignore` file.

## Use published npm package in web project

When npm package published, we can install it, import it and use it in our web project.

Here we use [erc-tokens](https://www.npmjs.com/package/erc-tokens) package as example.

first, install it:

```
$ npm i erc-tokens
```

then, we can import contract's typescript type and abi, and then use them to create a contract instance and interactive with it:

```
import { MMERC20 } from "erc-tokens/lib/contracts";
import { MMERC20ABI } from "erc-tokens/lib/abi";
```

```
const usdc = await new ethers.Contract("0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f", MMERC20ABI, provider) as unknown as MMERC20;
const balance = await usdc.balanceOf("0xF360883Bf9d1ea99d149Ba4310F90Af7e7CC0f80");
```

or, we can create a contract instance use `at(address)` directly and interactive with it:

```
import { MMERC20Contract } from "erc-tokens";
```

```
const usdc = MMERC20Contract.at("0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f").connect(provider);
const balance = await usdc.balanceOf("0xF360883Bf9d1ea99d149Ba4310F90Af7e7CC0f80");
```

~ Have fun!

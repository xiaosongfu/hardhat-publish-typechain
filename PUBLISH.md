## how to publish

first, you need login to registry.

for npm official registry, you can login with:

```
$ npm login --registry=https://registry.npmjs.org
Username: USERNAME
Password: PASSWORD
Email: (this IS public) EMAIL
npm notice Please check your email for a one-time password (OTP)
Enter one-time password: ONE_TIME_PASSWORD
```

for GitHub registry, you can login with:

```
$ npm login --scope=@NAMESPACE --auth-type=legacy --registry=https://npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
```

then, you need to add a access token to `.npmrc` file.

for npm official registry, you can add a line to `.npmrc` file:

```
//registry.npmjs.org/:_authToken=<your token>
```

for GitHub registry, you can add a line to `.npmrc` file:

```
//npm.pkg.github.com/:_authToken=<your token>
```

last, you can build and publish with commands:

```
$ npm run build

$ npm publish
```

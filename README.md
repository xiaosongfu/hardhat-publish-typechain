## how to publish

first, you need login to registry.

for registry.npmjs.org, you can login with:

```
$ npm login --scope=@NAMESPACE --auth-type=legacy --registry=https://npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
```

for github registry, you can login with:

```
$ npm login --registry=https://registry.npmjs.org
Username: USERNAME
Password: PASSWORD
Email: (this IS public) EMAIL
npm notice Please check your email for a one-time password (OTP)
Enter one-time password: ONE_TIME_PASSWORD
```

then, you need to add a token to .npmrc file.

for registry.npmjs.org, you can add a line to .npmrc file:

```
//registry.npmjs.org/:_authToken=<your token>
```

for github registry, you can add a line to .npmrc file:

```
//npm.pkg.github.com/:_authToken=<your token>
```

last, you can publish with:

```
$ npm run build

$ npm publish
```

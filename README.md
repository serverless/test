# @serverless/test

## Internal test utils that aid Serverless organization libraries

Provides a reliable test suite setup, based on [Mocha](https://mochajs.org/) test framework

### Installation

```bash
npm i --save-dev mocha @serverless/test
```

### Mocha Setup

Preconfigure Mocha to rely on a custom reporter, included with this package, which applies workarounds for known Mocha issues, and exposes endpoint through which other utils may observe Mocha runner flow.

In `package.json` add `mocha` section with `reporter` option set as follows:

```json
{
  "mocha": {
    "reporter": "@serverless/test/setup/mocha-reporter"
  }
}
```

### Extensions

Each extension needs to be pased through in `require` option as, e.g.:

```json
{
  "mocha": {
    "require": [
      "@serverless/test/setup/home-dir-mock",
      "@serverless/test/setup/bluebird-async-leaks-patch"
    ]
  }
}
```

#### Async leaks detector (`setup/async-leaks-detector`)

Will ensure meaningful errors if there are async operations detected after all tests are reported to be finished.

When relying on Bluebird, the bluebird patch (`setup/bluebird-async-leaks-detector-patch`) also needs to be loaded.

##### Mock homedir (`setup/mock-homedir`);

Mocks user home dir into temp dir (to not mess in real user homedir)

#### Disable `serverless` stats requests (`setup/disable-serverless-stats-requests`);

Important when testing involves [serverless](https://github.com/serverless/serverless/) instances. Ensures that tracking requests are not issued

#### Restore cwd (current working directory) (`setup/restore-cwd`);

After each top level test run restore cwd to initial state

### Utils

#### `process-tmp-dir`

Path to temporary directory that was created for exclusive use in context of given test process

# @serverless/test

## Internal test utils that aid Serverless organization libraries

Provides a reliable test suite setup, based on [Mocha](https://mochajs.org/) test framework

### Installation

```bash
npm i --save-dev mocha@7 chai chai-as-promised @serverless/test
```

### Mocha Setup

Preconfigure Mocha to rely on a custom reporter, included with this package, which applies workarounds for known Mocha issues, and exposes endpoint through which other utils may observe Mocha runner flow.

In `package.json` add `mocha` section with `reporter` option set, and recommended extensions as follows:

```json
{
  "mocha": {
    "reporter": "@serverless/test/setup/mocha-reporter",
    "require": [
      "@serverless/test/setup/log",
      "@serverless/test/setup/async-leaks-detector",
      "@serverless/test/setup/mock-homedir",
      "@serverless/test/setup/restore-cwd",
      "@serverless/test/setup/restore-env"
    ]
  }
}
```

### Setup extensions

All setup extensions are documented in [docs/setup](docs/setup) folder

### Utils

All utils are documented in [docs](docs) folder

### Binaries

All binaries are documented in [docs/bin](docs/bin) folder

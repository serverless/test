# @serverless/test

## Internal test utils that aid Serverless organization libraries

Provides a reliable test suite setup, based on [Mocha](https://mochajs.org/) test framework

### Installation

```bash
npm i --save-dev mocha@6 @serverless/test
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

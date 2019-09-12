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

### `run-serverless`

Runs complete serverless instance in preconfigured environment, limited to predefined plugins and hook events.

Optionally serverless instance can be freshly required with specifc modules mocked

#### Usage

```javascript
const runServerless = require('@serverless/test/run-serverless');

describe('Some suite', () => {
  it('Some test that involves creation of serverless instance', function() {
    runServerless(pathToServerlessRootFolder, {
      // Options, see below documentation
    }).then(serverless => {
      // Resolved after serverless.run() finalizes.
      // Examine here expected outcome
    });
  });
});
```

##### Supported options

###### `cwd`

Working directory in which supposedly `serverless` is run

###### `cliArgs` (optional)

CLI arguments (e.g. `['deploy']`), defaults to `[]`

###### `env` (optinal)

Eventual environment variables (e.g. `{ SLS_DEBUG: '*' }`)

###### `pluginPathsWhiteList`

Paths to plugins of which registered hooks should be invoked.  
Note: All other plugins will be naturally initialized but no hooks they registered will be invoked

###### `hookNamesWhiteList`

List of hooks for which callbacks should be run.
Registered callbacks for all other scheduled hooks will be ignored

###### `modulesCacheStup` (optional)

When provided, serverless instance will be created out of freshly required module,
and provided cache map will be used as stub for underlying required modules.

#### `configure-inquirer-stub`

An utility that helps to confogure inquirer prompt stubs.

Takes inquirer instance (to have `prompt` method stubbed), a config map of mocked responses:

e.g. following stubs complete AWS credentials setup that maybe configured via interactive CLI

```javascript
const inquirer = require('inquirer');
const configureInquirerStub = require('@serverless/test/configure-inquirer-stub');

configureInquirerStub(inquirer, {
  confirm: { shouldSetupAwsCredentials: true, hasAwsAccount: true },
  input: { accessKeyId, secretAccessKey },
});
```

#### `process-tmp-dir`

Path to temporary directory that was created for exclusive use in context of given test process

#### `skip-with-notice`

Skip given test, and ensure proper notice will be displayed for developer with tests summary

Example usage

```javascript
const skipWithNotice = require('@serverless/test/skip-with-notice');

describe('Some suite', () => {
  it('Some test that involves optional runtime', function() {
    invokePython().catch(error => {
      if (error.code === 'ENOENT' && error.path === 'python2') {
        skipWithNotice(this, 'Python runtime is not installed');
      }
      throw error;
    });
  });
});
```

#### `skip-on-disabled-symlinks-in-windows`

Preconfigured `skipWithNotice` usage to skip on Windows symlink errors.

Usage:

```javascript
const skipOnDisabledSymlinksInWindows = require('@serverless/test/skip-on-disabled-symlinks-in-windows');

describe('Some suite', () => {
  it('Some test that involves symlinks creation', function() {
    ensureSymlink(realFilePath, symlinkPath).catch(error => {
      skipOnWindowsDisabledSymlinks(error, this);
      throw error;
    });
  });
});
```

### Scripts

#### Isolated tests runner `scripts/run-isolated.js`

Runs each test file in fresh distinct node.js process.

Supports below options and test file patterns.

_Note: it doesn't support or passes through any options to Mocha. it is expected that they're secured at configuration file level_

##### _`--skip-fs-cleanup-check`_

Do not validate file system side effects (this also effectively turns on parallel test run, as file system validation to be reliable requires consecutive run)

##### _`--pass-through-aws-creds`_

Isolated tests by default are run with no (but mandatory a `PATH`) env variables, and that also includes eventual `AWS_*` env vars. This setting will ensure they're passed through

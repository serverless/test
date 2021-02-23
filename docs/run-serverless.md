# run-serverless

Runs complete serverless instance in preconfigured environment, optionally with some plugins and/or lifecycle engine hooks disabled.

Optionally serverless instance can be freshly required with specific modules mocked

## Usage

```javascript
const runServerless = require('@serverless/test/run-serverless');

describe('Some suite', () => {
  it('Some test that involves creation of serverless instance', function () {
    runServerless(serverlessDir, {
      // Options, see below documentation
    }).then(({ serverless, stdoutData, cfTemplate }) => {
      // Resolved after serverless.run() finalizes.
      // Examine here expected outcome
    });
  });
});
```

`serverlessDir` should point a path to Serverless Framework directory which we want to run test against.

_**Important:** [setup-run-serverless-fixture-engine](./setup-run-serverless-fixtures-engine.md) enriches `runServerless` with [extra options](./setup-run-serverless-fixtures-engine.md#extra-runserverless-options) to those listed below_

### Supported options

#### `cwd` (interchangeable with `config` and `noService` options)

Working directory in which supposedly `serverless` is run. Usually it's about a path to
serverless service test fixture directory.

If test can be fully accomplished just by processing serverless config, alternatively `config` option can be passed (no need then to create physical fixture directory)

#### `config` (interchangeable with `cwd` and `noService` options)

Plain object serverless config to be used to run serverless test.

It'll be written to `serverless.json` file in provisioned temporary service directory, then against that directory serverless instance will be run.

#### `noService` (interchangeable with `cwd` and `config` options)

Request a run not in a service context. Current working directory will be set to homedir (which in test file runs usually points a temporary folder)

#### `cliArgs` (optional)

CLI arguments (e.g. `['deploy', '--stage', 'beta']`), defaults to `[]`

#### `env` (optinal)

Eventual environment variables (e.g. `{ SLS_DEBUG: '*' }`)

#### `envWhitelist` (optional)

`runServerless` is run with mocked `process.env` and no env vars from original `process.env` exposed.

If there's a need to expose some env vars from original env, provide this option with expected var names to expose

#### `pluginPathsBlacklist`

Paths to plugins of which registered hooks should not be invoked (note plugin will remain initialized)

Path can be absolute or relative against `serverlessPath`.

#### `lifecycleHookNamesBlacklist`

List of lifecycle hooks for which callbacks should not be run.

#### `lastLifecycleHookName`

Name of the last lifecycle hook to be run. Registered hooks for all following evens will be discarded

#### `awsRequestStubMap`

When provided, then `serverless.getProvider('aws').request` will be stubbed, and provided response map will ensure expected responses.

See [configure-aws-request-stub](./configure-aws-request-stub.md) for more info

#### `shouldStubSpawn`

Whether spawn command executions (as configured through `child-process-ext/spawn`) should be stubbed (so not really executed).

Stub is preconfigured to resolve successfully with `{}` (an empty object).

Note: It implies relying on `modulesCacheStub`, so all serverless framework modules will be freshly required.

#### `shouldUseLegacyVariablesResolver`

By default `runServerless` runs a new variables resolver to resolve any variables in service configuration

If for a valid reason just legacy resolver should be used (e.g. we may want to test it) it can be forced with this setting

#### `modulesCacheStub` (optional)

When provided, serverless instance will be created out of freshly required module,
and provided cache map will be used as stub for underlying required modules.

#### `awsRequestStubMap` (optional)

Stub for any AWS SDK requests. See [configure-aws-request-stub](./configure-aws-request-stub.md) for more info.

#### `hooks` (optional)

Optional hooks, to be run in prepared mocked environemnt.

Supported hooks:

##### `before(Serverless, { cwd })`

Run as first step of evaluation (before `Serverless` instance is initialized, but after constructor is loaded).

It's invoked with `Serverless` constructor and resolved `cwd` as meta data in arguments

##### `beforeInstanceInit(serverless)`

Run right after `serverless` instance is constructed, but before `severlesss.init()` is invoked.
It's invoked with just created `serverless` instances.

##### `after(serverless)`

Run as last step of evaluation (after `serverless.run()` resolves).

It's invokved with `serverless` instance passed as first argument

### Result values

- `serverless` - Instance of Serverless Framework
- `stdoutData` - Written data to `process.stdout`
- `cfTemplate` - (only if it was generated) CloudFormation template
- `awsNaming` - AWS provider naming instance

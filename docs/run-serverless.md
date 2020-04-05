# run-serverless

Runs complete serverless instance in preconfigured environment, optionally with some plugins and/or lifecycle engine hooks disabled.

Optionally serverless instance can be freshly required with specific modules mocked

## Usage

```javascript
const runServerless = require('@serverless/test/run-serverless');

describe('Some suite', () => {
  it('Some test that involves creation of serverless instance', function () {
    runServerless(serverlessPath, {
      // Options, see below documentation
    }).then((serverless) => {
      // Resolved after serverless.run() finalizes.
      // Examine here expected outcome
    });
  });
});
```

`serverlessPath` should point a path to Serverless Framework which we want to run test against.

### Supported options

#### `cwd` (interchangeable with `config` option)

Working directory in which supposedly `serverless` is run. Usually it's about a path to
serverless service test fixture directory.

If test can be fully accomplished just by processing serverless config, alternatively `config` option can be passed (no need then to create physical fixture directory)

#### `config` (interchangeable with `cwd` option)

Plain object serverless config to be used to run serverless test.

It'll be written to `serverless.json` file in provisioned temporary service directory, then against that directory serverless instance will be run.

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

#### `modulesCacheStup` (optional)

When provided, serverless instance will be created out of freshly required module,
and provided cache map will be used as stub for underlying required modules.

#### `hooks` (optional)

Optional hooks, to be run in prepared mocked environemnt.

Supported hooks:

##### `before(Serverless, { cwd })`

Run as first step of evaluation (before `Serverless` instance is initialized, but after constructor is loaded).

It's invoked with `Serverless` constructor and resolved `cwd` as meta data in arguments

##### `after(serverless)`

Run as last step of evaluation (after `serverless.run()` resolves).

It's invokved with `serverless` instance passed as first argument

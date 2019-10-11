# run-serverless

Runs complete serverless instance in preconfigured environment, limited to predefined plugins and hook events.

Optionally serverless instance can be freshly required with specifc modules mocked

## Usage

```javascript
const runServerless = require('@serverless/test/run-serverless');

describe('Some suite', () => {
  it('Some test that involves creation of serverless instance', function() {
    runServerless(serverlessPath, {
      // Options, see below documentation
    }).then(serverless => {
      // Resolved after serverless.run() finalizes.
      // Examine here expected outcome
    });
  });
});
```

`serverlessPath` should point a path to Serverless Framework which we want to run test against.

### Supported options

#### `cwd`

Working directory in which supposedly `serverless` is run

#### `cliArgs` (optional)

CLI arguments (e.g. `['deploy', '--stage', 'beta']`), defaults to `[]`

#### `env` (optinal)

Eventual environment variables (e.g. `{ SLS_DEBUG: '*' }`)

#### `pluginPathsWhiteList`

Paths to plugins of which registered hooks should be invoked.  
Note: All other plugins will be naturally initialized but no hooks they registered will be invoked.

Path can be absolute or relative against `serverlessPath`.

#### `lifecycleHookNamesWhitelist`

List of lifecycle hooks for which callbacks should be run.
Registered callbacks for all other scheduled hooks will be ignored

#### `modulesCacheStup` (optional)

When provided, serverless instance will be created out of freshly required module,
and provided cache map will be used as stub for underlying required modules.

#### `hooks` (optional)

Optional hooks, to be run in prepared mocked environemnt.

Supported hooks:

##### `before`

Run as first step of evaluation (before `Serverless` instance is initialized, but after constructor is loaded)

##### `after`

Run as last step of evaluation (after `serverless.run()` resolves)

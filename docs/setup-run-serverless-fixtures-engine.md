# setup-run-serverless-fixtures-engine

Initializes [fixtures engine](./get-fixtures-engine.md) for a folder where serverless service fixtures are placed (each in different top level folder)
and returns [runServerless](./run-serverless.md) runner with direct access to created fixtures.

## Usage

Should be initialized by passing a `fixturesDir` (path to directory that contains all fixtures, each in its own directory), and either `serverlessDir` (path to Serverless Framework installation) or `setupServerlessDir` (a function which does a one time setup of Serverless Framework, this can be an async opreation)

```javascript
const runServerless = require('@serverless/test/setup-run-serverlessfixtures-engine')({
  fixturesDir: path.resolve(__dirname, 'fixtures'),
  serverlessDir: path.resolve(__dirname, '..'),
});
```

Returned [`runServerless`](./run-serverless.md)) function is stripped of `serverlessPath` argument and takes extended options directly. See below section for documentation on extra options.

For more information about fixtures check [get-fixtures-engine.md](./get-fixtures-engine.md).

Note that `runServerless` result has [fixture engine result](./get-fixtures-engine.md#return-data) exposed on `fixtureData` property.;

### Extra `runServerless` options

#### `fixture` (interchangeable with `config`, `cwd` and `noService` options)

Name of a fixture against which `runServerless` should be run

#### `configExt`

Extension to basic (provided by _fixture_) service configuration

#### `serverlessDir`

Custom serverless dir, if we want to issue the run against non default serverless installation

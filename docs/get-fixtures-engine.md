# get-fixtures-engine

Initializes _fixtures_ engine for a folder where Servelress service fixtures are placed (each in different top level folder)

Fixtures engine provides out of a box means to extend existing fixtures (enrich/tweak configurations of existing fixutres for testing purpused) and to cleanup eventually created artifacts after testing is made

## Usage

```javascript
const fixturesEngine = require('@serverless/test/get-fixtures-engine')(fixturesPath);

// Retrieve path "http" fixture, resolution is same as with path.join(fixturesPath, fixturePath)
// however it additionally:
// - Crashes immediately if fixtures is not found
// - Registers fixtures for cleanup operation after testing is done
const pathToHttpFixture = fixturesEngine.http;

// Generates extended fixture (in temporary path) and returns its path
const pathToExtendedHttpFixture = await fixturesEngine.extend('http', {
  provider: { logs: { restApi: true } },
});

// Cleanup aafter testing is done (it'll remove eventually created .serverless folders)
fixturesEngine.cleanup({
  // (optional)
  extraPaths: ['eventualExtraPathInServiceThatNeedsToBeRemoved'],
});
```

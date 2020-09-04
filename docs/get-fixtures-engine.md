# get-fixtures-engine

Initializes _fixtures_ engine for a folder where Servelress service fixtures are placed (each in different top level folder)

Fixtures engine provides out of a box means to extend existing fixtures (enrich/tweak configurations of existing fixutres for testing purpused) and to cleanup eventually created artifacts after testing is made

## Usage

Fixture engine should be initialized by passing a path to directory that contains all fixtures (each in its own directory):

```javascript
const fixtures = require('@serverless/test/get-fixtures-engine')(fixturesPath);
```

### 1. Retrieve fixture as is

Simply to resolve full path to existing fixture rely on `fixtures.map[fixtureDirectoryName]`.
It'll respond with full path to fixture. However it'll additionally:

- Crash immediately if fixture is not found
- Registers fixtures for cleanup operation after testing is done

```javascript
const pathToHttpFixture = fixturesEngine.http;
```

### 2. Retrieve fixture and extend its service configuration

In this case given fixture is copied to a temp dir where modified `serverless.yml` configuration is placed

```javascript
// Generates extended fixture (in temporary path) and returns its path
const pathToExtendedHttpFixture = await fixturesEngine.extend('http', {
  provider: { logs: { restApi: true } },
});
```

### Cleanup after testing is done

For proper cleanup `fixtures.cleanup` needs to be registered in `after`:

```javascript
after(fixtures.cleanup);
```

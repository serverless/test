# setup-fixtures-engine

Initializes _fixtures_ engine for a folder where Serverless service fixtures are placed (each in different top level folder)

Fixtures engine provides out of a box means to extend existing fixtures (enrich/tweak configurations of existing fixutres for testing purpused) and to cleanup eventually created artifacts after testing is made

## Usage

Fixture engine should be initialized by passing a path to directory that contains all fixtures (each in its own directory):

```javascript
const fixtures = require('@serverless/test/setup-fixtures-engine')(fixturesDir);
```

### Preparing a fixture

Fixture is a simple, minimal service, configured to help test Framework functionalities.

Fixture may have `_setup.js` script, which should cover an additional setup (if it's needed), before fixture is used.

Fixture may have `package.json` which lists eventual dependencies to be installed.
If `package.json` is found. Fixture setup involves `npm install`

### Resolving a fixture

Through a `fixtures.setup(fixtureName, options)` we retrieve a temporary path to fully setup copied fixture.

Each `setup` call, prepares different fixture copy.

Fixture is prepared in temporary directory which is removed after tests are done.

Each setup fixture is provided with unique service name, which allows to use them for integration tests without risking service name collisions.

#### Supported options

##### `configExt`

Config extesions which should be deeply merged onto existing config. Through that existing configuration can be additionally detailed for tested case. We may add new functions or configure extra events.

```javascript
// Generates extended fixture (in temporary path) and returns its path
const pathToExtendedHttpFixture = await fixturesEngine.setup('http', {
  configExt: { provider: { logs: { restApi: true } } },
});
```

#### Returned data

`fixturesEngine.setup(..)` resolves with object that has following properties:

##### `servicePath`

Path to setup fixture

##### `serviceConfig`

Service configuration as setup in fixture

##### `updateConfig(configExt)`

Method throuch which we can update service config as installed in fixture

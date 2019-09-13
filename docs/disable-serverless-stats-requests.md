# disable-serverless-stats-requests

Important when testing involves [serverless](https://github.com/serverless/serverless/) instances.

Ensures serverless doesn't issue any tracking HTTP requests.

_**Important**: Run, before any serverless modules are loaded_

## Usage

```javascript
const disableServerlessStatsRequests = require('@serverless/test/disable-serverless-stats-requests')';

// Needs to be invoked before Serveless library and its modules are loaded
disableServerlessStatsRequest(pathToServerless);

// Load serverless
const Serverless = require(pathToServerless);
```

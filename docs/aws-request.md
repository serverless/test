# aws-request

Issue AWS SDK request with built-in retry (on retryable errors) mechanism.

## Usage

```javascript
awsRequest(serviceNameOrConfig, methodName, params);
```

### `serviceNameOrConfig`

Service name (e.g. `'CloudFormation'`), or a config, if we need to pass a parameters to contrusctors, e.g.:

```javascript
{
  "name": "CloudFormation",
  "params": {
    "region": "us-east-2" // Override 'us-east-1' default
  }
}
```

### `methodName`

Given service method name e.g. `describeStacks`

### `params`

Invocation params, passed as direct input to AWS SDK method.

## Example:

```javascript
const awsRequest = require('@serverless/test/aws-request');

const result = await awsRequest('CloudFormation', 'describeStacks', { StackName: stackName });
```

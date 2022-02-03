# aws-request

Issue AWS SDK request with built-in retry (on retryable errors) mechanism.

## Usage

```javascript
awsRequest(clientOrClientConfig, methodName, params);
```

### `clientOrClientConfig`

Client constructor (e.g. `require('@aws-sdk/client-cloudformation').CloudFormation`), or a config, if we need to pass a parameters to client constructor, e.g.:

```javascript
{
  "client": require('@aws-sdk/client-cloudformation').CloudFormation,
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
const { CloudFormation } = require('@aws-sdk/client-cloudformation');

const result = await awsRequest(CloudFormation, 'describeStacks', { StackName: stackName });
```

# configure-aws-request-stub

An utility that helps to configure AWS request stubs.

To be set on Framework's AWS `provider` object

Takes `provider` instance, and sets a setup, which returns preconfigured by map responses. Values can be scalars or functions (including `sinon.stub`, etc.).

```javascript
const configureAwsRequestStub = require('@serverless/test/configure-aws-request-stub');

configureAwsRequestStub(awsProvider, {
  CloudFormation: {
    // Return { StackResourceDetail: {} } for CloudFormation.describeStackResource request
    describeStackResource: { StackResourceDetail: {} },
  },
});
```

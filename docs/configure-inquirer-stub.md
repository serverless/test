# configure-inquirer-stub

An utility that helps to configure inquirer prompt stubs.

Takes inquirer instance (to have `prompt` method stubbed) and a config map of mocked responses.

e.g. following stubs, mimic a complete AWS credentials setup that could configured for interactive CLI

```javascript
const inquirer = require('inquirer');
const configureInquirerStub = require('@serverless/test/configure-inquirer-stub');

configureInquirerStub(inquirer, {
  confirm: { shouldSetupAwsCredentials: true, hasAwsAccount: true },
  input: { accessKeyId, secretAccessKey },
});
```

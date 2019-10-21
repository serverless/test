# resolve-aws-env

Resolves clean, deterministic environment object, limited to mandatory variables that affects system resolution of fundamental locations as home or tmp directories.

Additionally ensures all AWS related authentication variables are also copied onto returned env

```javascript
const resolveEnv = require('@serverless/test/resolve-aws-env');

const env = resolveEnv();

// Run process in isolated env
await spawn(binaryPath, args, { env });
```

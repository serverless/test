# resolve-env

Resolves clean, deterministic environment object, limited to mandatory variables that affects system resolution of fundamental locations as home or tmp directories.

```javascript
const resolveEnv = require('@serverless/test/resolve-env');

const env = resolveEnv();

// Run process in isolated env
await spawn(binaryPath, args, { env });
```

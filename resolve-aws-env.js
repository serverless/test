'use strict';

const resolveEnv = require('./resolve-env');

module.exports = () => {
  const env = resolveEnv({
    whitelist: [
      'SERVERLESS_ACCESS_KEY',
      'SERVERLESS_PLATFORM_TEST_APP',
      'SERVERLESS_PLATFORM_TEST_ORG',
    ],
  });
  for (const envVarName of Object.keys(process.env)) {
    if (envVarName.startsWith('AWS_')) env[envVarName] = process.env[envVarName];
  }
  return env;
};

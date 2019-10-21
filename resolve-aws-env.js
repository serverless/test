'use strict';

const resolveEnv = require('./resolve-env');

module.exports = () => {
  const env = resolveEnv();
  for (const envVarName of Object.keys(process.env)) {
    if (envVarName.startsWith('AWS_')) env[envVarName] = process.env[envVarName];
  }
  if (process.env.SERVERLESS_ACCESS_KEY) {
    env.SERVERLESS_ACCESS_KEY = process.env.SERVERLESS_ACCESS_KEY;
  }
  return env;
};

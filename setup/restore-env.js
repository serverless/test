'use strict';

const { deferredRunner } = require('./mocha-reporter');

const hasOwnProperty = Object.prototype.hasOwnProperty;

const startEnv = Object.assign(Object.create(null), process.env);
deferredRunner.then((runner) =>
  runner.on('suite end', (suite) => {
    if (!suite.parent || !suite.parent.root) return; // Apply just on top level suites
    for (const key of Object.keys(process.env)) {
      if (!(key in startEnv)) delete process.env[key];
    }
    for (const key of Object.keys(startEnv)) {
      if (!hasOwnProperty.call(process.env, key) || process.env[key] !== startEnv[key]) {
        process.env[key] = startEnv[key];
      }
    }
  })
);

'use strict';

const { deferredRunner } = require('./mocha-reporter');

const startCwd = process.cwd();
deferredRunner.then(runner =>
  runner.on('suite end', suite => {
    if (!suite.parent || !suite.parent.root) return; // Apply just on top level suites
    if (process.cwd() !== startCwd) process.chdir(startCwd);
  })
);

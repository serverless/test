'use strict';

const os = require('os');
const { deferredRunner } = require('./mocha-reporter');

deferredRunner.then((runner) => {
  const homedir = os.homedir();
  process.chdir(homedir);

  runner.on('suite end', (suite) => {
    if (!suite.parent || !suite.parent.root) return; // Apply just on top level suites
    if (process.cwd() !== homedir) process.chdir(homedir);
  });
});

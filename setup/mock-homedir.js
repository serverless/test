'use strict';

const os = require('os');
const { emptyDirSync } = require('fs-extra');
const processTmpDir = require('../process-tmp-dir');
const { deferredRunner } = require('./mocha-reporter');
const rmTmpDirIgnorableErrorCodes = require('../lib/private/rm-tmp-dir-ignorable-error-codes');

os.homedir = () => processTmpDir;
if (process.env.USERPROFILE) process.env.USERPROFILE = processTmpDir;
if (process.env.HOME) process.env.HOME = processTmpDir;

deferredRunner.then((runner) => {
  runner.on('suite end', (suite) => {
    if (!suite.parent || !suite.parent.root) return;

    // Cleanup temp homedir after each top level test run
    try {
      emptyDirSync(processTmpDir);
    } catch (error) {
      if (rmTmpDirIgnorableErrorCodes.has(error.code)) return;
      // If some of the tests timed out, error could be caused by ongoing operation
      // which still writse to temp dir, ignore it.
      if (suite.tests.some((test) => test.timedOut)) return;
      process.nextTick(() => {
        // Crash in next tick, as otherwise Mocha goes bonkers
        throw error;
      });
    }
  });
});

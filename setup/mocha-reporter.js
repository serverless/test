'use strict';

const { inspect } = require('util');

// Unhandled rejections are not exposed in Mocha, enforce it
// https://github.com/mochajs/mocha/issues/2640
process.on('unhandledRejection', (err) => {
  throw err;
});

const Spec = require('mocha/lib/reporters/spec');
const Runner = require('mocha/lib/runner');

let resolveRunner;
class ServerlessSpec extends Spec {
  constructor(runner) {
    super(runner);
    resolveRunner(runner);
    process.nextTick(() => {
      // Ensure faster tests propagation
      // It's to expose errors otherwise hidden by race conditions
      // Reported to Mocha with: https://github.com/mochajs/mocha/issues/3920
      //
      // Override needs to be done in next tick to ensure other Mocha extensions attach to resolved
      // runner before any tests are being run
      // (Race condition was observed, in which `runner` was resolved afterwards)
      Runner.immediately = process.nextTick;
    });

    process.on('uncaughtException', (err) => {
      if (
        !process
          .listeners('exit')
          .find((listener) => String(listener).includes('process.exitCode = Math.min(code, 255)'))
      ) {
        if (process.listenerCount('uncaughtException') === 1) {
          // Mocha didn't setup listeners yet, ensure error is exposed
          throw err;
        }

        // Mocha ignores uncaught exceptions if they happen in conext of skipped test, expose them
        // https://github.com/mochajs/mocha/issues/3938
        if (runner.currentRunnable.isPending() || runner._abort) throw err; // eslint-disable-line no-underscore-dangle

        // Uncaught exception may not be exposed, ensure it is
        process.stderr.write(`Uncaught exception: ${inspect(err, { colors: true })}\n`);
        return;
      }
      // If there's an uncaught exception after test runner wraps up
      // Mocha reports it with success exit code: https://github.com/mochajs/mocha/issues/3917
      // Workaround that (otherwise we may end with green CI for failed builds):
      process.removeAllListeners('exit');
      throw err;
    });
  }
}
ServerlessSpec.deferredRunner = new Promise((resolve) => (resolveRunner = resolve));

module.exports = ServerlessSpec;

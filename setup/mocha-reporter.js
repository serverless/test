'use strict';

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
  }
}
ServerlessSpec.deferredRunner = new Promise((resolve) => (resolveRunner = resolve));

module.exports = ServerlessSpec;

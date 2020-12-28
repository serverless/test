'use strict';

// Unhandled rejections are not exposed in Mocha, enforce it
// https://github.com/mochajs/mocha/issues/2640
process.on('unhandledRejection', (err) => {
  throw err;
});

const EventEmitter = require('events');

const runnerEmitter = new EventEmitter();

const Mocha = require('mocha/lib/mocha');

const mochaRun = Mocha.prototype.run;
Mocha.prototype.run = function (fn, ...args) {
  const runner = mochaRun.call(this, fn, ...args);
  if (runner.constructor.name === 'Runner') runnerEmitter.emit('runner', runner);
  runner.constructor.immediately = process.nextTick;
  return runner;
};

module.exports = { runnerEmitter };

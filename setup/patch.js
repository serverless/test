'use strict';

// Unhandled rejections are not exposed in Mocha, enforce it
// https://github.com/mochajs/mocha/issues/2640
process.on('unhandledRejection', (err) => {
  throw err;
});

const EventEmitter = require('events');

const runnerEmitter = new EventEmitter();

const isObject = require('type/object/is');
const Mocha = require('mocha/lib/mocha');
const { serialize } = require('mocha/lib/nodejs/serializer');

const removeCyclicReferences = (object, parentObjects = new Set()) => {
  const entries = Array.isArray(object) ? object.entries() : Object.entries(object);
  parentObjects = new Set([...parentObjects, object]);
  for (const [key, value] of entries) {
    if (!isObject(value)) continue;
    if (parentObjects.has(value)) delete object[key];
    else removeCyclicReferences(value, parentObjects);
  }
};

const mochaRun = Mocha.prototype.run;
Mocha.prototype.run = function (fn, ...args) {
  const runner = mochaRun.call(
    this,
    (result) => {
      // Workaround https://github.com/mochajs/mocha/issues/4552
      const serialized = serialize(result);
      const stringifiedResult = (() => {
        try {
          return JSON.stringify(serialized);
        } catch (error) {
          removeCyclicReferences(serialized);
          return JSON.stringify(serialized);
        }
      })();
      return fn.call(this, JSON.parse(stringifiedResult));
    },
    ...args
  );
  if (runner.constructor.name === 'Runner') runnerEmitter.emit('runner', runner);
  // Ensure faster tests propagation
  // It's to expose errors otherwise hidden by race conditions
  // Reported to Mocha with: https://github.com/mochajs/mocha/issues/3920
  runner.constructor.immediately = process.nextTick;
  return runner;
};

module.exports = { runnerEmitter };

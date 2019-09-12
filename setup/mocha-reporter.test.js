'use strict';

const assert = require('assert').strict;
const MochaSpec = require('mocha/lib/reporters/spec');
const Reporter = require('./mocha-reporter');

const isPrototypeOf = Object.prototype.isPrototypeOf;

assert(isPrototypeOf.call(MochaSpec, Reporter));
assert(Reporter.deferredRunner instanceof Promise);

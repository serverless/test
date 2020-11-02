'use strict';

const assert = require('assert');
const MochaSpec = require('mocha/lib/reporters/spec');
const Reporter = require('../../setup/mocha-reporter');

const isPrototypeOf = Object.prototype.isPrototypeOf;

assert(isPrototypeOf.call(MochaSpec, Reporter));
assert(Reporter.deferredRunner instanceof Promise);

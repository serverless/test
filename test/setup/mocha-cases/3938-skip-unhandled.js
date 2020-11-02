// https://github.com/mochajs/mocha/issues/3938

'use strict';

// Expected to fail (race condition dependent, so it not always does)
describe('test', () => {
  it('test1', () => {
    setTimeout(() => {
      throw new Error('Uncaught');
    }, 3);
  });
  it('test2', function () {
    this.skip();
  });
  it('test3', function () {
    this.skip();
  });
  it('test4', function () {
    this.skip();
  });
  it('test5', function () {
    this.skip();
  });
  it('test6', function () {
    this.skip();
  });
  it('test7', function () {
    this.skip();
  });
  it('test8', function () {
    this.skip();
  });
  it('test9', function () {
    this.skip();
  });
  it('test10', function () {
    this.skip();
  });
  it('test11', function () {
    this.skip();
  });
  it('test12', function () {
    this.skip();
  });
  it('test13', function () {
    this.skip();
  });
  it('test14', function () {
    this.skip();
  });
  it('test15', function () {
    this.skip();
  });
  it('test16', function () {
    this.skip();
  });
  it('test17', function () {
    this.skip();
  });
  it('test18', function () {
    this.skip();
  });
  it('test19', function () {
    this.skip();
  });
  it('test20', function () {
    this.skip();
  });
});

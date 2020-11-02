// https://github.com/mochajs/mocha/issues/3920

'use strict';

// Expected to succeed (race condition dependent, so it not always does)
describe('test', () => {
  let foo;

  before(() => (foo = 'in test'));
  after(() => (foo = 'out of test'));

  it('test', () => {
    setTimeout(() => {
      if (foo === 'in test') throw new Error('Unexpected state');
    });
  });
});

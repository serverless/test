// https://github.com/mochajs/mocha/issues/3917

'use strict';

// Expected to fail. Error on Mocha side is that it resolves process with success exit coce
describe('test', () => {
  it('test', () => {
    setTimeout(() => {
      throw new Error('Unexpected crash');
    }, 10);
  });
});

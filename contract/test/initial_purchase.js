var EthGrid2 = artifacts.require("EthGrid2");
const BN = require('bn.js');

console.log('Running a test');

contract('EthGrid2', (accounts) => {
  it('Check that we have a single ownership block which covers the entire region', () => {
    return EthGrid2.deployed().then((instance) => {
      return instance.ownership.call(0);
    }).then((ownership) => {
      assert.equal(ownership[0], accounts[0]);
      assert.equal(ownership[1].toString(), "0");
    });
  });

  it ('Purchase one score of initial block', () => {
    return EthGrid2.deployed().then((instance) => {
      return instance.ownership.call(0);
    });
  });
});
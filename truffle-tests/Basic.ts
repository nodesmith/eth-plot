import { BigNumber } from 'bignumber.js';
import { assert } from 'chai';
import { beforeEach } from 'mocha';
import * as Web3 from 'web3';

import { EthGrid2 } from '../gen-src/EthGrid2';

// In order to benefit from type-safety, we re-assign the global web3 instance injected by Truffle
// with type `any` to a variable of type `Web3`.
const web3: Web3 = (global as any).web3;

const ethGridContract = artifacts.require<EthGrid2>('./EthGrid2.sol');
const STANDARD_GAS = '2000000';

contract('EthGrid2', (accounts: string[]) => {
  let ethGrid: EthGrid2;
  beforeEach(async () => {
    const eg = await ethGridContract.deployed();
    console.log('Getting EthGrid2 contract at address: ' + eg.address);
    ethGrid = await EthGrid2.createAndValidate(web3, eg.address);
  });

  it('Addresses saved as expected', async () => {
    assert.isDefined(ethGrid);
    const v = await ethGrid.admin;
    assert.isDefined(v);
  });
});

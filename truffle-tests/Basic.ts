import { BigNumber } from 'bignumber.js';
import { assert } from 'chai';
import { beforeEach } from 'mocha';
import { Store } from 'redux';
import * as sinon from 'sinon';
import * as Web3 from 'web3';

import { promisify } from '../gen-src/typechain-runtime';
import { EthGrid } from '../gen-src/EthGrid';
import * as AccountActions from '../src/actionCreators/AccountActions';
import * as DataActions from '../src/actionCreators/DataActions';
import { changePurchaseStep } from '../src/actionCreators/PurchaseActions';
import { computePurchaseInfo } from '../src/data/ComputePurchaseInfo';
import { Rect } from '../src/models';
import { RootState } from '../src/reducers';
import { configureStore }  from '../src/store/configureStore.prod';

// In order to benefit from type-safety, we re-assign the global web3 instance injected by Truffle
// with type `any` to a variable of type `Web3`.
const web3: Web3 = (global as any).web3;

const ethGridContract = artifacts.require<EthGrid>('./EthGrid.sol');
const STANDARD_GAS = '2000000';

const initializeStoreAndLoadPlots = async (contractAddress: string, web3Provider: string, currentAddress: string): Promise<Store<RootState>> => {
  const store = configureStore();
  store.dispatch(DataActions.setWeb3Config({ contractAddress, web3Provider }));
  
  const loadDataThunk = AccountActions.loadAndWatchEvents(store.getState().data.contractInfo, currentAddress);
  await loadDataThunk(store.dispatch);

  return store;
};

const getBalance = async (account: string): Promise<BigNumber> => {
  const balance = await promisify(web3.eth.getBalance, [account]);
  return new BigNumber(balance);
};

contract('EthGrid', (accounts: string[]) => {
  let ethGrid: EthGrid;
  let store: Store<RootState>;
  before(async () => {
    const deployed = await ethGridContract.deployed();
    ethGrid = await EthGrid.createAndValidate(web3, deployed.address);

    const provider = web3.currentProvider.host;
    store = await initializeStoreAndLoadPlots(ethGrid.address, provider, accounts[0]);
  });

  after(async () => {
    await AccountActions.unregisterEventListners();
  });

  it('Contract initialized as expected', async () => {
    const loadedPlots = store.getState().data.plots;
    assert.equal(loadedPlots.length, 1);
    assert.deepEqual(loadedPlots[0].rect, { x: 0, y: 0, w: 250, h: 250, x2: 250, y2: 250 });
    assert.equal(loadedPlots[0].owner, accounts[0]);
  });

  it('Purchase a single plot', async () => {
    const state = store.getState();
    const rectToPurchase: Rect = { x: 25, y: 40, w: 12, h: 4, x2: 37, y2: 44 };
    const purchaseData = computePurchaseInfo(rectToPurchase, state.data.plots).purchaseData!;
    const purchaseUrl = 'https://spacedust.io/samms_test';
    const buyoutPrice = 4000;
    const ipfsHash = 'abcxyz123';

    const sellerAccount = accounts[0];
    const buyerAccount = accounts[4];
    const buyerBalanceOld = await getBalance(buyerAccount);
    const sellerBalanceOld = await getBalance(sellerAccount);
    const contractBalanceOld = await getBalance(ethGrid.address);

    const purchaseAction = DataActions.purchasePlot(
      state.data.contractInfo,
      state.data.plots,
      rectToPurchase,
      purchaseData.purchasePrice,
      purchaseUrl,
      ipfsHash,
      buyoutPrice.toString(),
      changePurchaseStep,
      buyerAccount);

    // Make the purchase
    const transactionHash = await purchaseAction(store.dispatch);

    // Reload the data and make sure that we have the right number of plots and right owners
    await AccountActions.loadAndWatchEvents(store.getState().data.contractInfo, buyerAccount)(store.dispatch);

    const loadedPlots = store.getState().data.plots;
    assert.equal(loadedPlots.length, 2);
    assert.deepEqual(loadedPlots[1].rect, rectToPurchase);
    assert.equal(loadedPlots[1].owner, accounts[4]);

    // Look up some transaction info and make sure that the buyer's balance has decreased as expected
    const buyerBalanceNew = await getBalance(buyerAccount);
    const balanceDifference = buyerBalanceOld.sub(buyerBalanceNew);
    const blockInfo = <Web3.BlockWithoutTransactionData>(await promisify(web3.eth.getBlock, ['latest']));
    assert.equal(transactionHash, blockInfo.transactions[0]);
    const expectedDifference = new BigNumber(blockInfo.gasUsed).plus(new BigNumber(purchaseData.purchasePrice));
    assert.equal(expectedDifference.toString(), balanceDifference.toString());

    const sellerBalanceNew =  await getBalance(sellerAccount);
    const sellerBalanceDifference = sellerBalanceNew.minus(sellerBalanceOld);
    assert.equal(purchaseData.plotPrice, sellerBalanceDifference.toString());

    const contractBalanceNew = await getBalance(ethGrid.address);
    const contractBalanceDifference = contractBalanceNew.minus(contractBalanceOld);
    assert.equal(purchaseData.feePrice, contractBalanceDifference.toString());

    // Check that the owner can withdraw the funds
    const ownerAddress = await ethGrid.owner;
    const ownerBalanceOld = await getBalance(ownerAddress);
    const withdrawGasCost = await ethGrid.withdrawTx(ownerAddress).estimateGas({ from: ownerAddress, gas: STANDARD_GAS });
    await ethGrid.withdrawTx(ownerAddress).send({ from: ownerAddress, gas: STANDARD_GAS });
    const ownerBalanceNew = await getBalance(ownerAddress);
    assert.equal(new BigNumber(purchaseData.feePrice).minus(withdrawGasCost).toString(), ownerBalanceNew.minus(ownerBalanceOld).toString());

    // Finally, check that we got the sold event we're expecting
    const purchaseEvents = await ethGrid.PlotSectionSoldEvent({}).get({});
    assert.equal(1, purchaseEvents.length);
    assert.equal(buyerAccount, purchaseEvents[0].args.buyer);
    assert.equal(sellerAccount, purchaseEvents[0].args.seller);
    assert.equal(purchaseData.plotPrice, purchaseEvents[0].args.totalPrice.toString());
    assert.equal(0, purchaseEvents[0].args.zoneId);
  });
});

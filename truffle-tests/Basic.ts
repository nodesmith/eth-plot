import { BigNumber } from 'bignumber.js';
import { assert } from 'chai';
import { beforeEach } from 'mocha';
import { Store } from 'redux';
import * as sinon from 'sinon';
import * as Web3 from 'web3';

import { EthGrid } from '../gen-src/EthGrid';
import * as DataActions from '../src/actionCreators/DataActions';
import { RootState } from '../src/reducers';
import { configureStore }  from '../src/store/configureStore';

// In order to benefit from type-safety, we re-assign the global web3 instance injected by Truffle
// with type `any` to a variable of type `Web3`.
const web3: Web3 = (global as any).web3;

const ethGridContract = artifacts.require<EthGrid>('./EthGrid.sol');
const STANDARD_GAS = '2000000';

const initializeStoreAndLoadPlots = async (contractAddress: string, web3Provider: string): Promise<Store<RootState>> => {
  // return new Promise<Store<RootState>>((resolve, reject) => {
  //   const store = configureStore();
  //   store.dispatch(DataActions.setWeb3Config({ contractAddress, web3Provider }));
    
  //   // Subscribe to the changes here
  //   const subscription = store.subscribe(() => {
  //     const currentState = store.getState();
  //     if (!currentState.data.isFetchingPlots) {
  //       console.log('Not fetching plots. Loading is complete');
  //       subscription();
  //       resolve(store);
  //     }
  //   });

  //   const loadDataThunk = DataActions.fetchPlotsFromWeb3(store.getState().data.contractInfo);
  //   loadDataThunk(store.dispatch);
  // });



  const store = configureStore();
  store.dispatch(DataActions.setWeb3Config({ contractAddress, web3Provider }));
  
  const loadDataThunk = DataActions.fetchPlotsFromWeb3(store.getState().data.contractInfo);
  await loadDataThunk(store.dispatch);

  return store;
};



contract('EthGrid', (accounts: string[]) => {
  let ethGrid: EthGrid;
  let store: Store<RootState>;
  before(async () => {
    const deployed = await ethGridContract.deployed();
    ethGrid = await EthGrid.createAndValidate(web3, deployed.address);

    const provider = web3.currentProvider.host;
    store = await initializeStoreAndLoadPlots(ethGrid.address, provider);
  });

  it('Contract initialized as expected', async () => {
    const loadedPlots = store.getState().data.plots;
    assert.equal(loadedPlots.length, 1);

    // assert.isDefined(ethGrid);
    // const v = await ethGrid.admin;
    // assert.isDefined(v);
  });
});

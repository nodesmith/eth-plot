import * as DataActions from '../actionCreators/DataActions';

const configureStore = require('../store/configureStore.prod');
console.log('Configuring store');
const store = configureStore();

// Subscribe to the changes here
store.subscribe(() => {
  const currentState = store.getState();
  console.log(`Fetching plots = ${currentState.data.isFetchingPlots}`);
  if (!currentState.data.isFetchingPlots) {
    console.log('not fetching plots. Start buying plots');
    buyRandomPlots();
  }
});

const currentState = store.getState();
const loadDataThunk = DataActions.fetchPlotsFromWeb3(currentState.data.contractInfo);
loadDataThunk(store.dispatch);

const buyRandomPlots = () => {
  function purchaseRandomArea() {
    
    const x = Math.floor(Math.random() * 250);
    const y = Math.floor(Math.random() * 250);
    const w = Math.floor(Math.random() * Math.min(50, 250 - x));
    const h = Math.floor(Math.random() * Math.min(50, 250 - y));

    const rectToPurchase = {
      x: x,
      y: y,
      w: w,
      h: h,
      x2: x + w,
      y2: y + h
    };

    console.log(`Buying ${JSON.stringify(rectToPurchase)}`);

    // const purchaseInfo = DataActions.computePurchaseInfo(rectToPurchase, store.getState().data.plots);
    const state = store.getState();
    return DataActions.purchasePlot(state.data.contractInfo, state.data.plots, rectToPurchase, 'http://samm.com', 'abc123')(store.dispatch);
  };

  let buysRemaining = 10;
  function doWork() {
    buysRemaining--;
    purchaseRandomArea().then(() => {
      if (buysRemaining > 0) {
        doWork();
      }
    })
  };

  doWork();
};

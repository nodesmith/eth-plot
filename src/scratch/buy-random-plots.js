const Web3 = require('web3');
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;

const web3 = new Web3('http://localhost:9545');
const contractAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';

const PlotDataRepository = require('../data/PlotDataRepository');

const repo = new PlotDataRepository(web3, abi, contractAddress);
repo.initializeAsync().then(() => {
  console.log('Repository Initialized');

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

    return repo.purchasePlotAsync(rectToPurchase, {});
  };

  let buysRemaining = 1;
  function doWork() {
    buysRemaining--;
    purchaseRandomArea().then(() => {
      if (buysRemaining > 0) {
        doWork();
      }
    })
  };

  doWork();
});

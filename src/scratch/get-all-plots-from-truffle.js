const Web3 = require('web3');
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;

const web3 = new Web3('http://localhost:9545');
const contractAddress = '0x82d50ad3c1091866e258fd0f1a7cc9674609d254';

const PlotDataRepository = require('../data/PlotDataRepository');

const repo = new PlotDataRepository(web3, abi, contractAddress);
repo.initializeAsync().then(() => {
  console.log('Repository Initialized');
  console.log(repo.ownership);
});

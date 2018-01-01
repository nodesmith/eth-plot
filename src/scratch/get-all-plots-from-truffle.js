const Web3 = require('web3');
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;

const web3 = new Web3('http://localhost:9545');
const contractAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';

const PlotDataRepository = require('../data/PlotDataRepository');

const repo = new PlotDataRepository(web3, abi, contractAddress);
repo.initializeAsync().then(() => {
  console.log('Repository Initialized');
  console.log(repo.ownership);
});

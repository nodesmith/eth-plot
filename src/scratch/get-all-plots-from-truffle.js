const Web3 = require('web3');
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;

const web3 = new Web3('http://localhost:9545');
const contract = new web3.eth.Contract(abi, '0x345ca3e014aaf5dca488057592ee47305d9b3e10');

contract.methods.data(0).call().then(data => {
  console.log(data);
});

contract.methods.ownership(0).call().then(data => {
  console.log(data);
});

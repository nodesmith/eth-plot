# Using Truffle
npm install -g truffle
truffle compile
truffle develop

In truffle command prompt, run: 
migrate

Then:
var contract; EthGrid2.deployed().then(function(instance){ contract = instance;})

This saves the contract to the variable contract for future use.  You can interact directly with that variable now.

#Examples
contract.determineAreaCost.call(10, 10, 42, 3).then((num) => num.toString())

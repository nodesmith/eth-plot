# Using Truffle
npm install -g truffle

sed -i .bak 's/network_id: 4447/network_id: Math.floor(Math.random() * 20000) + 2028/; s/config.logger.log(`Truffle Develop started/config.logger.log(`Truffle Develop started with network id ${testrpcOptions.network_id}/' $(npm root -g)/truffle/build/cli.bundled.js

truffle compile

truffle develop

In truffle command prompt, run: 
migrate

Then:
var contract; EthGrid2.deployed().then(function(instance){ contract = instance;})

This saves the contract to the variable contract for future use.  You can interact directly with that variable now.

#Examples
contract.determineAreaCost.call(10, 10, 42, 3).then((num) => num.toString())

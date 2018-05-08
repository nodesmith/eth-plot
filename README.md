##eth-grid

To run:

- npm install
- *Optional* - Set the `CONTRACT_ADDRESS` and/or `WEB3_PROVIDER` environment variables to configure web3 (default to Ganache Addresses)
- `npm start`
- open localhost:3000

To run with ganache
- `npm install -g ganache-cli`
- `ganache-cli -i samm-test -d`
- `truffle migrate --network ganache --reset`

To run with truffle:

- Do everything above
- Open a new terminal window
- `cd contract`
- `truffle develop`
- In the truffle develop console which pops up, run the following
- `truffle migrate`
- `EthGrid.deployed().then(contract => contract.address)`. Note the address which is returned and copy that into ./src/reducers/data.js for contractAddress
- Open another new terminal window to buy some plots with dummy data
- `npm run-script buy-random-plots` (It might crash a few times but just keep running it)
- Reload the browser and things should work

Running Unit tests:

- Get ganache running as directed above
- Run `tsc watch` either from a command prompt or from Visual Studio Code
- Without the debugger from the console, `truffle test --network ganache`
- With the debugger in VS Code, `F5`

##eth-grid

To run:

- npm install
- npm run dev
- open localhost:3000
- In new terminal (or via a build task in VS Code) tsc watch

To run with truffle:

- Do everything above
- Open a new terminal window
- `cd contract`
- `truffle develop`
- In the truffle develop console which pops up, run the following
- `truffle migrate`
- `EthGrid2.deployed().then(contract => contract.address)`. Note the address which is returned and copy that into ./src/reducers/data.js for contractAddress
- Open another new terminal window to buy some plots with dummy data
- `npm run-script buy-random-plots` (It might crash a few times but just keep running it)
- Reload the browser and things should work
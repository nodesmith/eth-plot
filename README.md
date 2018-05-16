## eth-grid

[![Build Status](https://travis-ci.com/space-dust-blockchain/eth-grid.svg?token=w3NzMnRtreD5ymzPaywx&branch=master)](https://travis-ci.com/space-dust-blockchain/eth-grid)

To run:

- npm install
- *Optional* - Set the `CONTRACT_ADDRESS` and/or `WEB3_PROVIDER` environment variables to configure web3 (default to Ganache Addresses)
- `npm start`
- open localhost:3000

To run contract via local testnet (Ganache):

- In one terminal window: `npm run start:ganache`
- In another terminal window: `npm run deploy:truffle`

Running Unit tests:

- Get ganache running as directed above
- Run `tsc watch` either from a command prompt or from Visual Studio Code
- Without the debugger from the console, `truffle test --network ganache`
- With the debugger in VS Code, `F5`

To Build:

- `npm run build` - This will clean the project, compile the contracts, compile the Typescript, lint, run tests, then bundle everything into the dist folder

To run the admin page:

- `npm run start:admin`
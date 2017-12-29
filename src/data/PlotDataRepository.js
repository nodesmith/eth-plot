export class PlotDataRepository {
  constructor(web3, abi, contractAddress) {
    this._web3 = web3;
    this._abi = abi;
    this._contractAddress = contractAddress;
  }

  initializeAsync() {
    // We need to get a handle to the actual instance of our running contract
  }

  loadAllPlotsAsync() {
    // Todo
  }
}
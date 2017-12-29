export class MockPlotDataRepository {
  constructor(web3, abi, contractAddress) {
    this._web3 = web3;
    this._abi = abi;
    this._contractAddress = contractAddress;
  }

  initializeAsync() {
    // Just immediately resolve this
    return Promise.resolve(true);
  }

  loadAllPlotsAsync() {
    // Todo
  }
}
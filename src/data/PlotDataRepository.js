const PlotMath = require('./PlotMath');
const PromisePool = require('es6-promise-pool')

class PlotDataRepository {
  constructor(web3, abi, contractAddress) {
    this._web3 = web3;
    this._abi = abi;
    this._contractAddress = contractAddress;
    this._contract = new web3.eth.Contract(this._abi, this._contractAddress);
  }

  initializeAsync() {
    // We need to get a handle to the actual instance of our running contract and figure out the current ownership info
    this._ownership = [];

    // First make a call to figure out the length of the ownership and data array to iterate through them
    return this._contract.methods.ownershipLength().call().then(ownershipLengthString => {
      const ownershipLength = parseInt(ownershipLengthString);
      let currentIndex = 0;
      const ownershipLoadFn = () => {
        if (currentIndex >= ownershipLength) {
          // We're done loading here
          return null;
        }

        return this._contract.methods.ownership(currentIndex++).call().then(ownershipInfo => {
          const ownership = {
            owner: ownershipInfo.owner,
            x: parseInt(ownershipInfo.x),
            y: parseInt(ownershipInfo.y),
            w: parseInt(ownershipInfo.w),
            h: parseInt(ownershipInfo.h)
          };

          ownership.x2 = ownership.x + ownership.w;
          ownership.y2 = ownership.y + ownership.h;
          this.ownership.push(ownership);
          return ownership;
        });
      };

      // Create a pool. 
      var pool = new PromisePool(ownershipLoadFn, 1);
      
      // Start the pool. 
      return pool.start();
    });
  }

  get ownership() {
    return this._ownership;
  }

  loadAllPlotsAsync() {
    // Todo
  }

  computePlotPurchase(rectToPurchase) {
    console.log(`Computing purchase info for ${JSON.stringify(rectToPurchase)}`);

    let purchasedChunks = [];
    let purchasedChunkAreaIndices = [];

    // We'll need to walk the ownership array backwards and see who we need to buy chunks from
    let remainingChunksToPurchase = [rectToPurchase];
    let i = ownership.length - 1;
    while (remainingChunksToPurchase.length > 0 && i >= 0) {
      const currentOwnership = ownership[i];

      for (let j = 0; j < remainingChunksToPurchase.length; j++) {
        const chunkToPurchase = remainingChunksToPurchase[j];
        if (doRectanglesOverlap(currentOwnership, chunkToPurchase)) {
          // Look at the overlap between the chunk we're trying to purchase, and the ownership plot we have
          const chunkOverlap = computeRectOverlap(currentOwnership, chunkToPurchase);

          let newHoles = [chunkOverlap];
          // Next, subtract out all of the holes which this ownerhip may have (TODO)

          // Add these new holes to the current ownership
          currentOwnership.holes = currentOwnership.holes.concat(newHoles);

          // Add the new holes to the purchaseChunks and keep track of their index
          purchasedChunks = purchasedChunks.concat(newHoles);
          purchasedChunkAreaIndices = purchasedChunkAreaIndices.concat(new Array(newHoles.length).fill(i));

          // Final step is to delete this chunkToPurchase (since it's accounted for) and add whatever is remaining back to remainingChunksToPurchase
          remainingChunksToPurchase.splice(j, 1);
          j--; // subtract one from j so we don't miss anything

          for (const newHole of newHoles) {
            const newChunksToPurchase = subtractRectangles(chunkToPurchase, newHole);
            remainingChunksToPurchase = remainingChunksToPurchase.concat(newChunksToPurchase);
          }
        }
      }
      

      i--;
    }

    if (remainingChunksToPurchase.length > 0) {
      throw 'AHHHHH, something went wrong';
    }

    // So we've computed what we need to to purchase this area
    // The final call will look something like this:
    // contract.methods.purchaseAreaWithData([4,4,4,4], [4,4,4,4], [0], 3, web3.utils.asciiToHex("f3a"), "http://samm.com").send({ gas: 1000000, gasPrice: '30000000000000', from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'}).then(result => { console.log(result); debugger; })

  }

  purchasePlotAsync(rectToPurchase, imageData) {

  }
}

module.exports = PlotDataRepository;
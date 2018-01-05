import * as PlotMath from './PlotMath';

// Computes what chunks are needed to be purchased for a particular region
function computePurchaseInfo(rectToPurchase, plots) {
  let purchasedChunks = [];
  let purchasedChunkAreaIndices = [];
  let purchasePrice = 0;

  // We'll need to walk the ownership array backwards and see who we need to buy chunks from
  let remainingChunksToPurchase = [rectToPurchase];
  let i = plots.length - 1;
  while (remainingChunksToPurchase.length > 0 && i >= 0) {
    const currentPlot = plots[i];

    for (let j = 0; j < remainingChunksToPurchase.length; j++) {
      const chunkToPurchase = remainingChunksToPurchase[j];
      if (PlotMath.doRectanglesOverlap(currentPlot.rect, chunkToPurchase)) {
        // Look at the overlap between the chunk we're trying to purchase, and the ownership plot we have
        const chunkOverlap = PlotMath.computeRectOverlap(currentPlot.rect, chunkToPurchase);

        let newHoles = [chunkOverlap];
        // Next, subtract out all of the holes which this ownerhip may have (TODO)

        // Add these new holes to the current ownership
        // currentOwnership.holes = currentOwnership.holes.concat(newHoles);

        // Add the new holes to the purchaseChunks and keep track of their index
        purchasedChunks = purchasedChunks.concat(newHoles);
        purchasedChunkAreaIndices = purchasedChunkAreaIndices.concat(new Array(newHoles.length).fill(i));

        // Final step is to delete this chunkToPurchase (since it's accounted for) and add whatever is remaining back to remainingChunksToPurchase
        remainingChunksToPurchase.splice(j, 1);
        j--; // subtract one from j so we don't miss anything

        for (const newHole of newHoles) {
          const newChunksToPurchase = PlotMath.subtractRectangles(chunkToPurchase, newHole);
          remainingChunksToPurchase = remainingChunksToPurchase.concat(newChunksToPurchase);
        }
      }
    }
    
    i--;
  }

  if (remainingChunksToPurchase.length > 0) {
    throw 'AHHHHH, something went wrong';
  }

  return {
    chunksToPurchase: purchasedChunks,
    chunksToPurchaseAreaIndices: purchasedChunkAreaIndices,
    purchasePrice: purchasePrice
  };
}


module.exports.computePurchaseInfo = computePurchaseInfo;
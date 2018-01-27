import * as PlotMath from './PlotMath';
import { Decimal } from 'decimal.js';

// Computes what chunks are needed to be purchased for a particular region
function computePurchaseInfo(rectToPurchase, plots) {
  let purchasedChunks = [];
  let purchasedChunkAreaIndices = [];
  let purchasePrice = Decimal(0);

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

        let newHole = chunkOverlap;
        // Next, subtract out all of the holes which this ownerhip may have (TODO)

        // Add the new holes to the purchaseChunks and keep track of their index
        purchasedChunks.push(newHole);
        purchasedChunkAreaIndices.push(i);

        // Add up the price of these chunks we are purchasing
        const plotBuyout = Decimal(currentPlot.buyoutPrice).mul(chunkOverlap.w * chunkOverlap.h);
        purchasePrice = purchasePrice.add(plotBuyout);

        // Final step is to delete this chunkToPurchase (since it's accounted for) and add whatever is remaining back to remainingChunksToPurchase
        remainingChunksToPurchase.splice(j, 1);

        const newChunksToPurchase = PlotMath.subtractRectangles(chunkToPurchase, newHole);
        remainingChunksToPurchase = remainingChunksToPurchase.concat(newChunksToPurchase);

        j--; // subtract one from j so we don't miss anything

        // Do a simple assertion that we never have overlapping remainingChunksToPurchase
        if (PlotMath.doAnyOverlap(remainingChunksToPurchase)) {
          throw 'Invalid remaining chunks to purchase';
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
    purchasePrice: purchasePrice.toFixed()
  };
}


module.exports.computePurchaseInfo = computePurchaseInfo;
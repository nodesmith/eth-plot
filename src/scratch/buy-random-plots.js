const Web3 = require('web3');
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;

const web3 = new Web3('http://localhost:9545');
const contract = new web3.eth.Contract(abi, '0x345ca3e014aaf5dca488057592ee47305d9b3e10');

function doRectanglesOverlap(a, b) {
  return a.x < b.x2 && a.x2 > b.x && a.y < b.y2 && a.y2 > b.y;
}

function computeRectOverlap(a, b) {
  let result = {
    x: 0,
    y: 0,
  }

  // Take the greater of the x and y values;
  result.x = a.x > b.x ? a.x : b.x;
  result.y = a.y > b.y ? a.y : b.y;

  // Take the lesser of the x2 and y2 values
  result.x2 = a.x2 < b.x2 ? a.x2 : b.x2;
  result.y2 = a.y2 < b.y2 ? a.y2 : b.y2;

  // Set our width and height here
  result.w = result.x2 - result.x;
  result.h = result.y2 - result.y;

  return result;
}

// subtracts b from a and returns from 0 - 4 remaining rectangles after doing it
function subtractRectangles(a, b) {
  if (!doRectanglesOverlap(a, b)) {
    return [a];
  }

  const result = [];
  let leftX = a.x;
  let rightX = a.x2;

  // Check the left side first
  if (a.x < b.x) {
    const leftOverlap = {
      x: a.x,
      x2: b.x,
      y: a.y,
      y2: a.y2,
      h: a.h
    };

    leftOverlap.w = leftOverlap.x2 - leftOverlap.x;
    leftX = leftOverlap.x2;
    result.push(leftOverlap);
  }

  // Check the right side next
  if (a.x2 > b.x2) {
    const rightOverlap = {
      x: b.x2,
      x2: a.x2,
      y: a.y,
      y2: a.y2,
      h: a.h
    };

    rightOverlap.w = rightOverlap.x2 - rightOverlap.x;
    rightX = rightOverlap.x;
    result.push(rightOverlap);
  }

  // Top side
  if (a.y < b.y) {
    const topOverlap = {
      x: leftX,
      x2: rightX,
      w: rightX - leftX,
      y: a.y,
      y2: b.y
    };

    topOverlap.h = topOverlap.y2 - topOverlap.y;
    result.push(topOverlap);
  }

  // Bottom side
  if (a.y2 > b.y2) {
    const bottomOverlap = {
      x: leftX,
      x2: rightX,
      w: rightX - leftX,
      y: b.y2,
      y2: a.y2
    };

    bottomOverlap.h = bottomOverlap.y2 - bottomOverlap.y;
    result.push(bottomOverlap);
  }

  return result;
}

// Now that we have the contract, go through and buy some stuff (or try to at least)
const ownership = [
  {
    x: 0,
    y: 0,
    w: 250,
    h: 250,
    x2: 250,
    y2: 250,
    owner: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
    holes: []
  }
]


function purchaseRandomArea() {
  
  const x = Math.floor(Math.random() * 250);
  const y = Math.floor(Math.random() * 250);
  const w = Math.floor(Math.random() * Math.min(50, 250 - x));
  const h = Math.floor(Math.random() * Math.min(50, 250 - y));

  const rectToPurchase = {
    x: x,
    y: y,
    w: w,
    h: h,
    x2: x + w,
    y2: y + h
  };

  console.log(`Buying ${JSON.stringify(rectToPurchase)}`);

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

  function buildArrayFromRectangles(rects) { 
    let result = [];
    for(const rect of rects) {
      result.push(rect.x);
      result.push(rect.y);
      result.push(rect.w);
      result.push(rect.h);
    }

    return result;
  }

  const param1 = buildArrayFromRectangles([rectToPurchase]);
  const param2 = buildArrayFromRectangles(purchasedChunks);
  const param3 = purchasedChunkAreaIndices;
  const param4 = 3;
  const param5 = web3.utils.asciiToHex("f3a");
  const param6 = 'http://samm.com';
  const purchaseFunction = contract.methods.purchaseAreaWithData(param1, param2, param3, param4, param5, param6);
  return purchaseFunction.estimateGas({ from: '0x627306090abab3a6e1400e9345bc60c78a8bef57' }).then((gasEstimate) => {
    return purchaseFunction.send({
      from: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
      gasPrice: '30000000000000',
      gas: gasEstimate * 2
    });
  });
}

let buysRemaining = 1;
function doWork() {
  buysRemaining--;
  purchaseRandomArea().then(() => {
    if (buysRemaining > 0) {
      doWork();
    }
  })
};

doWork();



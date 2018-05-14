pragma solidity ^0.4.23;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


/// @title EthGrid
/// @author nova-network
contract EthGrid is Ownable {
    struct Rect {
        uint16 x;
        uint16 y;
        uint16 w;
        uint16 h;
    }
    
    struct ZoneOwnership {
        address owner;
        uint16 x;
        uint16 y;
        uint16 w;
        uint16 h;
        uint256[] holes;
    }

    struct ZoneData {
        bytes ipfsHash;
        string url;
    }

    //----------------------State---------------------//
    uint public feeInThousandsOfPercent;
    ZoneOwnership[] public ownership;
    ZoneData[] public data;
    
    // Maps zone ID to auction price. If price is 0, no auction is 
    // available for that zone. Price is Wei per pixel.
    mapping (uint256 => uint256) public tokenIdToAuction;
    
    //----------------------Constants---------------------//
    uint16 constant private GRID_WIDTH = 250;
    uint16 constant private GRID_HEIGHT = 250;
    uint56 constant private INITIAL_AUCTION_PRICE = 1000;
    uint56 constant private INITIAL_FEE_IN_THOUSANDS_OF_PERCENT = 1000; // Initial fee is 1%

    // This is the maximum area of a single purchase block. This needs to be limited for the
    // algorithm which figures out payment to function
    uint16 constant private MAXIMUM_PURCHASE_AREA = 1000;
    
    //----------------------Events---------------------//
    event AuctionUpdated(uint256 tokenId, uint256 newPriceInWeiPerPixel, bool newPurchase, address indexed owner);
    event PlotPurchased(uint256 newZoneId, uint256 totalPrice, address indexed buyer);
    event PlotSectionSold(uint256 zoneId, uint256 totalPrice, address indexed buyer, address indexed seller);

    constructor() public payable {
        feeInThousandsOfPercent = INITIAL_FEE_IN_THOUSANDS_OF_PERCENT;
        
        // Initialize the contract with a single block with the admin owns
        uint256[] memory holes;
        ownership.push(ZoneOwnership(owner, 0, 0, GRID_WIDTH, GRID_HEIGHT, holes));
        data.push(ZoneData("Qmagwcphv3AYUaFx1ZXLqinDGwNRPGfs32Pvi7Vjjybd2d/img.svg", "http://www.ethplot.com/"));
        createAuction(0, INITIAL_AUCTION_PRICE);
    }

    //----------------------Public Functions---------------------//
    function createAuction(uint256 zoneIndex, uint256 pricePerPixelInWei) public {
        require(zoneIndex >= 0);
        require(zoneIndex < ownership.length);
        require(msg.sender == ownership[zoneIndex].owner);
        require(pricePerPixelInWei > 0);

        tokenIdToAuction[zoneIndex] = pricePerPixelInWei;
    }

    function getPlot(uint256 zoneIndex) public constant returns (uint16, uint16, uint16, uint16, address, uint256, string, bytes) {
        uint256 price = tokenIdToAuction[zoneIndex];
        ZoneData memory zoneData = data[zoneIndex];

        return (
            ownership[zoneIndex].x,
            ownership[zoneIndex].y,
            ownership[zoneIndex].w,
            ownership[zoneIndex].h,
            ownership[zoneIndex].owner,
            price,
            zoneData.url,
            zoneData.ipfsHash);
    }

    function ownershipLength() public constant returns (uint256) {
        return ownership.length;
    }
    
    // Can also be used to cancel an existing auction by sending 0 (or less) as new price.
    function updateAuction(uint256 zoneIndex, uint256 newPriceInWeiPerPixel, bool newPurchase) public {
        require(zoneIndex > 0);
        require(zoneIndex < ownership.length);
        require(msg.sender == ownership[zoneIndex].owner);

        tokenIdToAuction[zoneIndex] = newPriceInWeiPerPixel;
        emit AuctionUpdated(zoneIndex, newPriceInWeiPerPixel, newPurchase, msg.sender);
    }

    function purchaseAreaWithData(uint16[] purchase, uint16[] purchasedAreas, uint256[] areaIndices, bytes ipfsHash, string url, uint256 initialPurchasePrice, uint256 initialBuyoutPriceInWeiPerPixel) public payable returns (uint256) {
        Rect memory rectToPurchase = validatePurchases(purchase, purchasedAreas, areaIndices);

        // Add the new ownership to the array
        uint256[] memory holes;
        ZoneOwnership memory newZone = ZoneOwnership(msg.sender, rectToPurchase.x, rectToPurchase.y, rectToPurchase.w, rectToPurchase.h, holes);
        ownership.push(newZone);

        // Now that purchase is completed, update zones that have new holes due to this purchase
        uint256 i = 0;
        for (i = 0; i < areaIndices.length; i++) {
            ownership[areaIndices[i]].holes.push(ownership.length - 1);
        }

        // Take in the input data for the actual grid!
        ZoneData memory newData = ZoneData(ipfsHash, url);
        data.push(newData);

        updateAuction(ownership.length - 1, initialBuyoutPriceInWeiPerPixel, true);
        emit PlotPurchased(ownership.length - 1, initialPurchasePrice, msg.sender);

        return ownership.length - 1;
    }
    
    //----------------------Private Functions---------------------//
    function doRectanglesOverlap(Rect memory a, Rect memory b) private pure returns (bool) {
        return 
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y;
    }

    // It is assumed that we will have called doRectanglesOverlap before calling this method and we will know they overlap
    function computeRectOverlap(Rect memory a, Rect memory b) private pure returns (Rect memory) {
        Rect memory result = Rect(0, 0, 0, 0);

        // Take the greater of the x and y values;
        result.x = a.x > b.x ? a.x : b.x;
        result.y = a.y > b.y ? a.y : b.y;

        // Take the lesser of the x2 and y2 values
        uint16 resultX2 = a.x + a.w < b.x + b.w ? a.x + a.w : b.x + b.w;
        uint16 resultY2 = a.y + a.h < b.y + b.h ? a.y + a.h : b.y + b.h;

        // Set our width and height here
        result.w = resultX2 - result.x;
        result.h = resultY2 - result.y;

        return result;
    }

    function distributePurchaseFunds(Rect memory rectToPurchase, Rect[] memory rects, uint256[] memory areaIndices) private returns (uint256) {
        uint256 remainingBalance = msg.value;
        uint256 areaIndicesIndex = 0;

        // Walk the ownership array backwards. Do funny checks for incrementing and decrementing indices becaues uints will wrap
        for (uint256 ownershipIndex = ownership.length - 1; areaIndicesIndex < areaIndices.length && ownershipIndex < ownership.length; ownershipIndex--) {
            Rect memory currentOwnershipRect = Rect(
                ownership[ownershipIndex].x, ownership[ownershipIndex].y, ownership[ownershipIndex].w, ownership[ownershipIndex].h);

            uint256 owedToSeller = 0;

            // Keep looping through while we are declaring that we want this area
            while (areaIndicesIndex < areaIndices.length && ownershipIndex == areaIndices[areaIndicesIndex]) {
                // This is a zone the caller has declared they were going to buy
                // We need to verify that the rectangle which was declared as what we're gonna buy is completely contained within the overlap
                require(doRectanglesOverlap(rectToPurchase, currentOwnershipRect));
                Rect memory overlap = computeRectOverlap(rectToPurchase, currentOwnershipRect);

                // Verify that this overlap between these two is within the overlapped area of the rect to purhcase and this ownership zone
                require(rects[areaIndicesIndex].x >= overlap.x);
                require(rects[areaIndicesIndex].y >= overlap.y);
                require(rects[areaIndicesIndex].x + rects[areaIndicesIndex].w <= overlap.x + overlap.w);
                require(rects[areaIndicesIndex].y + rects[areaIndicesIndex].h <= overlap.y + overlap.h);

                // Next, verify that none of the holes of this zone ownership overlap with what we are trying to purchase
                for (uint256 holeIndex = 0; holeIndex < ownership[ownershipIndex].holes.length; holeIndex++) {
                    ZoneOwnership memory holeOwnership = ownership[ownership[ownershipIndex].holes[holeIndex]];
                    Rect memory holeRect = Rect(
                        holeOwnership.x,
                        holeOwnership.y,
                        holeOwnership.w,
                        holeOwnership.h);

                    require(!doRectanglesOverlap(rects[areaIndicesIndex], holeRect));
                }


                // Finally, add the price of this rect to the totalPrice computation
                uint256 sectionPrice =  _getPriceOfAuctionedZone(rects[areaIndicesIndex], areaIndices[areaIndicesIndex]);
                remainingBalance = SafeMath.sub(remainingBalance, sectionPrice);
                owedToSeller = SafeMath.add(owedToSeller, sectionPrice);

                areaIndicesIndex++;
            }

            if (owedToSeller > 0) {
                // Update the balances and emit an event to indicate the chunks of this plot which were sold
                address(ownership[ownershipIndex].owner).transfer(owedToSeller);
                emit PlotSectionSold(ownershipIndex, owedToSeller, msg.sender, ownership[ownershipIndex].owner);
            }
        }

        // This means we checked every area index
        require(areaIndicesIndex == areaIndices.length);

        return remainingBalance;
    }

    event PurchasePrice(uint256 price);
    
    function validatePurchases(uint16[] purchase, uint16[] purchasedAreas, uint256[] areaIndices) private returns (Rect memory) {
        require(purchase.length == 4);
        Rect memory rectToPurchase = Rect(purchase[0], purchase[1], purchase[2], purchase[3]);
        
        require(rectToPurchase.x < GRID_WIDTH && rectToPurchase.x >= 0);
        require(rectToPurchase.y < GRID_HEIGHT && rectToPurchase.y >= 0);
        require(rectToPurchase.w > 0 && rectToPurchase.w < GRID_WIDTH - rectToPurchase.x);
        require(rectToPurchase.h > 0 && rectToPurchase.h < GRID_HEIGHT - rectToPurchase.y);
        require(rectToPurchase.w * rectToPurchase.h < MAXIMUM_PURCHASE_AREA);

        require(purchasedAreas.length >= 4);
        require(areaIndices.length > 0);
        require(purchasedAreas.length % 4 == 0);
        require(purchasedAreas.length / 4 == areaIndices.length);

        Rect[] memory rects = new Rect[](areaIndices.length);

        uint256 totalArea = 0;
        uint256 i = 0;
        uint256 j = 0;
        for (i = 0; i < areaIndices.length; i++) {
            // Define the rectangle and add it to our collection of them
            Rect memory rect = Rect(purchasedAreas[(i * 4)], purchasedAreas[(i * 4) + 1], purchasedAreas[(i * 4) + 2], purchasedAreas[(i * 4) + 3]);
            rects[i] = rect;

            // Compute the area of this rect and add it to the total area
            totalArea += rect.w * rect.h;

            // Verify that this rectangle is within the bounds of the area we are trying to purchase
            require(rect.x >= rectToPurchase.x);
            require(rect.y >= rectToPurchase.y);
            require(rect.x + rect.w <= rectToPurchase.x + rectToPurchase.w);
            require(rect.y + rect.h <= rectToPurchase.y + rectToPurchase.h);
        }

        require(totalArea == rectToPurchase.w * rectToPurchase.h);

        // Next, make sure all of these do not overlap
        for (i = 0; i < rects.length; i++) {
            for (j = i + 1; j < rects.length; j++) {
                require(!doRectanglesOverlap(rects[i], rects[j]));
            }
        }

        // If we have a matching area, the sub rects are all contained within what we're purchasing, and none of them overlap,
        // we know we have a complete tiling of the rectToPurchase. Next, compute what the price should be for all this
        distributePurchaseFunds(rectToPurchase, rects, areaIndices);
        
        return rectToPurchase;
    }

    // Given a rect to purchase, and the ID of the zone that is part of the purchase,
    // This returns the total price of the purchase that is attributed by that zone.  
    function _getPriceOfAuctionedZone(Rect memory rectToPurchase, uint256 auctionedZoneId) private view returns (uint256) {
        // Check that this auction zone exists in the auction mapping with a price.
        uint256 auctionPricePerPixel = tokenIdToAuction[auctionedZoneId];
        require(auctionPricePerPixel > 0);

        return SafeMath.mul(SafeMath.mul(rectToPurchase.w, rectToPurchase.h), auctionPricePerPixel);
    }
}

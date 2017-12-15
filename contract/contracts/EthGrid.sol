pragma solidity ^0.4.18;

/// @title EthGrid
/// @atuhor nova-network

contract EthGrid {
    struct Rect {
        uint8 x;
        uint8 y;
        uint8 w;
        uint8 h;
    }

    struct Zone {
        uint128 zone_id;
        uint8 x;
        uint8 y;
        uint8 w;
        uint8 h;
    }

    struct Auction {
        // ID of zone that is up for auction
        uint128 zone_id;

        uint128 startingPriceInGwei;
        uint128 endingPriceInGwei;

        // Duration (in seconds) of auction
        uint64 duration;

        // Time when auction started
        // 0 if this auction has finished
        uint64 startedAt;
    }

    enum MimeType {
      PNG,
      SVG,
      JPG,
      GIF,
      WEBP
    }
    
    struct ZoneData {
        MimeType mimeType;
        bytes data;
        string url;
    }
    
    uint feeInThousandsOfPercent;
    address admin;
    Zone[] public zones;
    ZoneData[] public data;
    Auction[] public auctions;
    mapping(address => uint256) public balances;
    mapping(address => uint128[]) public zoneOwnership;  
    
    uint8 constant GRID_WIDTH = 250;
    uint8 constant GRID_HEIGHT = 250;
    uint56 constant INITIAL_BUYOUT_IN_GWEI = 1000;
    uint56 constant INITIAL_FEE_IN_THOUSANDS_OF_PERCENT = 1000; // Initial fee is 1%
    // TODO - can't do const structs yet Rect constant EMPTY = Rect(0,0,0,0);

    // This is the maximum area of a single purchase block. This needs to be limited for the
    // algorithm which figures out payment to function
    uint16 constant MAXIMUM_PURCHASE_AREA = 1000;
    
    function EthGrid() public payable {
        admin = msg.sender;
        feeInThousandsOfPercent = INITIAL_FEE_IN_THOUSANDS_OF_PERCENT;
        
        // Initialize the contract with a single block with the admin owns
        zones.push(Rect(admin, 0, 0, GRID_WIDTH, GRID_HEIGHT, INITIAL_BUYOUT_IN_GWEI));
        data.push(ZoneData(MimeType.PNG, "", "http://ethgrid.com"));
        balances[admin] = 0;
    }
    
    function doRectanglesOverlap(Rect memory a, Rect memory b) private pure returns (bool) {
        return 
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y;
    }
    
    function computeOverlap(Rect memory targetZone, Rect memory ownedZone) private pure returns (Rect[] memory) {
        Rect[] memory brokenPieces = new Rect[](5);
        
        // The covered section is what actually has been accounted for by this particular ownedZone.
        // Initialize it to be the entire targetZone, and subtract and we leave chunks around
        Rect memory coveredSection = Rect(targetZone.x, targetZone.y, targetZone.w, targetZone.h);
        
        // Check the chunk to the left of things
        if (ownedZone.x > targetZone.x) {
            Rect memory leftRemainingSpan = Rect(targetZone.x, targetZone.y, ownedZone.x - targetZone.x, targetZone.h);
            brokenPieces[0] = leftRemainingSpan;
            
            // Reduce the width and update the x
            coveredSection.w = coveredSection.w - leftRemainingSpan.w;
            coveredSection.x = ownedZone.x;
        } else {
            brokenPieces[0] = Rect(0,0,0,0);
        }
        
        // Check the chunk to the right of things
        if (ownedZone.x + ownedZone.w < targetZone.x + targetZone.w) {
            Rect memory rightRemainingSpan = Rect(
                ownedZone.x + ownedZone.w,
                targetZone.y,
                targetZone.x + targetZone.w - ownedZone.x - ownedZone.w,
                targetZone.h);
                
            brokenPieces[1] = rightRemainingSpan;
            
            // Reduce the width
            coveredSection.w = coveredSection.w - rightRemainingSpan.w;
        } else {
            brokenPieces[1] = Rect(0,0,0,0);
        }
        
        // Check the top next
        if (ownedZone.y > targetZone.y) {
            Rect memory topRemainingSpan = Rect(targetZone.x, targetZone.y, targetZone.w, ownedZone.y - targetZone.y);
            if (brokenPieces[0].w != 0) {
                topRemainingSpan.x = ownedZone.x;
                topRemainingSpan.w = topRemainingSpan.w - brokenPieces[0].w;
            }
            
            if (brokenPieces[1].w != 0) {
                topRemainingSpan.w = topRemainingSpan.w - brokenPieces[1].w;
            }
            
            brokenPieces[2] = topRemainingSpan;
            
            // Reduce the height and update the y
            coveredSection.h = coveredSection.h - topRemainingSpan.h;
            coveredSection.y = ownedZone.y;
        } else {
            brokenPieces[2] = Rect(0,0,0,0);
        }
        
        // Check the bottom finally
        if (ownedZone.y + ownedZone.h < targetZone.y + targetZone.h) {
            Rect memory bottomRemainingSpan = Rect(
                targetZone.x,
                ownedZone.y + ownedZone.h,
                targetZone.w,
                targetZone.y + targetZone.h - ownedZone.y - ownedZone.h);
                
            // Same logic as above
            if (brokenPieces[0].w != 0) {
                bottomRemainingSpan.x = ownedZone.x;
                bottomRemainingSpan.w = bottomRemainingSpan.w - brokenPieces[0].w;
            }
            
            if (brokenPieces[1].w != 0) {
                bottomRemainingSpan.w = bottomRemainingSpan.w - brokenPieces[1].w;
            }
            
            brokenPieces[3] = bottomRemainingSpan;
            
            // Reduce the height
            coveredSection.h = coveredSection.h - bottomRemainingSpan.h;
        } else {
            brokenPieces[3] = Rect(0,0,0,0);
        }
        
        // Return the actual overlapping part of the grid
        brokenPieces[4] = coveredSection;
        return brokenPieces;
    }
    
    function getCurrentZonePrice() private returns (uint) {
        // TODO blah
    }

    function determineCost(Rect memory targetZone, bool makePayment) private returns (uint) {
        // Loop through and figure out how much and who we will owe. Initially everything is missing so we assign
        // target zone to missing payments so we can divide that up
        Rect[] memory missingPayments = new Rect[](targetZone.w * targetZone.h);
        missingPayments[0] = targetZone;
        
        // TODO - Update endIndex to be modded by missingPayments length and make the loop
        // check for != endIndex
        uint16 endIndex = 1;
        uint totalCost = 0;

        // i is gonna wrap around, so make the loop check be i < zones.length
        for (uint i = zones.length - 1; i < zones.length; i--) {
            
            // Keep track if we've tracked everything. If we loop through every missed
            // and there isn't anything there, we're done
            bool targetCovered = true; 
            uint j = 0;
            Rect memory zoneArea = Rect(zones[i].x, zones[i].y, zones[i].w, zones[i].h);
            
            // Go through all of the remaining sections which still need payment
            while (j != endIndex) {
                if (missingPayments[j].w == 0) {
                  // If the payment has a width of 0, that means it's empty so we can just continue
                  j++;
                  continue;
                } else {
                    // We still have some stuff to account for so we can't short circuit
                    targetCovered = false;
                }
                
                // Check if these two rectagles overlap at all and compute that they will require
                if (doRectanglesOverlap(missingPayments[j], zoneArea)) {
                    // If these two overlap, we need to split the current missingPayment section
                    // into multiple sections (or into nothing)
                    Rect[] memory overlapCalc = computeOverlap(missingPayments[j], zoneArea);
                    uint256 overlappingAreaCost = overlapCalc[4].w * overlapCalc[4].h * getCurrentZonePrice();
                    totalCost += overlappingAreaCost;

                    if (makePayment) {
                      // If we are being asked to actually make the payment, change the balances here
                      // TODO - Use safe add
                      balances[zones[i].owner] += overlappingAreaCost;
                    }
                    
                    // Clear out the current item from the missing payments list
                    missingPayments[j] = Rect(0,0,0,0);
                    
                    // Next put the remaining sections back on the mmissingPayments list
                    if (overlapCalc[0].w != 0) {
                        missingPayments[endIndex++] = overlapCalc[0];
                    }
                    
                    if (overlapCalc[1].w != 0) {
                        missingPayments[endIndex++] = overlapCalc[1];
                    }
                    
                    if (overlapCalc[2].w != 0) {
                        missingPayments[endIndex++] = overlapCalc[2];
                    }
                    
                    if (overlapCalc[3].w != 0) {
                        missingPayments[endIndex++] = overlapCalc[3];
                    }
                }
                
                j++;
            }
            
            if (targetCovered) {
                break;
            }
        }
        
        return totalCost;
    }
    
    event AreaCost(uint16 x, uint16 y, uint16 w, uint16 h, uint totalCost);

    
    function changeZonePrice(uint256 zoneIndex, uint56 newPriceInGwei) public {
      require(zoneIndex > 0);
      require(zoneIndex < zones.length);
      require(msg.sender == zones[zoneIndex].owner);

      // Update the price for this section of zones
      // zones[zoneIndex].buyoutInGwei = newPriceInGwei;
    }
    
    function determineAreaCost(uint8 x, uint8 y, uint8 w, uint8 h) public returns (uint) {
        // Validate all the inputs
        require(x < GRID_WIDTH && x >= 0);
        require(y < GRID_HEIGHT && y >= 0);
        require(w > 0 && w < GRID_WIDTH - x);
        require(h > 0 && h < GRID_HEIGHT - y);
        require(w * h < MAXIMUM_PURCHASE_AREA);
        
        Rect memory area = Rect(x, y, w, h);
        uint totalCost = determineCost(area, false);

        return totalCost;
    }
    
    function addData(uint8 x, uint8 y, uint8 w, uint8 h, uint56 buyout, MimeType mimeType, bytes imgData, string url) public payable {
        // Validate all the inputs
        require(x < GRID_WIDTH && x >= 0);
        require(y < GRID_HEIGHT && y >= 0);
        require(w > 0 && w < GRID_WIDTH - x);
        require(h > 0 && h < GRID_HEIGHT - y);
        require(w * h < MAXIMUM_PURCHASE_AREA);
        
        Rect memory area = Rect(x, y, w, h);
        uint256 totalCost = determineCost(area, true); // Cost is in gwei
        AreaCost(x, y, w, h, totalCost);
        uint256 fee = (feeInThousandsOfPercent / 100000) * totalCost;

        // Need to factor in the fees here as well
        totalCost += fee;

        totalCost = totalCost * 10**9;

        // Finally, switch this over to wei instead of gwei
        require (msg.value > totalCost);

        // Next, actually capture the value from the msg, refund everything else

        // TODO - SafeMath
        balances[admin] += fee;
        
        // version of SHA3, maps an input string into a random 256-bit hexidecimal number
        // Generate new zoneID for this zone and assign to various data structures
        uint128 newZoneId = uint128(keccak256(string(msg.sender + block.timestamp)));

        // Add the new zones to the array
        Zone memory newZone = Zone(newZoneId, x, y, w, h);
        zones.push(newZone);
        zoneOwnership[msg.sender].push(newZoneId);

        // Take in the input data for the actual grid!
        ZoneData memory newData = ZoneData(mimeType, imgData, url);
        data.push(newData);
    }
}
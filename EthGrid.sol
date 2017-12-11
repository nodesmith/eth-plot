pragma solidity ^0.4.19;
contract EthGrid {
    struct Rect {
        uint8 x;
        uint8 y;
        uint8 w;
        uint8 h;
    }
    
    struct ZoneOwnership {
        address owner;
        // Rect area;
        uint8 x;
        uint8 y;
        uint8 w;
        uint8 h;
        uint56 buyoutInGwei;
    }
    
    struct ZoneData {
        string mimeType;
        bytes data;
        string url;
    }
    
    uint feeInThousandsOfPercent;
    address admin;
    ZoneOwnership[] public ownership;
    ZoneData[] public data;
    
    function EthGrid() public payable {
        admin = msg.sender;
        feeInThousandsOfPercent = 1000; // Initial fee is 1%
        
        // Initialize the contract
        uint56 buyout = 42;
        // Rect memory initialRect = Rect(0, 0, 255, 255);
        // ZoneOwnership memory initialOwnership = ZoneOwnership(admin, initialRect, buyout);
        ownership.push(ZoneOwnership(admin, 0, 0, 255, 255, buyout));
    }
    
    function doRectanglesOverlap(Rect memory a, Rect memory b) private pure returns (bool) {
        // if (RectA.Left < RectB.Right && RectA.Right > RectB.Left &&
        // RectA.Top > RectB.Bottom && RectA.Bottom < RectB.Top ) 
        return 
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y > b.y + b.h &&
            a.y + a.h < b.y;
    }
    
    function computeOverlap(Rect memory targetZone, Rect memory ownedZone) private pure returns (Rect[] memory) {
        Rect[] memory brokenPieces = new Rect[](5);
        Rect memory empty = Rect(0,0,0,0);
        
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
            brokenPieces[0] = empty;
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
            brokenPieces[1] = empty;
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
            brokenPieces[2] = empty;
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
            brokenPieces[3].w != 0;
        }
        
        brokenPieces[4] = coveredSection;
        return brokenPieces;
    }
    
    event CheckingArea(Rect zoneArea);
    function determineCost(Rect memory targetZone) private  returns (uint) {
        // Loop through and figure out how much and who we will owe. Initially everything is missing
        // uint40[] memory missingPayments = new uint40[](targetZone.w * targetZone.h);
        Rect[] memory missingPayments = new Rect[](10);
        missingPayments[0] = targetZone;
        missingPayments[1] = Rect(0,0,0,0);
        uint16 endIndex = 1;
        
        uint totalCost = 0;
        
        // i is gonna wrap around, so make the loop check be i < ownership.length
        for(uint i = ownership.length - 1; i < ownership.length; i--) {
            Rect memory zoneArea = Rect(ownership[i].x, ownership[i].y, ownership[i].w, ownership[i].h);
            CheckingArea(zoneArea);
            uint j = 0;
            
            // Keep track if we've tracked everything. If we loop through every missed
            // and there isn't anything there, we're done
            bool targetCovered = true; 
            
            while (j < endIndex) {
                if (missingPayments[j].w == 0) {
                    continue;
                } else {
                    // We still have some stuff to cover
                    targetCovered = false;
                }
                
                
                if (doRectanglesOverlap(missingPayments[j], zoneArea)) {
                    // If these two overlap, we need to split the current missingPayment section
                    // into multiple sections (or into nothing)
                    Rect[] memory overlapCalc = computeOverlap(missingPayments[j], zoneArea);
                    totalCost += overlapCalc[4].w * overlapCalc[4].h * ownership[i].buyoutInGwei;
                    
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
    
    function buyArea(uint8 x, uint8 y, uint8 w, uint8 h, uint56 buyout) public {
        require(x < 2**10);
        require(y < 2**10);
        
        require(w < (2**10) - x);
        require(h < (2**10) - y);
        
        Rect memory area = Rect(x, y, w, h);
        uint totalCost = determineCost(area);
        AreaCost(x, y, w, h, totalCost);
        
        ZoneOwnership memory newZone = ZoneOwnership(msg.sender, x, y, w, h, buyout);
        ownership.push(newZone);
    }
    
    function addData(uint8 x, uint8 y, uint8 w, uint8 h, uint56 buyout, string mimeType, bytes imgData, string url) public payable {
        // Validate all the inputs
        require(x < 2**10);
        require(y < 2**10);
        require(w < (2**10) - x);
        require(h < (2**10) - y);
        
        Rect memory area = Rect(x, y, w, h);
        uint totalCost = determineCost(area);
        require (msg.value > totalCost);
        
        ZoneOwnership memory newZone = ZoneOwnership(msg.sender, x, y, w, h, buyout);
        ownership.push(newZone);
        
        ZoneData memory newData = ZoneData(mimeType, imgData, url);
        data.push(newData);
    }
}

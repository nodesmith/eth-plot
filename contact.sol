pragma solidity ^0.4.19;
contract HomePage {
    struct ZoneOwnership {
        address owner;
        uint40 span;
        uint56 buyoutInGwei;
    }
    
    struct ZoneData {
        string mimeType;
        bytes data;
        string url;
    }
    
    struct Span {
        uint16 x;
        uint16 y;
        uint16 w;
        uint16 h;
    }
    
    uint feeInThousandsOfPercent;
    address admin;
    ZoneOwnership[] public ownership;
    ZoneData[] public data;
    
    function HomePage() public{
        admin = msg.sender;
        feeInThousandsOfPercent = 1000; // Initial fee is 1%
        Span memory initialSpan = Span(0, 0, 2**10, 2**10);
        
        ownership.push(ZoneOwnership({
            owner: admin,
            span: encodeSpan(initialSpan),
            buyoutInGwei: 0
        }));
    }
    
    function doRectanglesOverlap(Span memory a, Span memory b) private constant returns (bool) {
        // if (RectA.Left < RectB.Right && RectA.Right > RectB.Left &&
        // RectA.Top > RectB.Bottom && RectA.Bottom < RectB.Top ) 
        return 
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y > b.y + b.h &&
            a.y + a.h < b.y;
    }
    
    function computeOverlap(Span memory targetZone, Span memory ownedZone) private constant returns (uint40[] memory) {
        uint40[] memory brokenPieces = new uint40[](5);
        
        // The covered section is what actually has been accounted for by this particular ownedZone.
        // Initialize it to be the entire targetZone, and subtract and we leave chunks around
        Span memory coveredSection = Span(targetZone.x, targetZone.y, targetZone.w, targetZone.h);
        
        // Check the chunk to the left of things
        if (ownedZone.x > targetZone.x) {
            Span memory leftRemainingSpan = Span(targetZone.x, targetZone.y, ownedZone.x - targetZone.x, targetZone.h);
            brokenPieces[0] = encodeSpan(leftRemainingSpan);
            
            // Reduce the width and update the x
            coveredSection.w = coveredSection.w - leftRemainingSpan.w;
            coveredSection.x = ownedZone.x;
        } else {
            brokenPieces[0] = 0;
        }
        
        // Check the chunk to the right of things
        if (ownedZone.x + ownedZone.w < targetZone.x + targetZone.w) {
            Span memory rightRemainingSpan = Span(
                ownedZone.x + ownedZone.w,
                targetZone.y,
                targetZone.x + targetZone.w - ownedZone.x - ownedZone.w,
                targetZone.h);
                
            brokenPieces[1] = encodeSpan(rightRemainingSpan);
            
            // Reduce the width
            coveredSection.w = coveredSection.w - rightRemainingSpan.w;
        } else {
            brokenPieces[1] = 0;
        }
        
        // Check the top next
        if (ownedZone.y > targetZone.y) {
            Span memory topRemainingSpan = Span(targetZone.x, targetZone.y, targetZone.w, ownedZone.y - targetZone.y);
            if (brokenPieces[0] != 0) {
                topRemainingSpan.x = ownedZone.x;
                topRemainingSpan.w = topRemainingSpan.w - decodeSpan(brokenPieces[0]).w;
            }
            
            if (brokenPieces[1] != 0) {
                topRemainingSpan.w = topRemainingSpan.w - decodeSpan(brokenPieces[1]).w;
            }
            
            brokenPieces[2] = encodeSpan(topRemainingSpan);
            
            // Reduce the height and update the y
            coveredSection.h = coveredSection.h - topRemainingSpan.h;
            coveredSection.y = ownedZone.y;
        } else {
            brokenPieces[2] = 0;
        }
        
        // Check the bottom finally
        if (ownedZone.y + ownedZone.h < targetZone.y + targetZone.h) {
            Span memory bottomRemainingSpan = Span(
                targetZone.x,
                ownedZone.y + ownedZone.h,
                targetZone.w,
                targetZone.y + targetZone.h - ownedZone.y - ownedZone.h);
                
            // Same logic as above
            if (brokenPieces[0] != 0) {
                bottomRemainingSpan.x = ownedZone.x;
                bottomRemainingSpan.w = bottomRemainingSpan.w - decodeSpan(brokenPieces[0]).w;
            }
            
            if (brokenPieces[1] != 0) {
                bottomRemainingSpan.w = bottomRemainingSpan.w - decodeSpan(brokenPieces[1]).w;
            }
            
            brokenPieces[3] = encodeSpan(bottomRemainingSpan);
            
            // Reduce the height
            coveredSection.h = coveredSection.h - bottomRemainingSpan.h;
        } else {
            brokenPieces[3] = 0;
        }
        
        brokenPieces[4] = encodeSpan(coveredSection);
        return brokenPieces;
    }
    
    function determineCost(Span memory targetZone) private constant returns (uint) {
        // Loop through and figure out how much and who we will owe. Initially everything is missing
        uint40[] memory missingPayments = new uint40[](targetZone.w * targetZone.h);
        missingPayments[0] = encodeSpan(targetZone);
        missingPayments[1] = 0;
        uint16 endIndex = 1;
        
        uint totalCost = 0;
        
        for(uint i = ownership.length - 1; i >= 0; i--) {
            Span memory zoneArea = decodeSpan(ownership[i].span);
            uint j = 0;
            
            // Keep track if we've tracked everything. If we loop through every missed
            // and there isn't anything there, we're done
            bool targetCovered = true; 
            
            while (j < endIndex) {
                if (missingPayments[j] == 0) {
                    continue;
                } else {
                    // We still have some stuff to cover
                    targetCovered = false;
                }
                
                
                if (doRectanglesOverlap(decodeSpan(missingPayments[j]), zoneArea)) {
                    // If these two overlap, we need to split the current missingPayment section
                    // into multiple sections (or into nothing)
                    uint40[] memory overlapCalc = computeOverlap(decodeSpan(missingPayments[j]), zoneArea);
                    totalCost += decodeSpan(overlapCalc[4]).w * decodeSpan(overlapCalc[4]).h * ownership[i].buyoutInGwei;
                    
                    // Clear out the current item from the missing payments list
                    missingPayments[j] = 0;
                    
                    // Next put the remaining sections back on the mmissingPayments list
                    if (overlapCalc[0] != 0) {
                        missingPayments[endIndex++] = overlapCalc[0];
                    }
                    
                    if (overlapCalc[1] != 0) {
                        missingPayments[endIndex++] = overlapCalc[1];
                    }
                    
                    if (overlapCalc[2] != 0) {
                        missingPayments[endIndex++] = overlapCalc[2];
                    }
                    
                    if (overlapCalc[3] != 0) {
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
    
    function addData(uint16 x, uint16 y, uint16 w, uint16 h, uint56 buyout, string mimeType, bytes imgData, string url) public payable {
        // Validate all the inputs
        require(x < 2**10);
        require(y < 2**10);
        require(w < (2**10) - x);
        require(h < (2**10) - y);
        
        uint totalCost = determineCost(Span(x, y, w, h));
        require (msg.value > totalCost);
        
        // Create a span which will define the area we are trying to write over
        // Span memory targetZone = Span(x, y, w, h);
        
        
        
        uint40 encodedSpan = encodeSpan(Span(x, y, w, h));
        ZoneOwnership memory newZone = ZoneOwnership(msg.sender, encodedSpan, buyout);
        ownership.push(newZone);
        
        ZoneData memory newData = ZoneData(mimeType, imgData, url);
        data.push(newData);
    }
    
    function encodeSpan(Span span) private pure returns (uint40) {
        // Take each component and mask it down to the 10 least significant bits
        uint16 mask = 0x03FF;
        uint40 x = span.x & mask;
        uint40 y = span.y & mask;
        uint40 w = span.w & mask;
        uint40 h = span.h & mask;
        
        // Move over all of our bits to their section
        x = x << 0;
        y = y << 10;
        w = w << 20;
        h = h << 30;
        
        // Logical OR all of these together to get our 40 bit result
        uint40 result = x | y | w | h;
        return result;
    }
    
    function decodeSpan(uint40 encodedSpan) private pure returns (Span) {
        uint16 mask = 0x03FF;
        uint16 x = (uint16) ((encodedSpan >> 0) & mask);
        uint16 y = (uint16) ((encodedSpan >> 10) & mask);
        uint16 w = (uint16) ((encodedSpan >> 20) & mask);
        uint16 h = (uint16) ((encodedSpan >> 30) & mask);
        
        return Span(x, y, w, h);
    }
}

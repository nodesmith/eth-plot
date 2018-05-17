pragma solidity ^0.4.23;

import "./Geometry.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


/// @title EthGrid
/// @author Space Dust LLC (https://spacedust.io)
/// @notice This contract represents ownership of virtual "plots" of a grid. Owners of a plot are able to brand their plots with
/// image data and a website. They are also able to put their plots up for sale and receive proceeds based on what portion of their
/// plot has been sold. A visual representation of the contract can be found by going to https://ethplot.com
/// @dev Due to storage limitations, the way the ownership data is stored for a contract is rather unique. We store an array of plot
/// ownerships which are a rectangle, an owner address, and an array pointing to elements later in the ownership array which overlap
/// with this rectangle (called holes). The remaining section of a plot, would be its original area minus the holes (rectangles on top).
/// This data model allows us to cheaply validate new purchases without building huge arrays, allocating lots of memory, or doing other
/// things which are very expensive due to gas cost concerns.
contract EthGrid is Ownable {

    /// @dev Represents a single plot (rectangle) which is owned by someone. Additionally, it contains an array
    /// of holes which point to other PlotOwnership structs which overlap this one (and purchased a chunk of this one)
    /// 4 24 bit numbers for + 1 address = 256 bits for storage efficiency
    struct PlotOwnership {

        // Coordinates of the plot rectangle
        uint24 x;
        uint24 y;
        uint24 w;
        uint24 h;

        // The owner of the plot
        address owner;
    }

    /// @dev Represents the data which a specific plot ownership has
    struct PlotData {
        string ipfsHash;
        string url;
    }

    //----------------------State---------------------//

    // The actual coordinates and owners of plots. This array will contain all of the owned plots, with the more recent (and valid)
    // ownership plots at the top. The other state variables point to indexes in this array
    PlotOwnership[] private ownership;

    // Maps from the index in the ownership array to the data for this particular plot (its image and website)
    mapping(uint256 => PlotData) private data;

    // Maps plot ID to a boolean that represents whether or not
    // the image of the plot might be illegal and need to be blocked
    // in the UI of Eth Plot. Defaults to false.
    mapping (uint256 => bool) private plotBlockedTags;

    // Maps plot ID to the plot's current price price. If price is 0, the plot is not for sale 
    // available for that plot. Price is Wei per pixel.
    mapping(uint256 => uint256) private plotIdToPrice;

    // Maps plot ID to other plots IDs which which have purchased sections of this plot (a hole).
    // Once a plot has been completely re-purchased, these holes will completely tile over the plot.
    mapping(uint256 => uint256[]) private holes;
    
    //----------------------Constants---------------------//
    uint24 constant private GRID_WIDTH = 250;
    uint24 constant private GRID_HEIGHT = 250;
    uint256 constant private INITIAL_PLOT_PRICE = 20000 * 1000000000; // 20000 gwei (approx. $0.01)
    uint256 constant private FEE_IN_THOUSANDS_OF_PERCENT = 1000; // Fee is 1%

    // This is the maximum area of a single purchase block. This needs to be limited for the
    // algorithm which figures out payment to function
    uint256 constant private MAXIMUM_PURCHASE_AREA = 1000;
      
    //----------------------Events---------------------//

    /// @notice Inicates that a user has updated the price of their plot
    /// @param plotId The index in the ownership array which was updated
    /// @param newPriceInWeiPerPixel The new price of the plotId
    /// @param owner The current owner of the plot
    event PlotPriceUpdated(uint256 plotId, uint256 newPriceInWeiPerPixel, address indexed owner);

    /// @notice Indicates that a new plot has been purchased and added to the ownership array
    /// @param newPlotId The id (index in the ownership array) of the new plot
    /// @param totalPrice The total price paid in wei to all the plots which used to own this area
    /// @param buyer The account which made the purchase 
    event PlotPurchased(uint256 newPlotId, uint256 totalPrice, address indexed buyer);

    /// @notice Indicates that a section of a plot was purchased. Multiple PlotSectionSold events could be emitted from
    /// a single purchase transaction
    /// @param plotId The id (index in the ownership array) of the plot which had a section of it purchased
    /// @param totalPrice The total price which was paid for this section
    /// @param buyer The buyer of the section of the plot
    /// @param seller The owner of the plot which was purchased. This is who will receive totalPrice in their account
    event PlotSectionSold(uint256 plotId, uint256 totalPrice, address indexed buyer, address indexed seller);

    /// @notice Creates a new instance of the EthGrid contract. It assigns an initial ownership plot consisting of the entire grid
    /// to the creator of the contract who will also receive any transaction fees.
    constructor() public payable {
        // Initialize the contract with a single block which the admin owns
        ownership.push(PlotOwnership(0, 0, GRID_WIDTH, GRID_HEIGHT, owner));
        data[0] = PlotData("Qmb51AikiN8p6JsEcCZgrV4d7C6d6uZnCmfmaT15VooUyv/img.svg", "https://www.ethplot.com/");
        plotIdToPrice[0] = INITIAL_PLOT_PRICE;
    }

    //----------------------External Functions---------------------//
    function purchaseAreaWithData(
        uint24[] purchase,
        uint24[] purchasedAreas,
        uint256[] areaIndices,
        string ipfsHash,
        string url,
        uint256 initialBuyoutPriceInWeiPerPixel) external payable {
        
        uint256 initialPurchasePrice = validatePurchases(purchase, purchasedAreas, areaIndices);

        uint256 newPlotIndex = addPlotAndData(purchase, ipfsHash, url, initialBuyoutPriceInWeiPerPixel);

        // Now that purchase is completed, update plots that have new holes due to this purchase
        uint256 i = 0;
        for (i = 0; i < areaIndices.length; i++) {
            holes[areaIndices[i]].push(newPlotIndex);
        }

        emit PlotPurchased(newPlotIndex, initialPurchasePrice, msg.sender);
    }

    // Can also be used to cancel an existing plot sale by sending 0 (or less) as new price.
    function updatePlotPrice(uint256 plotIndex, uint256 newPriceInWeiPerPixel) public {
        require(plotIndex >= 0);
        require(plotIndex < ownership.length);
        require(msg.sender == ownership[plotIndex].owner);

        plotIdToPrice[plotIndex] = newPriceInWeiPerPixel;
        emit PlotPriceUpdated(plotIndex, newPriceInWeiPerPixel, msg.sender);
    }
    
    function withdraw(address transferTo) onlyOwner external {
        // Prevent https://consensys.github.io/smart-contract-best-practices/known_attacks/#transaction-ordering-dependence-tod-front-running
        require(transferTo == owner);

        uint256 currentBalance = address(this).balance;
        owner.transfer(currentBalance);
    }

    function togglePlotBlockedTag(uint256 plotIndex, bool plotBlocked) onlyOwner external {
        require(plotIndex >= 0);
        require(plotIndex < ownership.length);
        plotBlockedTags[plotIndex] = plotBlocked;
    }

    // ----------------------Public View Functions---------------------//
    function getPlotInfo(uint256 plotIndex) public view returns (uint24, uint24, uint24, uint24, address, uint256) {
        require(plotIndex < ownership.length);
        return (
            ownership[plotIndex].x,
            ownership[plotIndex].y,
            ownership[plotIndex].w,
            ownership[plotIndex].h,
            ownership[plotIndex].owner,
            plotIdToPrice[plotIndex]);
    }

    function getPlotData(uint256 plotIndex) public view returns (string, string, bool) {
        require(plotIndex < ownership.length);
        return (data[plotIndex].url, data[plotIndex].ipfsHash, plotBlockedTags[plotIndex]);
    }
    
    function ownershipLength() public view returns (uint256) {
        return ownership.length;
    }
    
    //----------------------Private Functions---------------------//
    function distributePurchaseFunds(
        Geometry.Rect memory rectToPurchase, Geometry.Rect[] memory rects, uint256[] memory areaIndices) private returns (uint256) {
        uint256 remainingBalance = msg.value;

        uint256 owedToSeller = 0;
        for (uint256 areaIndicesIndex = 0; areaIndicesIndex < areaIndices.length; areaIndicesIndex++) {
            uint256 ownershipIndex = areaIndices[areaIndicesIndex];

            // Geometry.Rect memory currentOwnershipRect = ownership[ownershipIndex].rect;
            Geometry.Rect memory currentOwnershipRect = Geometry.Rect(
                ownership[ownershipIndex].x, ownership[ownershipIndex].y, ownership[ownershipIndex].w, ownership[ownershipIndex].h);

            // This is a plot the caller has declared they were going to buy
            // We need to verify that the rectangle which was declared as what we're gonna buy is completely contained within the overlap
            require(Geometry.doRectanglesOverlap(rectToPurchase, currentOwnershipRect));
            Geometry.Rect memory overlap = Geometry.computeRectOverlap(rectToPurchase, currentOwnershipRect);

            // Verify that this overlap between these two is within the overlapped area of the rect to purchase and this ownership plot
            require(Geometry.rectContainedInside(rects[areaIndicesIndex], overlap));

            // Next, verify that none of the holes of this plot ownership overlap with what we are trying to purchase
            for (uint256 holeIndex = 0; holeIndex < holes[ownershipIndex].length; holeIndex++) {
                PlotOwnership memory holePlot = ownership[holes[ownershipIndex][holeIndex]];

                require(
                    !Geometry.doRectanglesOverlap(rects[areaIndicesIndex],
                    Geometry.Rect(holePlot.x, holePlot.y, holePlot.w, holePlot.h)));
            }


            // Finally, add the price of this rect to the totalPrice computation
            uint256 sectionPrice = getPriceOfPlot(rects[areaIndicesIndex], ownershipIndex);
            remainingBalance = SafeMath.sub(remainingBalance, sectionPrice);
            owedToSeller = SafeMath.add(owedToSeller, sectionPrice);

            // If this is the last one to look at, or if the next ownership index is different, payout this owner
            if (areaIndicesIndex == areaIndices.length - 1 || ownershipIndex != areaIndices[areaIndicesIndex + 1]) {
                // Update the balances and emit an event to indicate the chunks of this plot which were sold
                address(ownership[ownershipIndex].owner).transfer(owedToSeller);
                emit PlotSectionSold(ownershipIndex, owedToSeller, msg.sender, ownership[ownershipIndex].owner);
                owedToSeller = 0;
            }
        }
        
        return remainingBalance;
    }

    function validatePurchases(uint24[] purchase, uint24[] purchasedAreas, uint256[] areaIndices) private returns (uint256) {
        require(purchase.length == 4);
        Geometry.Rect memory rectToPurchase = Geometry.Rect(purchase[0], purchase[1], purchase[2], purchase[3]);
        
        // TODO - Safe Math
        require(rectToPurchase.x < GRID_WIDTH && rectToPurchase.x >= 0);
        require(rectToPurchase.y < GRID_HEIGHT && rectToPurchase.y >= 0);
        require(rectToPurchase.w > 0 && rectToPurchase.w + rectToPurchase.x <= GRID_WIDTH);
        require(rectToPurchase.h > 0 && rectToPurchase.h + rectToPurchase.y <= GRID_HEIGHT);
        require(rectToPurchase.w * rectToPurchase.h < MAXIMUM_PURCHASE_AREA);

        require(purchasedAreas.length >= 4);
        require(areaIndices.length > 0);
        require(purchasedAreas.length % 4 == 0);
        require(purchasedAreas.length / 4 == areaIndices.length);

        Geometry.Rect[] memory rects = new Geometry.Rect[](areaIndices.length);

        uint256 totalArea = 0;
        uint256 i = 0;
        uint256 j = 0;
        for (i = 0; i < areaIndices.length; i++) {
            // Define the rectangle and add it to our collection of them
            Geometry.Rect memory rect = Geometry.Rect(
                purchasedAreas[(i * 4)], purchasedAreas[(i * 4) + 1], purchasedAreas[(i * 4) + 2], purchasedAreas[(i * 4) + 3]);
            rects[i] = rect;

            // Compute the area of this rect and add it to the total area
            totalArea = SafeMath.add(totalArea, SafeMath.mul(rect.w,rect.h));

            // Verify that this rectangle is within the bounds of the area we are trying to purchase
            require(Geometry.rectContainedInside(rect, rectToPurchase));
        }

        require(totalArea == rectToPurchase.w * rectToPurchase.h);

        // Next, make sure all of these do not overlap
        for (i = 0; i < rects.length; i++) {
            for (j = i + 1; j < rects.length; j++) {
                require(!Geometry.doRectanglesOverlap(rects[i], rects[j]));
            }
        }

        // If we have a matching area, the sub rects are all contained within what we're purchasing, and none of them overlap,
        // we know we have a complete tiling of the rectToPurchase. Next, compute what the price should be for all this
        uint256 remainingBalance = distributePurchaseFunds(rectToPurchase, rects, areaIndices);
        uint256 purchasePrice = SafeMath.sub(msg.value, remainingBalance);

        // The remainingBalance after distributing funds to sellers should greater than or equal to the fee we charge
        uint256 requiredFee = SafeMath.div(SafeMath.mul(purchasePrice, FEE_IN_THOUSANDS_OF_PERCENT), (1000 * 100));
        require(remainingBalance >= requiredFee);
        
        return purchasePrice;
    }

    function addPlotAndData(uint24[] purchase, string ipfsHash, string url, uint256 initialBuyoutPriceInWeiPerPixel) private returns (uint256) {
        uint256 newPlotIndex = ownership.length;

        // Add the new ownership to the array
        // PlotOwnership memory newPlot = PlotOwnership(purchase[0], purchase[1], purchase[2], purchase[3], msg.sender);
        ownership.push(PlotOwnership(purchase[0], purchase[1], purchase[2], purchase[3], msg.sender));

        // Take in the input data for the actual grid!
        data[newPlotIndex] = PlotData(ipfsHash, url);

        // Set an initial purchase price for the new plot if it's greater than 0
        if (initialBuyoutPriceInWeiPerPixel > 0) {
            updatePlotPrice(newPlotIndex, initialBuyoutPriceInWeiPerPixel);
        }

        return newPlotIndex;
    }

    // Given a rect to purchase, and the ID of the plot that is part of the purchase,
    // This returns the total price of the purchase that is attributed by that plot.  
    function getPriceOfPlot(Geometry.Rect memory rectToPurchase, uint256 plotId) private view returns (uint256) {
        // Check that this plot exists in the plot price mapping with a price.
        uint256 plotPricePerPixel = plotIdToPrice[plotId];
        require(plotPricePerPixel > 0);

        return SafeMath.mul(SafeMath.mul(rectToPurchase.w, rectToPurchase.h), plotPricePerPixel);
    }
}
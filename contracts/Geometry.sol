pragma solidity ^0.4.23;

library Geometry {

    struct Rect {
        uint256 x;
        uint256 y;
        uint256 w;
        uint256 h;
    }

    function doRectanglesOverlap(Rect memory a, Rect memory b) internal pure returns (bool) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    // It is assumed that we will have called doRectanglesOverlap before calling this method and we will know they overlap
    function computeRectOverlap(Rect memory a, Rect memory b) internal pure returns (Rect memory) {
        Rect memory result = Rect(0, 0, 0, 0);

        // Take the greater of the x and y values;
        result.x = a.x > b.x ? a.x : b.x;
        result.y = a.y > b.y ? a.y : b.y;

        // Take the lesser of the x2 and y2 values
        uint256 resultX2 = a.x + a.w < b.x + b.w ? a.x + a.w : b.x + b.w;
        uint256 resultY2 = a.y + a.h < b.y + b.h ? a.y + a.h : b.y + b.h;

        // Set our width and height here
        result.w = resultX2 - result.x;
        result.h = resultY2 - result.y;

        return result;
    }

}
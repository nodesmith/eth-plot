import { createEmptyRect } from './Rect';
export function doRectanglesOverlap(a, b) {
    return a.x < b.x2 && a.x2 > b.x && a.y < b.y2 && a.y2 > b.y;
}
export function doAnyOverlap(arrayOfRects) {
    for (var i = 0; i < arrayOfRects.length - 1; i++) {
        if (doRectanglesOverlap(arrayOfRects[i], arrayOfRects[i + 1])) {
            return true;
        }
    }
    return false;
}
export function computeRectOverlap(a, b) {
    var result = createEmptyRect();
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
export function subtractRectangles(a, b) {
    if (!doRectanglesOverlap(a, b)) {
        return [a];
    }
    var result = new Array();
    var leftX = a.x;
    var rightX = a.x2;
    // Check the left side first
    if (a.x < b.x) {
        var leftOverlap = {
            x: a.x,
            x2: b.x,
            y: a.y,
            y2: a.y2,
            h: a.h,
            w: b.x - a.x
        };
        leftX = leftOverlap.x2;
        result.push(leftOverlap);
    }
    // Check the right side next
    if (a.x2 > b.x2) {
        var rightOverlap = {
            x: b.x2,
            x2: a.x2,
            y: a.y,
            y2: a.y2,
            h: a.h,
            w: a.x2 - b.x2
        };
        rightX = rightOverlap.x;
        result.push(rightOverlap);
    }
    // Top side
    if (a.y < b.y) {
        var topOverlap = {
            x: leftX,
            x2: rightX,
            w: rightX - leftX,
            y: a.y,
            y2: b.y,
            h: b.y - a.y
        };
        result.push(topOverlap);
    }
    // Bottom side
    if (a.y2 > b.y2) {
        var bottomOverlap = {
            x: leftX,
            x2: rightX,
            w: rightX - leftX,
            y: b.y2,
            y2: a.y2,
            h: 0
        };
        bottomOverlap.h = bottomOverlap.y2 - bottomOverlap.y;
        result.push(bottomOverlap);
    }
    return result;
}
//# sourceMappingURL=PlotMath.js.map
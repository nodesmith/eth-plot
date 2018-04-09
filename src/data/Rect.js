;
export function createEmptyRect() {
    return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        x2: 0,
        y2: 0
    };
}
export function cloneRect(rect) {
    return Object.assign({}, rect);
}
export function fromCoordinates(x, y, x2, y2) {
    return {
        x: x,
        y: y,
        x2: x2,
        y2: y2,
        w: x2 - x,
        h: y2 - y
    };
}
//# sourceMappingURL=Rect.js.map
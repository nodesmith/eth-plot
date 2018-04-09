var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
var GridPlot = /** @class */ (function (_super) {
    __extends(GridPlot, _super);
    function GridPlot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridPlot.prototype.mouseOver = function () {
        this.props.hoverAction(this.props.index);
    };
    GridPlot.prototype.render = function () {
        var rect = this.props.plot.rect;
        var scale = this.props.scale;
        var plotStyle = {
            top: rect.y * scale,
            left: rect.x * scale,
            width: rect.w * scale,
            height: rect.h * scale,
            backgroundColor: this.props.plot.color
        };
        if (this.props.isHovered) {
            plotStyle.outlineColor = '#fff';
            plotStyle.outlineWidth = '1px';
            plotStyle.outlineStyle = 'solid';
        }
        return (React.createElement("a", { href: this.props.plot.data.url, target: 'blank', key: this.props.index, style: plotStyle, className: "gridPlot", onMouseOver: this.mouseOver.bind(this) }));
    };
    return GridPlot;
}(React.Component));
export default GridPlot;
//# sourceMappingURL=GridPlot.js.map
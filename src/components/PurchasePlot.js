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
import { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { MovementActions } from '../constants/Enums';
var styles = function (theme) { return ({}); };
var PurchasePlot = /** @class */ (function (_super) {
    __extends(PurchasePlot, _super);
    function PurchasePlot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PurchasePlot.prototype.overlayMouseDown = function (movement, e) {
        var scale = this.props.scale;
        var x = (e.clientX - e.target.parentElement.parentElement.getBoundingClientRect().x) / scale;
        var y = (e.clientY - e.target.parentElement.parentElement.getBoundingClientRect().y) / scale;
        e.stopPropagation();
        this.props.startAction(x, y, movement);
    };
    PurchasePlot.prototype.overlayMouseMove = function (movement, e) {
    };
    PurchasePlot.prototype.overlayMouseUp = function (e) {
    };
    PurchasePlot.prototype.render = function () {
        var _this = this;
        var rect = this.props.rect;
        var scale = this.props.scale;
        var plotStyle = {
            top: 0,
            left: 0,
            width: rect.w * scale,
            height: rect.h * scale,
            position: 'absolute',
            cursor: 'move',
            backgroundImage: "url(" + this.props.src + ")",
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
        };
        var wrapperStyle = {
            top: rect.y * scale,
            left: rect.x * scale,
            width: rect.w * scale,
            height: rect.h * scale,
            position: 'absolute',
            pointerEvents: 'auto',
            userDrag: 'none'
        };
        var tooltipStyle = {
            top: -40
        };
        var handleWidth = 10;
        var leftStyle = {
            top: 0,
            left: 0 - (handleWidth * .5),
            width: handleWidth,
            height: rect.h * scale,
            position: 'absolute',
            cursor: 'ew-resize'
        };
        var rightStyle = Object.assign({}, leftStyle, {
            left: (rect.w * scale) - (handleWidth * .5)
        });
        var topStyle = {
            top: 0 - (handleWidth * .5),
            left: 0,
            width: rect.w * scale,
            height: handleWidth,
            position: 'absolute',
            cursor: 'ns-resize'
        };
        var bottomStyle = Object.assign({}, topStyle, {
            top: (rect.h * scale) - (handleWidth * .5)
        });
        var upperLeftStyle = {
            top: -handleWidth,
            left: -handleWidth,
            width: handleWidth * 2,
            height: handleWidth * 2,
            position: 'absolute',
            cursor: 'nwse-resize'
        };
        var upperRightStyle = Object.assign({}, upperLeftStyle, {
            left: (rect.w * scale) - handleWidth,
            cursor: 'nesw-resize'
        });
        var lowerRightStyle = Object.assign({}, upperLeftStyle, {
            left: (rect.w * scale) - handleWidth,
            top: (rect.h * scale) - handleWidth
        });
        var lowerLeftStyle = Object.assign({}, upperLeftStyle, {
            top: (rect.h * scale) - handleWidth,
            cursor: 'nesw-resize'
        });
        var controlItems = [
            { movement: MovementActions.DRAG, style: plotStyle, className: 'purchasePlot' },
            { movement: MovementActions.TOP, style: topStyle, className: 'handle' },
            { movement: MovementActions.LEFT, style: leftStyle, className: 'handle' },
            { movement: MovementActions.BOTTOM, style: bottomStyle, className: 'handle' },
            { movement: MovementActions.RIGHT, style: rightStyle, className: 'handle' },
            { movement: MovementActions.UPPER_LEFT, style: upperLeftStyle, className: 'handle' },
            { movement: MovementActions.LOWER_LEFT, style: lowerLeftStyle, className: 'handle' },
            { movement: MovementActions.LOWER_RIGHT, style: lowerRightStyle, className: 'handle' },
            { movement: MovementActions.UPPER_RIGHT, style: upperRightStyle, className: 'handle' },
        ];
        var controls = controlItems.map(function (item) {
            return (React.createElement("div", { key: item.movement, style: item.style, className: item.className, onMouseDown: _this.overlayMouseDown.bind(_this, item.movement), onMouseMove: _this.overlayMouseMove.bind(_this, item.movement), onMouseUp: _this.overlayMouseUp.bind(_this, item.movement) }));
        });
        var tooltipText = rect.w + " x " + rect.h;
        return (React.createElement("div", { draggable: false, style: wrapperStyle },
            controls,
            React.createElement("div", { className: 'purchaseTooltip', style: tooltipStyle },
                React.createElement("span", null, tooltipText))));
    };
    return PurchasePlot;
}(Component));
export default withStyles(styles)(PurchasePlot);
//# sourceMappingURL=PurchasePlot.js.map
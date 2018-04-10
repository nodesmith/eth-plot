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
import GridPlot from './GridPlot';
import PurchasePlot from './PurchasePlot';
var styles = function (theme) { return ({
    root: {
        padding: 24,
        width: '100%',
        height: '100%',
        overflow: 'scroll'
    }
}); };
var UIGrid = /** @class */ (function (_super) {
    __extends(UIGrid, _super);
    function UIGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIGrid.prototype.mouseOut = function () {
        // Reset the hover once the mouse leaves this area
        this.props.actions.hoverOverPlot(-1);
    };
    UIGrid.prototype.onStartAction = function (x, y, action) {
        this.props.actions.startTransformRectToPurchase({ x: x, y: y }, action);
    };
    UIGrid.prototype.overlayMouseUp = function (e) {
        this.props.actions.stopTransformRectToPurchase();
    };
    UIGrid.prototype.overlayMouseMove = function (e) {
        if (!this.props.currentTransform) {
            return;
        }
        var scale = this.props.scale;
        var x = (e.clientX - e.currentTarget.getBoundingClientRect().x) / scale;
        var y = (e.clientY - e.currentTarget.getBoundingClientRect().y) / scale;
        var deltaX = x - this.props.currentTransform.startLocation.x;
        var deltaY = y - this.props.currentTransform.startLocation.y;
        var top = 0, left = 0, bottom = 0, right = 0;
        var rect = Object.assign({}, this.props.rectToPurchase);
        switch (this.props.currentTransform.transformAction) {
            case MovementActions.DRAG:
                left = right = deltaX;
                top = bottom = deltaY;
                break;
            case MovementActions.TOP:
                top = deltaY;
                break;
            case MovementActions.LEFT:
                left = deltaX;
                break;
            case MovementActions.BOTTOM:
                bottom = deltaY;
                break;
            case MovementActions.RIGHT:
                right = deltaX;
                break;
            case MovementActions.UPPER_LEFT:
                top = deltaY;
                left = deltaX;
                break;
            case MovementActions.LOWER_LEFT:
                bottom = deltaY;
                left = deltaX;
                break;
            case MovementActions.LOWER_RIGHT:
                bottom = deltaY;
                right = deltaX;
                break;
            case MovementActions.UPPER_RIGHT:
                right = deltaX;
                top = deltaY;
                break;
        }
        top = Math.round(top);
        left = Math.round(left);
        bottom = Math.round(bottom);
        right = Math.round(right);
        this.props.actions.transformRectToPurchase({ top: top, left: left, bottom: bottom, right: right }, this.props.plots);
        // console.log(rect);
        e.stopPropagation();
    };
    UIGrid.prototype.render = function () {
        var _this = this;
        var scale = this.props.scale;
        var plots = this.props.plots.map(function (plot, index) {
            return (React.createElement(GridPlot, { scale: scale, plot: plot, index: index, isHovered: _this.props.hoveredIndex === index, hoverAction: _this.props.actions.hoverOverPlot, key: index }));
        });
        var marginLeft = "calc(calc(100vw - " + this.props.gridInfo.width * scale + "px) / 2)";
        var gridStyle = {
            width: this.props.gridInfo.width * scale,
            height: this.props.gridInfo.height * scale,
            marginLeft: marginLeft,
            position: 'absolute'
        };
        var overlay = undefined;
        if (this.props.inPurchaseMode && this.props.imageToPurchase) {
            var overlayStyle = {
                width: this.props.gridInfo.width * scale,
                height: this.props.gridInfo.height * scale,
                marginLeft: marginLeft,
                position: 'absolute'
            };
            var purchasePlotRect = void 0;
            if (this.props.dragRectCurr && this.props.dragRectStart) {
                purchasePlotRect = {
                    x: Math.min(this.props.dragRectCurr.x, this.props.dragRectStart.x),
                    y: Math.min(this.props.dragRectCurr.y, this.props.dragRectStart.y),
                    w: Math.abs(this.props.dragRectCurr.x - this.props.dragRectStart.x),
                    h: Math.abs(this.props.dragRectCurr.y - this.props.dragRectStart.y),
                    x2: 0,
                    y2: 0
                };
                purchasePlotRect.x2 = purchasePlotRect.x + purchasePlotRect.w;
                purchasePlotRect.y2 = purchasePlotRect.y + purchasePlotRect.h;
                if (!this.props.isDraggingRect && purchasePlotRect.w === 0 && purchasePlotRect.h === 0) {
                    purchasePlotRect = undefined;
                }
            }
            overlay = (React.createElement("div", { style: overlayStyle, onMouseMove: this.overlayMouseMove.bind(this), onMouseUp: this.overlayMouseUp.bind(this) },
                React.createElement(PurchasePlot, { classes: {}, rect: this.props.rectToPurchase, scale: scale, src: this.props.imageToPurchase.fileData, startAction: this.onStartAction.bind(this) })));
        }
        return (React.createElement("div", { className: this.props.classes.root },
            React.createElement("div", { style: gridStyle, className: "grid", onMouseOut: this.mouseOut.bind(this) }, plots),
            overlay));
    };
    return UIGrid;
}(Component));
export default withStyles(styles)(UIGrid);
//# sourceMappingURL=UIGrid.js.map
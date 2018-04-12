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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import Drawer from 'material-ui/Drawer';
import { ZoomControlComponent } from './ZoomControl';
import PurchaseFlowCard from './PurchaseFlowCard';
var padding = 24;
var styles = function (theme) { return ({
    root: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        pointerEvents: 'none'
    },
    zoom: {
        left: padding,
        bottom: padding,
        position: 'absolute',
        display: 'inline',
        pointerEvents: 'all'
    },
    purchase: {
        right: padding,
        bottom: padding,
        position: 'absolute',
        pointerEvents: 'all'
    },
    drawer: {
        // marginTop: '64px',
        width: 400,
        pointerEvents: 'all'
    }
}); };
var MainControlsOverlay = /** @class */ (function (_super) {
    __extends(MainControlsOverlay, _super);
    function MainControlsOverlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainControlsOverlay.prototype.toggleDrawer = function () {
        this.props.togglePurchaseFlow();
    };
    MainControlsOverlay.prototype.render = function () {
        var _this = this;
        var classes = this.props.classes;
        var sideList = (React.createElement(PurchaseFlowCard, __assign({ onClose: function () { return _this.toggleDrawer(); } }, this.props.purchaseActions, this.props.purchase, { contractInfo: this.props.contractInfo, plots: this.props.plots, imageData: this.props.imageData, randomExtraProp: 'abc' })));
        return (React.createElement("div", { className: classes.root },
            React.createElement("div", { className: classes.zoom },
                React.createElement(ZoomControlComponent, { classes: {}, scale: this.props.zoomLevel, changeZoom: this.props.changeZoom })),
            this.props.purchase.purchaseFlowOpen ? null :
                React.createElement(Button, { variant: 'fab', color: "secondary", "aria-label": "buy plot", className: classes.purchase, onClick: function () { return _this.toggleDrawer(); } },
                    React.createElement(ShoppingCart, null)),
            React.createElement(Drawer, { classes: {
                    paper: classes.drawer
                }, anchor: "right", variant: "persistent", open: this.props.purchase.purchaseFlowOpen, onClose: function () { return _this.toggleDrawer(); } }, sideList)));
    };
    return MainControlsOverlay;
}(Component));
export default withStyles(styles)(MainControlsOverlay);
//# sourceMappingURL=MainControlsOverlay.js.map
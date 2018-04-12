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
import MainControlsOverlay from '../components/MainControlsOverlay';
import PurchaseDialog from '../components/PurchaseDialog';
import { withStyles } from 'material-ui/styles';
import UIGrid from '../components/UIGrid';
var styles = function (theme) {
    return ({
        root: (_a = {
                position: 'relative',
                height: 'calc(100vh - 64px)'
            },
            _a[theme.breakpoints.down('xs')] = {
                height: 'calc(100vh - 54px)',
            },
            _a.userDrag = 'none',
            _a)
    });
    var _a;
};
var MainContainer = /** @class */ (function (_super) {
    __extends(MainContainer, _super);
    function MainContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainContainer.prototype.render = function () {
        var purchaseActions = {
            onImageSelected: this.props.actions.purchaseImageSelected,
            goToStep: this.props.actions.goToPurchaseStep,
            onStepComplete: this.props.actions.completePurchaseStep,
            onWebsiteChanged: this.props.actions.changePlotWebsite,
            onBuyoutChanged: this.props.actions.changePlotBuyout,
            onBuyoutEnabledChanged: this.props.actions.changeBuyoutEnabled,
            purchasePlot: this.props.actions.completePlotPurchase
        };
        var uiGridProps = {
            actions: {
                hoverOverPlot: this.props.actions.hoverOverPlot,
                startTransformRectToPurchase: this.props.actions.startTransformRectToPurchase,
                stopTransformRectToPurchase: this.props.actions.stopTransformRectToPurchase,
                transformRectToPurchase: this.props.actions.transformRectToPurchase
            },
            classes: {},
            inPurchaseMode: this.props.purchase.purchaseFlowOpen,
            currentTransform: this.props.purchase.currentTransform,
            imageToPurchase: this.props.imageFileInfo,
            rectToPurchase: this.props.purchase.rectToPurchase,
            plots: this.props.plots,
            scale: this.props.scale,
            gridInfo: this.props.gridInfo,
            hoveredIndex: this.props.hoveredIndex,
            dragRectCurr: this.props.dragRectCurr,
            dragRectStart: this.props.dragRectStart,
            isDraggingRect: this.props.isDraggingRect
        };
        var uiGridActions = {
            hoverOverPlot: this.props.actions.hoverOverPlot,
            startTransformRectToPurchase: this.props.actions.startTransformRectToPurchase,
            stopTransformRectToPurchase: this.props.actions.stopTransformRectToPurchase,
            transformRectToPurchase: this.props.actions.transformRectToPurchase
        };
        return (React.createElement("div", { className: this.props.classes.root },
            React.createElement(UIGrid, __assign({}, uiGridProps)),
            React.createElement(MainControlsOverlay, { purchase: this.props.purchase, zoomLevel: this.props.scale, purchaseActions: purchaseActions, imageData: this.props.imageFileInfo ? this.props.imageFileInfo.fileData : '', contractInfo: this.props.contractInfo, plots: this.props.plots, togglePurchaseFlow: this.props.actions.togglePurchaseFlow, changeZoom: this.props.actions.changeZoom }),
            React.createElement(PurchaseDialog, __assign({ cancelPlotPurchase: this.props.actions.cancelPlotPurchase }, this.props.purchaseDialog))));
    };
    return MainContainer;
}(React.Component));
export default withStyles(styles)(MainContainer);
//# sourceMappingURL=MainContainer.js.map
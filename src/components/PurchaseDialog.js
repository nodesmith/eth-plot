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
import Dialog, { DialogActions, DialogTitle, DialogContent } from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography/Typography';
import Button from 'material-ui/Button/Button';
import { PurchaseStage } from '../constants/Enums';
var stages = [
    PurchaseStage.NOT_STARTED,
    PurchaseStage.UPLOADING_TO_IPFS,
    PurchaseStage.SAVING_TO_CLOUD,
    PurchaseStage.WAITING_FOR_UNLOCK,
    PurchaseStage.SUBMITTING_TO_BLOCKCHAIN,
    PurchaseStage.WAITING_FOR_CONFIRMATIONS,
    PurchaseStage.DONE
];
var styles = function (theme) { return ({}); };
;
var PurchaseDialog = /** @class */ (function (_super) {
    __extends(PurchaseDialog, _super);
    function PurchaseDialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PurchaseDialog.prototype.handleCancel = function () {
        this.props.cancelPlotPurchase();
    };
    PurchaseDialog.prototype.getMessage = function (purchaseStage) {
        switch (purchaseStage) {
            case PurchaseStage.NOT_STARTED:
                return 'Starting Purchase Process';
            case PurchaseStage.UPLOADING_TO_IPFS:
                return (React.createElement("span", null,
                    "Uploading image data to ",
                    React.createElement("a", { target: '_blank', href: '' }, "IPFS")));
            case PurchaseStage.SAVING_TO_CLOUD:
                return (React.createElement("span", null,
                    "Saving to ",
                    React.createElement("a", { target: '_blank', href: '' }, "AWS")));
            case PurchaseStage.WAITING_FOR_UNLOCK:
                return 'Waiting for wallet to unlock';
            case PurchaseStage.SUBMITTING_TO_BLOCKCHAIN:
                return 'Submitting transaction to the Ethereum network';
            case PurchaseStage.WAITING_FOR_CONFIRMATIONS:
                return 'Waiting for confirmations';
            default:
                return null;
        }
    };
    PurchaseDialog.prototype.render = function () {
        var _a = this.props, classes = _a.classes, isShowing = _a.isShowing, purchaseStage = _a.purchaseStage;
        if (!isShowing) {
            return null;
        }
        var currentStageIndex = stages.indexOf(purchaseStage);
        var progressPercentage = (currentStageIndex / (stages.length - 1));
        var progress = Math.round(progressPercentage * 100);
        var bufferProgress = Math.min(100, progress + 7);
        var message = this.getMessage(purchaseStage);
        return (React.createElement(Dialog, { disableBackdropClick: true, fullWidth: true, maxWidth: 'xs', "aria-labelledby": "dialog-title", open: true },
            React.createElement(DialogTitle, { id: "dialog-title" }, "Purchasing Plot"),
            React.createElement(DialogContent, null,
                React.createElement(LinearProgress, { variant: "buffer", value: progress, valueBuffer: bufferProgress }),
                React.createElement("br", null),
                React.createElement(Typography, { variant: 'subheading', align: 'left' }, message)),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: this.handleCancel.bind(this), color: "secondary" }, "Cancel"))));
    };
    return PurchaseDialog;
}(Component));
export default withStyles(styles)(PurchaseDialog);
//# sourceMappingURL=PurchaseDialog.js.map
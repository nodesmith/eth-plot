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
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import BuyoutPriceInputBox from './PurchaseDialog/BuyoutPriceInputBox';
var styles = function (theme) { return ({
    root: {
        padding: 16
    },
    button: {
        marginRight: theme.spacing.unit,
    },
}); };
;
var PlotInfo = /** @class */ (function (_super) {
    __extends(PlotInfo, _super);
    function PlotInfo(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            newBuyoutPrice: '0',
            toggleEnabled: false,
            auctionVisible: false
        };
        return _this;
    }
    PlotInfo.prototype.onBuyoutChanged = function (buyoutChangedMessage) {
        this.setState({ newBuyoutPrice: buyoutChangedMessage.value });
    };
    PlotInfo.prototype.onToggleChanged = function () {
        this.setState({
            toggleEnabled: !this.state.toggleEnabled,
            auctionVisible: !this.state.auctionVisible,
        });
    };
    PlotInfo.prototype.updatePrice = function () {
        this.props.updatePrice(this.props.info.zoneIndex, this.state.newBuyoutPrice);
    };
    PlotInfo.prototype.render = function () {
        var previewStyle = {
            backgroundColor: this.props.info.color,
            width: this.props.info.rect.w + "px",
            height: this.props.info.rect.w + "px",
        };
        return (React.createElement(Grid, { className: this.props.classes.root, container: true, spacing: 24 },
            React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { variant: 'headline' },
                    "Plot url: ",
                    React.createElement("a", { href: this.props.info.data.url }, this.props.info.data.url)),
                this.props.info.txHash ?
                    React.createElement(Typography, { variant: 'headline' },
                        "Trasaction in progress: ",
                        React.createElement("a", { href: "https://etherscan.io/address/" + this.props.info.txHash }, this.props.info.txHash))
                    : null,
                React.createElement(Typography, { variant: 'headline' },
                    "Buyout price per pixel: ",
                    (this.props.info.buyoutPrice > 0) ? this.props.info.buyoutPrice : "Not For Sale"),
                React.createElement(BuyoutPriceInputBox, { onBuyoutChanged: this.onBuyoutChanged.bind(this), onToggleChanged: this.onToggleChanged.bind(this), rectToPurchase: this.props.info.rect, buyoutPriceInWei: this.state.newBuyoutPrice, toggleEnabled: this.state.toggleEnabled, toggleText: 'Edit Buyout', title: 'Buyout Price', initialValue: { units: 'wei', ammountInWei: 500 }, buyoutVisible: this.state.auctionVisible }),
                this.state.toggleEnabled ? (React.createElement(Button, { className: this.props.classes.button, onClick: this.updatePrice.bind(this) }, "Submit")) : null),
            React.createElement(Grid, { item: true, xs: 6 }, this.props.info.color ?
                React.createElement("div", { style: previewStyle })
                :
                    // TODO update with image support later
                    React.createElement("img", { src: "asdf" }))));
    };
    return PlotInfo;
}(Component));
export default withStyles(styles)(PlotInfo);
//# sourceMappingURL=PlotInfo.js.map
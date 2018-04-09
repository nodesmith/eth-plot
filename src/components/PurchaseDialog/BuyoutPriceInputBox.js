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
import Decimal from 'decimal.js';
import { formatEthValue } from '../../data/ValueFormatters';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Menu, { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
var styles = function (theme) { return ({
    wrapper: {
        margin: theme.spacing.unit
    },
    numberInput: {
        width: '75%',
        marginRight: theme.spacing.unit,
    },
    unitSelect: {
        width: "20%"
    }
}); };
var BuyoutPriceInputBox = /** @class */ (function (_super) {
    __extends(BuyoutPriceInputBox, _super);
    function BuyoutPriceInputBox(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            buyoutUnits: 'wei',
            anchorEl: undefined
        };
        return _this;
    }
    BuyoutPriceInputBox.prototype.buyoutPriceChanged = function (event) {
        var units = this.state.buyoutUnits;
        var newPriceInWei = '';
        if (event.target.value.length > 0) {
            var mulitplier = units == 'wei' ? 0 : units == 'gwei' ? 9 : 18;
            newPriceInWei = new Decimal(event.target.value + ("e" + mulitplier)).toFixed();
        }
        var buyoutChangedMessage = {
            value: newPriceInWei
        };
        this.props.onBuyoutChanged(buyoutChangedMessage);
    };
    BuyoutPriceInputBox.prototype.buyoutUnitChanged = function (event, buyoutUnits) {
        this.setState({
            buyoutUnits: buyoutUnits
        });
        this.handleUnitsMenuClosed();
    };
    BuyoutPriceInputBox.prototype.validateBuyout = function (buyoutPriceInWei, toggleEnabled) {
        if (!buyoutPriceInWei || buyoutPriceInWei.length === 0) {
            return {
                state: null,
                message: 'The price you will receive if your full plot is purchased'
            };
        }
        if (!toggleEnabled) {
            return {
                state: null,
                message: 'Buyout disabled. Go to My Plots to set a buyout price'
            };
        }
        var price = new Decimal(buyoutPriceInWei);
        if (price.lessThanOrEqualTo(0)) {
            return {
                state: 'error',
                message: 'Buyout price must be more than 0'
            };
        }
        if (this.props.purchasePrice) {
            var purchasePrice = new Decimal(this.props.purchasePrice);
            if (price.lessThan(purchasePrice)) {
                return {
                    state: 'warning',
                    message: 'Your buyout price is less than your purchase price'
                };
            }
        }
        var area = this.props.rectToPurchase.w * this.props.rectToPurchase.h;
        var buyoutPerUnit = price.div(area);
        var buyoutPrice = formatEthValue(buyoutPerUnit);
        return {
            state: 'success',
            message: "You will receive " + buyoutPrice.value + " " + buyoutPrice.unit + " per unit"
        };
    };
    BuyoutPriceInputBox.prototype.allowBuyoutChanged = function (event, checked) {
        this.props.onToggleChanged(checked);
    };
    BuyoutPriceInputBox.prototype.showUnitsMenu = function (event) {
        this.setState({ anchorEl: event.currentTarget });
    };
    BuyoutPriceInputBox.prototype.handleUnitsMenuClosed = function () {
        this.setState({ anchorEl: undefined });
    };
    BuyoutPriceInputBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, buyoutPriceInWei = _a.buyoutPriceInWei, toggleEnabled = _a.toggleEnabled, classes = _a.classes;
        var _b = this.state, anchorEl = _b.anchorEl, buyoutUnits = _b.buyoutUnits;
        var buyoutMultiplier = buyoutUnits == 'eth' ? -18 : buyoutUnits == 'gwei' ? -9 : 0;
        var buyoutString = buyoutPriceInWei.length > 0 ? new Decimal(buyoutPriceInWei + ("e" + buyoutMultiplier)).toFixed() : '';
        var validation = this.validateBuyout(buyoutPriceInWei, toggleEnabled);
        var currencies = ['wei', 'gwei', 'eth'];
        return (React.createElement("div", { className: classes.wrapper },
            React.createElement(FormControlLabel, { control: React.createElement(Switch, { checked: toggleEnabled, onChange: this.allowBuyoutChanged.bind(this) }), label: this.props.toggleText }),
            this.props.buyoutVisible ? (React.createElement("div", null,
                React.createElement(TextField, { id: "name", label: "Buyout Price", disabled: !toggleEnabled, value: buyoutString, className: classes.numberInput, margin: "normal", onChange: this.buyoutPriceChanged.bind(this), helperText: validation.message }),
                React.createElement(Chip, { className: classes.unitSelect, label: buyoutUnits, onClick: toggleEnabled ? this.showUnitsMenu.bind(this) : null, "aria-owns": anchorEl ? 'units-menu' : undefined, "aria-haspopup": "true" }),
                React.createElement(Menu, { id: "units-menu", anchorEl: anchorEl, open: Boolean(anchorEl), onClose: this.handleUnitsMenuClosed.bind(this) }, currencies.map(function (option) { return (React.createElement(MenuItem, { selected: option === buyoutUnits, key: option, value: option, onClick: function (event) { return _this.buyoutUnitChanged(event, option); } }, option)); })))) : null));
    };
    return BuyoutPriceInputBox;
}(Component));
export default withStyles(styles)(BuyoutPriceInputBox);
//# sourceMappingURL=BuyoutPriceInputBox.js.map
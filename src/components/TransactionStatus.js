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
import * as Enums from '../constants/Enums';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AddCircle from 'material-ui-icons/AddCircle';
import AttachMoney from 'material-ui-icons/AttachMoney';
import Typography from 'material-ui/Typography';
var styles = function (theme) { return ({
    root: {
        padding: 16
    }
}); };
var TransactionStatus = /** @class */ (function (_super) {
    __extends(TransactionStatus, _super);
    function TransactionStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionStatus.prototype.getTxStatus = function () {
        var colorClass;
        var statusText;
        switch (this.props.tx.txStatus) {
            // TODO clean up colors
            case Enums.TxStatus.SUCCESS:
                colorClass = 'primary';
                statusText = 'Success';
                break;
            case Enums.TxStatus.FAILED:
                colorClass = 'error';
                statusText = 'Failed';
                break;
            case Enums.TxStatus.PENDING:
                colorClass = 'secondary';
                statusText = 'Pending';
                break;
            default:
                throw 'unknown tx status type';
        }
        return React.createElement(Typography, { variant: "subheading", color: colorClass }, statusText);
    };
    TransactionStatus.prototype.render = function () {
        var etherscanUrl = "https://etherscan.io/tx/" + this.props.tx.txHash;
        var isAuction = (this.props.tx.txType === Enums.TxType.AUCTION);
        // TODO, this component should contain a more info dropdown with the summary
        // of each transaction.
        var txTextComponent = (isAuction) ? "Auction Update Transaction" : "Purchase Transaction";
        var txStatusComponent = this.getTxStatus();
        return (React.createElement(ListItem, null,
            React.createElement(Avatar, null, (isAuction) ?
                (React.createElement(AttachMoney, null)) :
                (React.createElement(AddCircle, null))),
            React.createElement(ListItemText, { primary: txTextComponent, secondary: React.createElement("a", { href: etherscanUrl }, this.props.tx.txHash) }),
            txStatusComponent));
    };
    return TransactionStatus;
}(Component));
export default withStyles(styles)(TransactionStatus);
//# sourceMappingURL=TransactionStatus.js.map
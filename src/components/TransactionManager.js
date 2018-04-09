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
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Paper from 'material-ui/Paper';
import TransactionStatus from './TransactionStatus';
var styles = function (theme) { return ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    txList: {
        padding: 12
    }
}); };
var TransactionManager = /** @class */ (function (_super) {
    __extends(TransactionManager, _super);
    function TransactionManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionManager.prototype.getUserContent = function () {
        var _this = this;
        var pendingTransactions = this.props.userTransactions.map(function (tx, index) {
            return (React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(Paper, null,
                    React.createElement(TransactionStatus, { classes: _this.props.classes, tx: tx }))));
        });
        if (pendingTransactions.length == 0) {
            pendingTransactions.push(React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(Typography, { variant: "subheading" }, "There have been no transactions for this account.")));
        }
        return [
            (React.createElement(Grid, { item: true, xs: 8 },
                React.createElement(Typography, { variant: 'title' }, "My Transactions"))),
            (React.createElement(List, { className: this.props.classes.txList }, pendingTransactions))
        ];
    };
    TransactionManager.prototype.render = function () {
        var content = this.getUserContent();
        return (React.createElement(Grid, { container: true, className: this.props.classes.root, justify: "center" },
            React.createElement(Grid, { item: true, xs: 9 },
                React.createElement(Grid, { container: true, spacing: 24 }, content))));
    };
    return TransactionManager;
}(Component));
export default withStyles(styles)(TransactionManager);
//# sourceMappingURL=TransactionManager.js.map
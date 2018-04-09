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
import { withStyles } from 'material-ui/styles/';
import PlotInfo from './PlotInfo';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
var styles = function (theme) { return ({
    root: {
        flexGrow: 1,
        marginTop: 30,
        paddingBottom: 30
    }
}); };
var AccountManager = /** @class */ (function (_super) {
    __extends(AccountManager, _super);
    function AccountManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccountManager.prototype.getUserContent = function () {
        var _this = this;
        var plotInfos = this.props.userPlots.map(function (plot, index) {
            return (React.createElement(Grid, { key: index, item: true, xs: 12 },
                React.createElement(Paper, null,
                    React.createElement(PlotInfo, { info: plot, updatePrice: _this.props.updatePrice }))));
        });
        if (plotInfos.length == 0) {
            plotInfos.push(React.createElement(Grid, { key: 'no-data', item: true, xs: 12 },
                React.createElement(Typography, { variant: "subheading" }, "You don't have any owned plots. Visit the grid to purchase a plot.")));
        }
        return [
            (React.createElement(Grid, { item: true, xs: 8 },
                React.createElement(Typography, { variant: 'title' }, "My Content"))),
            plotInfos
        ];
    };
    AccountManager.prototype.render = function () {
        var content = this.getUserContent();
        return (React.createElement(Grid, { container: true, className: this.props.classes.root, justify: "center" },
            React.createElement(Grid, { item: true, xs: 9 },
                React.createElement(Grid, { container: true, spacing: 24 }, content))));
    };
    return AccountManager;
}(Component));
export default withStyles(styles)(AccountManager);
//# sourceMappingURL=AccountManager.js.map
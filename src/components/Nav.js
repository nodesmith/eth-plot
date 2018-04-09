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
import { NavLink } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import AccountBox from 'material-ui-icons/AccountBox';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
var styles = function (theme) { return ({
    badge: {
        margin: "0 " + theme.spacing.unit * 2 + "px",
    },
    flex: {
        flex: 1
    }
}); };
var Nav = /** @class */ (function (_super) {
    __extends(Nav, _super);
    function Nav() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Nav.prototype.clearNotifications = function () {
        this.props.clearNotifications();
    };
    Nav.prototype.navigate = function (to) {
        console.log("Navigating to " + to);
        this.props.doNavigation(to);
    };
    Nav.prototype.render = function () {
        var _this = this;
        var createNavLink = function (to) {
            return (React.createElement(NavLink, { to: to }));
        };
        return (React.createElement("div", null,
            React.createElement(AppBar, { position: "static", color: "primary" },
                React.createElement(Toolbar, null,
                    React.createElement(Button, { color: "inherit", onClick: this.navigate.bind(this, '/') },
                        React.createElement(Typography, { color: "inherit" }, "Eth Grid")),
                    React.createElement(Button, { color: "inherit", onClick: this.navigate.bind(this, '/myplots') },
                        React.createElement(Typography, { color: "inherit" }, "My Plots")),
                    React.createElement(Button, { color: "inherit", onClick: this.navigate.bind(this, '/about') },
                        React.createElement(Typography, { color: "inherit" }, "About")),
                    React.createElement("span", { className: this.props.classes.flex }),
                    React.createElement(IconButton, { onClick: function () { _this.clearNotifications(); _this.navigate('/account'); }, color: "inherit" }, (this.props.notificationCount) ?
                        (React.createElement(Badge, { className: this.props.classes.badge, badgeContent: this.props.notificationCount, color: "secondary" },
                            React.createElement(AccountBox, null))) :
                        React.createElement(AccountBox, null))))));
    };
    return Nav;
}(Component));
export default withStyles(styles)(Nav);
//# sourceMappingURL=Nav.js.map
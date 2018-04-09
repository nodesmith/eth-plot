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
import FullPageStatus from './FullPageStatus';
var styles = function (theme) { return ({
    logoContainer: {
        textAlign: "center"
    },
    logo: {
        width: "40%",
        height: "40%"
    }
}); };
var MetaMaskStatus = /** @class */ (function (_super) {
    __extends(MetaMaskStatus, _super);
    function MetaMaskStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MetaMaskStatus.prototype.render = function () {
        if (this.props.metamaskState === Enums.METAMASK_STATE.OPEN) {
            return null;
        }
        else if (this.props.metamaskState === Enums.METAMASK_STATE.UNINSTALLED) {
            return (React.createElement("div", { className: this.props.classes.logoContainer },
                React.createElement(FullPageStatus, { classes: this.props.classes, message: "You must have MetaMask intalled to use EthGrid.  Check it out here:" }),
                React.createElement("a", { href: "https://metamask.io", target: "_blank" },
                    React.createElement("img", { className: this.props.classes.logo, src: "../assets/metamasklogo.png" }))));
        }
        else if (this.props.metamaskState === Enums.METAMASK_STATE.LOCKED) {
            return (React.createElement("div", { id: "metamaskLogoContainer" },
                React.createElement(FullPageStatus, { classes: this.props.classes, message: "You must unlock MetaMask to proceed." })));
        }
    };
    return MetaMaskStatus;
}(Component));
export default withStyles(styles)(MetaMaskStatus);
//# sourceMappingURL=MetaMaskStatus.js.map
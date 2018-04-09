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
import ButtonBase from 'material-ui/ButtonBase';
import Divider from 'material-ui/Divider/Divider';
import Icon from 'material-ui/Icon';
var size = 30;
var styles = function (theme) { return ({
    root: {
        width: size
    },
    button: {
        height: size,
        width: size,
        backgroundColor: theme.palette.grey[200]
    }
}); };
var ZoomControl = /** @class */ (function (_super) {
    __extends(ZoomControl, _super);
    function ZoomControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomControl.prototype.zoomIn = function () {
        this.props.changeZoom(+1);
    };
    ZoomControl.prototype.zoomOut = function () {
        this.props.changeZoom(-1);
    };
    ZoomControl.prototype.render = function () {
        var classes = this.props.classes;
        return (React.createElement("div", { className: classes.root },
            React.createElement(ButtonBase, { focusRipple: true, key: 'plus', className: classes.button, onClick: this.zoomIn.bind(this) },
                React.createElement(Icon, null, "add")),
            React.createElement(Divider, null),
            React.createElement(ButtonBase, { focusRipple: true, key: 'minus', className: classes.button, onClick: this.zoomOut.bind(this) },
                React.createElement(Icon, null, "remove"))));
    };
    return ZoomControl;
}(Component));
export var ZoomControlComponent = withStyles(styles, { name: 'ZoomControl' })(ZoomControl);
//# sourceMappingURL=ZoomControl.js.map
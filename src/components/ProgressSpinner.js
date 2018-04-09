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
import { CircularProgress } from 'material-ui/Progress';
var styles = function (theme) { return ({
    progress: {},
    container: {
        position: "fixed",
        zIndex: 999,
        height: "2em",
        width: "2em",
        overflow: "visible",
        margin: "auto",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }
}); };
var ProgressSpinner = /** @class */ (function (_super) {
    __extends(ProgressSpinner, _super);
    function ProgressSpinner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressSpinner.prototype.render = function () {
        var classes = this.props.classes;
        return (React.createElement("div", { className: classes.container },
            React.createElement(CircularProgress, { className: classes.progress, size: 50 })));
    };
    return ProgressSpinner;
}(Component));
export default withStyles(styles)(ProgressSpinner);
//# sourceMappingURL=ProgressSpinner.js.map
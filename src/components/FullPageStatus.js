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
import Typography from 'material-ui/Typography/Typography';
var styles = function (theme) { return ({
    container: {
        paddingTop: 30,
        textAlign: "center"
    }
}); };
;
var FullPageStatus = /** @class */ (function (_super) {
    __extends(FullPageStatus, _super);
    function FullPageStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FullPageStatus.prototype.render = function () {
        return (React.createElement("div", { className: this.props.classes.container },
            React.createElement(Typography, { gutterBottom: true, variant: 'subheading' }, this.props.message)));
    };
    return FullPageStatus;
}(Component));
export default withStyles(styles)(FullPageStatus);
//# sourceMappingURL=FullPageStatus.js.map
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
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails, } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
var styles = function (theme) { return ({}); };
var FAQ = /** @class */ (function (_super) {
    __extends(FAQ, _super);
    function FAQ() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FAQ.prototype.render = function () {
        return (React.createElement(ExpansionPanel, { key: this.props.question },
            React.createElement(ExpansionPanelSummary, { expandIcon: React.createElement(ExpandMoreIcon, null) },
                React.createElement(Typography, { variant: 'subheading' }, this.props.question)),
            React.createElement(ExpansionPanelDetails, null,
                React.createElement(Typography, null, this.props.answer))));
    };
    return FAQ;
}(Component));
export default withStyles(styles)(FAQ);
//# sourceMappingURL=FAQ.js.map
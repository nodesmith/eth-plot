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
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
var styles = function (theme) { return ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
}); };
var WebsiteInputBox = /** @class */ (function (_super) {
    __extends(WebsiteInputBox, _super);
    function WebsiteInputBox(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            website: '',
            websiteValidation: _this.validateWebsite(undefined)
        };
        return _this;
    }
    WebsiteInputBox.prototype.websiteChanged = function (event) {
        var newValue = event.target.value;
        var validation = this.validateWebsite(newValue);
        this.setState({
            website: newValue,
            websiteValidation: validation
        });
        var websiteChangedMessage = {
            valid: validation.state !== 'error',
            value: newValue
        };
        this.props.onWebsiteChanged(websiteChangedMessage);
    };
    WebsiteInputBox.prototype.validateWebsite = function (website) {
        if (!website || website.length == 0) {
            return {
                state: null,
                message: 'The website where your plot links to'
            };
        }
        if (website.length < 7 || (website.indexOf('http://') !== 0 && website.indexOf('https://') !== 0)) {
            return {
                state: 'error',
                message: "The website must start with 'http://' or 'https://'"
            };
        }
        if (website.length > 2048) {
            return {
                state: 'error',
                message: "The website must be less than 2048 characters (" + website.length + " characters)"
            };
        }
        return {
            state: 'success',
            message: "Users will go to " + website + " when clicking your plot"
        };
    };
    WebsiteInputBox.prototype.render = function () {
        var classes = this.props.classes;
        var error = this.state.websiteValidation.state == 'error';
        return (React.createElement(TextField, { error: error, fullWidth: true, id: "website", label: "Plot Website", className: classes.textField, helperText: this.state.websiteValidation.message, onChange: this.websiteChanged.bind(this), margin: "normal", value: this.props.website }));
    };
    return WebsiteInputBox;
}(Component));
export default withStyles(styles)(WebsiteInputBox);
//# sourceMappingURL=WebsiteInputBox.js.map
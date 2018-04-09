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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import FAQ from './FAQ';
var styles = function (theme) { return ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    }
}); };
var questionsAndAnswers = [
    { question: "What is Eth Grid?", answer: "Coolest thing since sliced bread." },
    { question: "Why would I use this?", answer: "To be part of hethstory." },
    { question: "Are there fees?", answer: "Minor, to keep the lights on.  You can interact directly with our contracts though." }
];
var About = /** @class */ (function (_super) {
    __extends(About, _super);
    function About() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    About.prototype.render = function () {
        var _this = this;
        var items = questionsAndAnswers.map(function (qa, index) { return (React.createElement(FAQ, __assign({}, _this.props, { key: index }, qa))); });
        return (React.createElement(Grid, { className: this.props.classes.root, container: true, justify: "center" },
            React.createElement(Grid, { item: true, xs: 9 }, items)));
    };
    return About;
}(Component));
export default withStyles(styles)(About);
//# sourceMappingURL=About.js.map
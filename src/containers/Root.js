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
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from './App';
/**
 * Component is exported for conditional usage in Root.js
 */
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.render = function () {
        var store = this.props.store;
        return (
        /**
         * Provider is a component provided to us by the 'react-redux' bindings that
         * wraps our app - thus making the Redux store/state available to our 'connect()'
         * calls in component hierarchy below.
         */
        React.createElement(Provider, { store: store },
            React.createElement("div", null,
                React.createElement(HashRouter, null,
                    React.createElement(App, null)))));
    };
    return Root;
}(React.Component));
;
export default Root;
//# sourceMappingURL=Root.js.map
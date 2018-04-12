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
import AccountManager from '../components/AccountManager';
;
var AccountManagerContainer = /** @class */ (function (_super) {
    __extends(AccountManagerContainer, _super);
    function AccountManagerContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccountManagerContainer.prototype.updatePrice = function (zoneIndex, buyoutPrice) {
        this.props.actions.updateAuction(this.props.contractInfo, zoneIndex, buyoutPrice);
    };
    AccountManagerContainer.prototype.render = function () {
        var _this = this;
        var userPlots = this.props.plots ? this.props.plots.filter(function (plot) {
            if (plot.owner === _this.props.activeAccount) {
                return plot;
            }
        }) : [];
        return (React.createElement(AccountManager, { classes: {}, userPlots: userPlots, metamaskState: this.props.metamaskState, updatePrice: this.updatePrice.bind(this) }));
    };
    return AccountManagerContainer;
}(React.Component));
export default AccountManagerContainer;
//# sourceMappingURL=AccountManagerContainer.js.map
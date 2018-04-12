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
import TransactionManager from '../components/TransactionManager';
;
var TransactionManagerContainer = /** @class */ (function (_super) {
    __extends(TransactionManagerContainer, _super);
    function TransactionManagerContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionManagerContainer.prototype.render = function () {
        // We want to sort the transactions by how they happened chronologically,
        // which we can just use the block number to do.
        var comparator = function (tx1, tx2) {
            if (tx1.blockNumber < tx2.blockNumber)
                return 1;
            else if (tx1.blockNumber === tx2.blockNumber)
                return 0;
            else
                return -1;
        };
        var transactionArray = Object.values(this.props.userTransactions);
        var sortedTransactions = transactionArray.concat().sort(comparator);
        return (React.createElement(TransactionManager, { metamaskState: this.props.metamaskState, userTransactions: sortedTransactions, classes: {} }));
    };
    return TransactionManagerContainer;
}(React.Component));
export default TransactionManagerContainer;
//# sourceMappingURL=TransactionManagerContainer.js.map
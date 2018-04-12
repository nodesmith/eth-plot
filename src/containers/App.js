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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as AccountActions from '../actionCreators/AccountActions';
import * as DataActions from '../actionCreators/DataActions';
import * as GridActions from '../actionCreators/GridActions';
import * as PurchaseActions from '../actionCreators/PurchaseActions';
import * as Enums from '../constants/Enums';
import MainContainer from './MainContainer';
import AccountManagerContainer from './AccountManagerContainer';
import TransactionManagerContainer from './TransactionManagerContainer';
import About from '../components/About';
import ProgressSpinner from '../components/ProgressSpinner';
import Nav from '../components/Nav';
import MetaMaskStatus from '../components/MetaMaskStatus';
var Web3 = require('web3');
// export type AppProps = AppDataProps & AppActionProps extends;
/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.componentDidMount = function () {
        this.checkMetamaskStatus();
        /**
         * The following timer is the MetaMask recommended way of checking for
         * changes to MetaMask.  There are three possible states:
         *  1) A user doesn't have MetaMask installed.
         *  2) A user's MetaMask account is locked, they need to under a password to unlock.
         *  3) A user's account is open and ready for use.
         *
         * More info available here:
         * https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md
         */
        this.accountInterval = setInterval(function () {
            this.checkMetamaskStatus();
        }.bind(this), 1000000);
    };
    App.prototype.checkMetamaskStatus = function () {
        var _this = this;
        if (typeof window.web3 !== 'undefined') {
            var newWeb3 = new Web3(window.web3.currentProvider);
            newWeb3.eth.getAccounts(function (error, accounts) {
                if (accounts.length > 0) {
                    _this.props.actions.updateMetamaskState(Enums.METAMASK_STATE.OPEN);
                    if (accounts[0] != _this.props.account.activeAccount) {
                        // The only time we ever want to load data from the chain history
                        // is when we receive a change in accounts - this happens anytime 
                        // the page is initially loaded or if there is a change in the account info
                        // via a metamask interaction.
                        _this.appDataBootstrap();
                        _this.props.actions.updateActiveAccount(accounts[0]);
                    }
                }
                else {
                    _this.props.actions.updateMetamaskState(Enums.METAMASK_STATE.LOCKED);
                }
                ;
            });
        }
        else {
            this.props.actions.updateMetamaskState(Enums.METAMASK_STATE.UNINSTALLED);
        }
    };
    // Fetches all data needed for application - this happens when the app
    // first loads and also when metamask state changes
    App.prototype.appDataBootstrap = function () {
        var _this = this;
        this.props.actions.fetchPlotsFromWeb3(this.props.data.contractInfo);
        if (typeof window.web3 !== 'undefined') {
            var newWeb3 = new Web3(window.web3.currentProvider);
            newWeb3.eth.getAccounts(function (error, accounts) {
                _this.props.actions.fetchAccountTransactions(_this.props.data.contractInfo, accounts[0]);
            });
        }
    };
    // Returns true if we have finished loading all the data we need to and 
    // know the current user's metamask state.
    App.prototype.shouldShowSpinner = function () {
        return (this.props.data.isFetchingPlots ||
            this.props.account.isFetchingTransactions ||
            !this.props.account.metamaskStateKnown);
    };
    App.prototype.componentWillUnmount = function () {
        clearInterval(this.accountInterval);
    };
    App.prototype.clearNotifications = function () {
        this.props.actions.clearNotificationCount();
    };
    App.prototype.doNavigation = function (to) {
        this.props.history.push(to);
    };
    App.prototype.getMainBodyContent = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, purchase = _a.purchase;
        var mainContainerProps = {
            classes: {},
            actions: {
                purchaseImageSelected: actions.purchaseImageSelected,
                goToPurchaseStep: actions.goToPurchaseStep,
                completePurchaseStep: actions.completePurchaseStep,
                changePlotWebsite: actions.changePlotWebsite,
                changePlotBuyout: actions.changePlotBuyout,
                changeBuyoutEnabled: actions.changeBuyoutEnabled,
                completePlotPurchase: actions.completePlotPurchase,
                hoverOverPlot: actions.hoverOverPlot,
                startTransformRectToPurchase: actions.startTransformRectToPurchase,
                stopTransformRectToPurchase: actions.stopTransformRectToPurchase,
                transformRectToPurchase: actions.transformRectToPurchase,
                togglePurchaseFlow: actions.togglePurchaseFlow,
                changeZoom: actions.changeZoom
            },
            purchase: // this.props.purchase,
            {
                rectToPurchase: purchase.rectToPurchase,
                purchasePriceInWei: purchase.purchasePriceInWei,
                activeStep: purchase.activeStep,
                completedSteps: purchase.completedSteps,
                imageName: purchase.imageName,
                imageDimensions: purchase.imageDimensions,
                website: purchase.website,
                buyoutPriceInWei: purchase.buyoutPriceInWei,
                buyoutEnabled: purchase.buyoutEnabled,
                purchaseFlowOpen: purchase.purchaseFlowOpen,
                currentTransform: purchase.currentTransform
            },
            imageFileInfo: this.props.imageToPurchase.imageFileInfo,
            plots: this.props.data.plots,
            contractInfo: this.props.data.contractInfo,
            scale: this.props.grid.scale,
            gridInfo: this.props.data.gridInfo,
            hoveredIndex: this.props.grid.hoveredIndex,
            dragRectCurr: this.props.grid.dragRectCurr,
            dragRectStart: this.props.grid.dragRectStart,
            isDraggingRect: this.props.grid.isDraggingRect,
            purchaseDialog: {
                cancelPlotPurchase: actions.cancelPlotPurchase,
                purchaseStage: this.props.purchaseDialog.purchaseStage,
                isShowing: this.props.purchaseDialog.isShowing
            }
        };
        return (React.createElement(Switch, null,
            React.createElement(Route, { exact: true, path: '/', render: function (routeProps) { return (React.createElement(MainContainer, __assign({}, mainContainerProps, routeProps))); } }),
            React.createElement(Route, { path: '/myplots', render: function (routeProps) { return (React.createElement(AccountManagerContainer, __assign({}, routeProps, _this.props.data, _this.props.account, { actions: _this.props.actions }))); } }),
            React.createElement(Route, { path: '/about', component: About }),
            React.createElement(Route, { path: '/account', render: function (routeProps) { return (React.createElement(TransactionManagerContainer, __assign({}, routeProps, _this.props.account))); } })));
    };
    App.prototype.render = function () {
        var _this = this;
        var navProps = {
            classes: {},
            notificationCount: this.props.account.notificationCount,
            clearNotifications: this.clearNotifications.bind(this),
            doNavigation: function (to) { return _this.doNavigation(to); }
        };
        var mainBodyContent = this.getMainBodyContent();
        return (React.createElement("div", { className: "main-app-container" },
            React.createElement(Nav, __assign({}, navProps)),
            React.createElement("main", null, (this.shouldShowSpinner()) ?
                React.createElement(ProgressSpinner, { classes: {} }) :
                (this.props.account.metamaskState != Enums.METAMASK_STATE.OPEN) ?
                    React.createElement(MetaMaskStatus, { metamaskState: this.props.account.metamaskState, classes: {} }) :
                    mainBodyContent)));
    };
    return App;
}(React.Component));
/**
 * Global redux state.
 */
function mapStateToProps(state) {
    // console.log(state);
    return {
        account: state.account,
        data: state.data,
        grid: state.grid,
        purchase: state.purchase,
        imageToPurchase: state.imageToPurchase,
        purchaseDialog: state.purchaseDialog
    };
}
/**
 * Turns an object whose values are 'action creators' into an object with the same
 * keys but with every action creator wrapped into a 'dispatch' call that we can invoke
 * directly later on. Here we imported the actions specified in 'CounterActions.js' and
 * used the bindActionCreators function Redux provides us.
 *
 * More info: http://redux.js.org/docs/api/bindActionCreators.html
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, AccountActions, DataActions, GridActions, PurchaseActions), dispatch)
    };
}
/**
 * 'connect' is provided to us by the bindings offered by 'react-redux'. It simply
 * connects a React component to a Redux store. It never modifies the component class
 * that is passed into it, it actually returns a new connected componet class for use.
 *
 * More info: https://github.com/rackt/react-redux
 *
 * The withRouter wrapper ensures routes are properly updated.  More info here:
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/redux.md
 */
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
//# sourceMappingURL=App.js.map
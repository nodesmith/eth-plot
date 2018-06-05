import Grid from 'material-ui/Grid';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';

import { AllActions } from '../actions';
import * as AccountActions from '../actionCreators/AccountActions';
import * as DataActions from '../actionCreators/DataActions';
import * as GridActions from '../actionCreators/GridActions';
import * as PurchaseActions from '../actionCreators/PurchaseActions';
import { getWeb3 } from '../actionCreators/Web3Actions';
import About from '../components/About';
import LoadingStatus from '../components/LoadingStatus';
import MetaMaskStatus from '../components/MetaMaskStatus';
import OverlayNav, { OverlayNavProps } from '../components/OverlayNav';
import * as Enums from '../constants/Enums';
import { ContractInfo } from '../models';
import * as Reducers from '../reducers';

import AccountManagerContainer from './AccountManagerContainer';
import MainContainer from './MainContainer';
import TransactionManagerContainer from './TransactionManagerContainer';

export interface AppProps extends RouteComponentProps<any> {
  account: Reducers.AccountState;
  data: Reducers.DataState;
  grid: Reducers.GridState;
  purchase: Reducers.PurchaseState;
  purchaseDialog: Reducers.PurchaseDialogState;
  actions: AllActions;
}

/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
class App extends React.Component<AppProps> { 
  private accountInterval: number;

  componentDidMount() {
    this.checkMetamaskStatus(this.props.data.contractInfo);

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
    this.accountInterval = window.setInterval(
      () => {
        this.checkMetamaskStatus(this.props.data.contractInfo);
      },
      1000);
  }

  updateMetamaskState(newState: Enums.METAMASK_STATE, networkName: Enums.NetworkName): void {
    // Only emit this action if the state isn't known already or it's changed
    if (this.props.account.metamaskState !== newState) {
      this.props.actions.updateMetamaskState(newState, networkName);
    }
  }

  async checkMetamaskStatus(contractInfo: ContractInfo) {
    const web3AndContract = await getWeb3(contractInfo);

    if (!web3AndContract || !web3AndContract.web3.isConnected()) {
      this.updateMetamaskState(Enums.METAMASK_STATE.UNINSTALLED, Enums.NetworkName.Unknown);
      return;
    }

    web3AndContract.web3.eth.getAccounts((err, accounts) => {
      if (accounts && accounts.length > 0) {
        this.updateMetamaskState(Enums.METAMASK_STATE.OPEN, web3AndContract.networkName);

        if (accounts[0] !== this.props.account.activeAccount) {
          // The only time we ever want to load data from the chain history
          // is when we receive a change in accounts - this happens anytime 
          // the page is initially loaded or if there is a change in the account info
          // via a metamask interaction.
          this.props.actions.updateActiveAccount(accounts[0]);
          this.appDataBootstrap(accounts[0]);
        }
      } else {
        this.updateMetamaskState(Enums.METAMASK_STATE.LOCKED, web3AndContract.networkName);
      }
    });
  }

  // Fetches all data needed for application - this happens when the app
  // first loads and also when metamask state changes
  appDataBootstrap(activeAccount: string) {  
    this.props.actions.loadAndWatchEvents(this.props.data.contractInfo, activeAccount);
  }

  // Returns true if we have finished loading all the data we need to and 
  // know the current user's metamask state.
  shouldShowSpinner() {
    return (this.props.account.isLoadingData ||
            this.props.account.metamaskState === Enums.METAMASK_STATE.UNKNOWN);
  }

  componentWillUnmount() {
    window.clearInterval(this.accountInterval);

    // Clears all the web3 event listeners
    AccountActions.unregisterEventListners();
  }

  clearNotifications() {
    this.props.actions.clearNotificationCount();
  }

  doNavigation(to: string) {
    this.props.history.push(to);
  }

  getEtherscanUrl(txHash: string) {
    let baseUrl = '';
    switch (this.props.account.networkName) {
      case Enums.NetworkName.Main:
        baseUrl = 'https://etherscan.io';
        break;
      case Enums.NetworkName.Rinkeby:
      case Enums.NetworkName.Ropsten:
      case Enums.NetworkName.Kovan:
        baseUrl = `https://${this.props.account.networkName.toLowerCase()}.etherscan.io`;
        break;
      default:
        baseUrl = 'https://no.etherscan.for.local.networks';
    }

    const url = `${baseUrl}/tx/${txHash}`;
    return url;
  }

  getMainBodyContent() {
    const { actions, purchase } = this.props;
    const getEtherscanUrl = this.getEtherscanUrl.bind(this);
    const mainContainerProps = {
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
        changeZoom: actions.changeZoom,
        loadBlockInfo: actions.loadBlockInfo,
        reportGridDragging: actions.reportGridDragging,
        toggleShowHeatmap: actions.toggleShowHeatmap,
        toggleShowGrid: actions.toggleShowGrid
      },
      purchase: // this.props.purchase,
      {
        rectToPurchase: purchase.rectToPurchase,
        purchasePriceInWei: purchase.purchasePriceInWei,
        activeStep: purchase.activeStep,
        completedSteps: purchase.completedSteps,
        imageFileInfo: purchase.imageFileInfo,
        allowedFileTypes: purchase.allowedFileTypes,

        imageDimensions: purchase.imageDimensions,
        website: purchase.website,
        buyoutPricePerPixelInWei: purchase.buyoutPricePerPixelInWei,
        buyoutEnabled: purchase.buyoutEnabled,
        purchaseFlowOpen: purchase.purchaseFlowOpen,
        currentTransform: purchase.currentTransform,

        imageValidation: purchase.imageValidation,
        showHeatmap: purchase.showHeatmap,
        showGrid: purchase.showGrid
      },
      imageFileInfo: this.props.purchase.imageFileInfo,
      plots: this.props.data.plots,
      plotTransactions: this.props.data.plotTransactions,
      holes: this.props.data.holes,
      contractInfo: this.props.data.contractInfo,
      scale: this.props.grid.scale,
      gridInfo: this.props.data.gridInfo,
      centerPoint: this.props.grid.centerPoint,
      isDraggingGrid: !!this.props.grid.dragStart,
      hoveredIndex: this.props.grid.hoveredIndex,
      dragRectCurr: this.props.grid.dragRectCurr,
      dragRectStart: this.props.grid.dragRectStart,
      isDraggingRect: this.props.grid.isDraggingRect,
      activeAccount: this.props.account.activeAccount,
      purchaseDialog: {
        closePlotPurchase: actions.closePlotPurchase,
        resetPurchaseFlow: actions.resetPurchaseFlow,
        purchaseStage: this.props.purchaseDialog.purchaseStage,
        isShowing: this.props.purchaseDialog.isShowing
      },
      lowPlotPrice: this.props.data.lowPlotPrice,
      highPlotPrice: this.props.data.highPlotPrice,
      getEtherscanUrl
    };


    return (
      <Switch>
        <Route exact path="/" render={(routeProps) => (
          <MainContainer {...mainContainerProps} {...routeProps}/>
        )}/>
        <Route path="/myplots" render={(routeProps) => (
          <AccountManagerContainer 
            {...routeProps} {...this.props.data} {...this.props.account} actions={this.props.actions} getEtherscanUrl={getEtherscanUrl} />
        )}/>
        <Route path="/account" render={(routeProps) => (
        <TransactionManagerContainer {...routeProps} {...this.props.account} getEtherscanUrl={getEtherscanUrl} />
        )}/>
        <Route path="/about" component={About}/>
      </Switch>
    );
  }

  render() {
    const navProps: OverlayNavProps = {
      classes: {},
      notificationCount: this.props.account.notificationCount,
      clearNotifications: this.clearNotifications.bind(this),
      doNavigation: to => this.doNavigation(to),
      currentPath: this.props.history.location.pathname,
      snackbarMessage: this.props.purchase.snackbarMessage,
      networkName: this.props.account.networkName
    };

    const mainBodyContent = this.getMainBodyContent();

    const mainAppStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: 'rgba(252, 252, 252, 1)',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflowY: 'auto',
      overflowX: 'hidden'
    };

    const fullPageContainer: React.CSSProperties = {
      width: '100%',
      height: '100%'
    };

    const metamaskStatus: JSX.Element = (
      <Grid container style={fullPageContainer} justify="center" alignItems="center">
        <Grid item>
          <MetaMaskStatus metamaskState={this.props.account.metamaskState} classes={{}} />
        </Grid>
      </Grid>
    );

    const numberOfPlots = this.props.data.numberOfPlots;
    const loadingMessage = numberOfPlots === 0 ? 
      'Loading Ethereum Contract' :
      `Loaded ${this.props.data.plots.length}/${this.props.data.numberOfPlots} Plots`;

    const totalProgressStages = this.props.data.numberOfPlots + 1; // Add 1 for the initial contract fetching
    const progressAmount = (numberOfPlots === 0 ? 0 : 1) + this.props.data.plots.length;

    const spinner: JSX.Element = (
      <LoadingStatus classes={{}}
      message={loadingMessage}
      progress={100 * progressAmount / totalProgressStages}
      />);

    return (
      <div style={mainAppStyle}>
        {
          (this.shouldShowSpinner()) ? spinner
           :
            (this.props.account.metamaskState !== Enums.METAMASK_STATE.OPEN) ? metamaskStatus 
            : mainBodyContent
        }
        <OverlayNav {...navProps} />
      </div>
    );
  }
}

/**
 * Global redux state.
 */
function mapStateToProps(state: Reducers.RootState) {
  // console.log(state);
  return {
    account: state.account,
    data: state.data,
    grid: state.grid,
    purchase: state.purchase,
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
function mapDispatchToProps(dispatch: Dispatch<any>) {
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
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));

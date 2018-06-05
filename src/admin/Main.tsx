import { Button, Grid, Typography } from 'material-ui';
import { withStyles, StyleRulesCallback } from 'material-ui/styles';
import * as queryString from 'query-string';
import * as React from 'react';
import * as Web3 from 'web3';

import { promisify } from '../../gen-src/typechain-runtime';
import { EthPlot } from '../../gen-src/EthPlot';

const styles: StyleRulesCallback = theme => ({
  root: {
    paddingTop: 24,
    paddingBottom: 16
  },
  main: {
    padding: 20
  }
});

interface ContractInfo {
  balance: string;
  adminAddress: string;
  numberOfPlots: string;
}

export interface MainState {
  account: string;
  web3?: Web3;
  contractAddress: string;
  isDeploying: boolean;
  contractInfo?: ContractInfo;
}

class Main extends React.Component<{}, MainState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      account: '',
      contractAddress: '',
      isDeploying: false
    };
  }

  async deployNewContract() {
    this.setState({ isDeploying: true });
    const { account, web3 } = this.state;
    const tempInstance = new EthPlot(web3, '0x0');
    const abi = tempInstance.contractAbi as Web3.AbiDefinition[];
    const bytecode = tempInstance.rawBytecode;
    const gasEstimate = await promisify(web3!.eth.estimateGas, [{ data: bytecode }]);
  
    const rawContract = web3!.eth.contract(abi);
    const newContractArgs = {
      data: bytecode,
      from: account,
      gas: gasEstimate
    };
  
    const result = await new Promise<{address:string}>((resolve, reject) => {
      rawContract.new(newContractArgs, (err, data) => {
        if (err) { return reject(err); }
        if (data.address) {
          resolve(data);
        }
      });
    });

    this.setState({ isDeploying: false });

    // Reload the page using this contract address as the query string
    const newQueryString = queryString.parse(window.location.search);
    newQueryString.contractAddress = result.address;
    window.location.search = queryString.stringify(newQueryString);
  }

  async withdrawContractFunds() {
    const { web3, contractAddress, account } = this.state;
    const contractInstance = await EthPlot.createAndValidate(web3, contractAddress);
    const withdrawTx = contractInstance.withdrawTx(account);
    const gasEstimate = await withdrawTx.estimateGas({ from: account });
    const transactionResult = await withdrawTx.send({ from: account, gas: gasEstimate.times(2) });
    alert(`Withdraw Succeeded! ${transactionResult}`);
  }
  
  async componentDidMount() {
    const web3 = window.web3;
    const accounts: string[] = await promisify(web3.eth.getAccounts, []);
    const account = accounts[0];
    const contractAddress = queryString.parse(window.location.search).contractAddress;
    let contractInfo: ContractInfo | undefined = undefined;
    if (contractAddress) {
      // Grab some info about the contract
      const contractInstance = await EthPlot.createAndValidate(web3, contractAddress);
      const adminAddress = await contractInstance.owner;
      const balance: string = (await promisify(web3.eth.getBalance, [contractAddress])).toString();
      const numberOfPlots = (await contractInstance.ownershipLength).toString();
      contractInfo = {
        adminAddress,
        balance,
        numberOfPlots
      };
    }

    this.setState({ account, web3, contractAddress, contractInfo });
  }

  render() {
    let instanceInfo: null | JSX.Element[] = null;
    if (this.state.contractInfo) {
      const isOwner = this.state.contractInfo.adminAddress === this.state.account;
      instanceInfo = [
        (<Typography variant="headline">Contract deployed at: {this.state.contractAddress}</Typography>),
        (<Typography variant="headline">Contract Balance: {this.state.contractInfo.balance}</Typography>),
        (<Typography variant="headline">Number of Plots: {this.state.contractInfo.numberOfPlots}</Typography>),
        (<Typography gutterBottom={true} variant="headline">Owner Address: {this.state.contractInfo.adminAddress}</Typography>),
        (<Button onClick={this.withdrawContractFunds.bind(this)} color="primary" variant="raised" disabled={!isOwner}>
          {isOwner ? 'Withdraw Contract Funds' : 'Cannot withdraw, not the owner'}
        </Button>)
      ];
    }


    return (<Grid container justify="center" spacing={16}>
      <Grid item xs={8}>
        <Typography variant="headline"> Hello Admin: {this.state.account} </Typography>
      </Grid>
      <Grid item xs={8}>
        <Button onClick={this.deployNewContract.bind(this)} color="primary" variant="raised" disabled={this.state.isDeploying}>
          {this.state.isDeploying ? 'Deploying Contract...' : 'Deploy New Contract Instance'}
        </Button>
      </Grid>
      <Grid item xs={8}>
        {instanceInfo}
      </Grid>
    </Grid >);
  }
}

export default withStyles(styles)(Main);

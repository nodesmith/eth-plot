import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';

import * as Enums from '../constants/Enums';

import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import MetaMaskStatus from './MetaMaskStatus';


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  }
});


class PlotManager extends Component {
  getFullPageStatus() {
    if (this.props.metamaskState === Enums.METAMASK_STATE.OPEN) {
      return (<FullPageStatus message="You don't have any owned plots. Visit the grid to purchase a plot." />);
    } else {
      return (
        <MetaMaskStatus metamaskState={this.props.metamaskState} />
      );
    }
  }

  getUserPlots() {
    const plotInfos = this.props.userPlots.map((plot, index) => {
      return (
      <Grid item xs={12}>
        <Paper>
          <PlotInfo info={plot} key={index} actions={this.props.actions} contractInfo={this.props.contractInfo} />
        </Paper>
      </Grid>);
    });

    return [(<Grid item xs={8}>
      <Typography type='title'>My Content</Typography>
    </Grid>)].concat(plotInfos);
  }

  render() {

    let content = this.props.metamaskState !== Enums.METAMASK_STATE.OPEN || this.props.userPlots.length === 0 ? 
      this.getFullPageStatus() :
      this.getUserPlots();

    return (
      <Grid container className={this.props.classes.root} justify="center" >
        <Grid item xs={9} >
          <Grid container spacing={24} >
            {content}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

PlotManager.propTypes = {
  userPlots: PropTypes.array.isRequired,
  metamaskState: PropTypes.number.isRequired
};

export default withStyles(styles)(PlotManager);
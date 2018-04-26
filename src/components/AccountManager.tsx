import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles/';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';
import { PlotInfo as PlotInfoData } from '../models'

import * as Enums from '../constants/Enums';

import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Grid from 'material-ui/Grid';
import List, { ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';

const styles: StyleRulesCallback = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    paddingBottom: 30
  }
});

export interface AccountManagerProps extends WithStyles {
  userPlots: Array<PlotInfoData>;
  updatePrice: () => void;
  metamaskState: number;
}

class AccountManager extends Component<AccountManagerProps> {
  getUserContent() {
    const plotInfos = this.props.userPlots.map((plot, index) => {
      return (
        <Grid key={index} item xs={12}>
          <Paper>
            <PlotInfo info={plot} updatePrice={this.props.updatePrice} />
          </Paper>
        </Grid>
      );
    });

    if (plotInfos.length == 0) {
      plotInfos.push(
        <Grid key='no-data' item xs={12} >
          <Typography variant="subheading">You don't have any owned plots. Visit the grid to purchase a plot.</Typography>
        </Grid>
      )
    }

    return [
      (<Grid key='title' item xs={8}>
        <Typography variant='title'>My Content</Typography>
      </Grid>),
      plotInfos
    ]
  }

  render() {
    const content = this.getUserContent();

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

export default withStyles(styles)(AccountManager);
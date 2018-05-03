import ExpandMore from 'material-ui-icons/ExpandMore';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles/';
import Grid from 'material-ui/Grid';
import List, { ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as Enums from '../constants/Enums';
import { PlotInfo as PlotInfoData, HoleInfo as HoleInfoData } from '../models';

import PlotInfo from './PlotInfo';

const styles: StyleRulesCallback = theme => ({
  root: {
    paddingTop: 24,
    paddingBottom: 16
  }
});

export interface AccountManagerProps extends WithStyles {
  userPlots: Array<PlotInfoData>;
  holes: HoleInfoData;
  updatePrice: () => void;
  metamaskState: number;
}

class AccountManager extends Component<AccountManagerProps> {
  getUserContent() {
    const plotInfos = this.props.userPlots.map((plot, index) => {
      return (
        <Grid key={index} item xs={9}>
          <Paper>
            <PlotInfo info={plot} holes={this.props.holes[index] || []} updatePrice={this.props.updatePrice} />
          </Paper>
        </Grid>
      );
    });

    return [
      (<Grid key="title" item xs={9}>
        <Typography align="center" variant="headline">My Plots</Typography>
      </Grid>),
      plotInfos
    ];
  }

  render() {
    const content = this.getUserContent();

    return (
      <Grid container className={this.props.classes.root} justify="center" spacing={24} >
        {content}
        {(this.props.userPlots.length == 0) ? 
          <Typography variant="subheading">You don't have any owned plots. Visit the grid to purchase a plot.</Typography>
          : null
        }
      </Grid>
    );
  }
}

export default withStyles(styles)(AccountManager);

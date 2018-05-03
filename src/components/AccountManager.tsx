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
import { PlotInfo as PlotInfoData, HoleInfo as HoleInfoData, PurchaseEventInfo } from '../models';

import PlotInfo from './PlotInfo';

const styles: StyleRulesCallback = theme => ({
  root: {
    paddingTop: 24,
    paddingBottom: 16
  }
});

export interface AccountManagerProps extends WithStyles {
  plots: Array<PlotInfoData>;
  holes: HoleInfoData;
  plotTransactions: {[index: number]: PurchaseEventInfo};
  updatePrice: () => void;
  metamaskState: number;
  activeAccount: string;
}

class AccountManager extends Component<AccountManagerProps> {
  /**
   * Returns an array of plots that are owned by the current user.
   */
  getUserFilteredPlots(): Array<PlotInfoData> {
    return this.props.plots.filter((plot, index) => {
      if (index != plot.zoneIndex) {
        throw 'Unexpected malformed data in plots data.';
      }
      
      if (plot.owner === this.props.activeAccount && index > 0) {
        return plot;
      }
    });
  }

  getUserContent(filteredPlots) {
    const plotInfoComponents = filteredPlots.map((plot) => {     
      return (
        <Grid key={plot.zoneIndex} item xs={9}>
          <Paper>
            <PlotInfo info={plot} 
                      holes={this.props.holes[plot.zoneIndex] || []} 
                      updatePrice={this.props.updatePrice}
                      purchaseInfo={this.props.plotTransactions[plot.zoneIndex]} />
          </Paper>
        </Grid>
      );
    });

    return [
      (<Grid key="title" item xs={9}>
        <Typography align="center" variant="headline">My Plots</Typography>
      </Grid>),
      plotInfoComponents
    ];
  }

  render() {
    const filteredPlots = this.getUserFilteredPlots();
    const plotInfoComponents = this.getUserContent(filteredPlots);

    return (
      <Grid container className={this.props.classes.root} justify="center" spacing={24} >
        {plotInfoComponents}
        {(filteredPlots.length == 0) ? 
          <Typography variant="subheading">You do not own any plots on the grid. Visit the grid to purchase a plot.</Typography>
          : null
        }
      </Grid>
    );
  }
}

export default withStyles(styles)(AccountManager);

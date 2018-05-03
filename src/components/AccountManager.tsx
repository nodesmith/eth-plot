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

import FullPageStatus from './FullPageStatus';
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
  getUserContent() {
    const plotInfos = this.props.plots.map((plot, index) => {
      if (index != plot.zoneIndex) {
        throw 'Unexpected malformed data in plots data.';
      }
      
      if (plot.owner === this.props.activeAccount && index > 0) {
        return (
          <Grid key={index} item xs={9}>
            <Paper>
              <PlotInfo info={plot} 
                        holes={this.props.holes[index] || []} 
                        updatePrice={this.props.updatePrice}
                        purchaseInfo={this.props.plotTransactions[index]} />
            </Paper>
          </Grid>
        );
      }
    });

    if (plotInfos.length === 0) {
      plotInfos.push(
        <Grid key="no-data" item xs={9} >
          <Typography variant="subheading">You don't have any owned plots. Visit the grid to purchase a plot.</Typography>
        </Grid>
      );
    }

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
      </Grid>
    );
  }
}

export default withStyles(styles)(AccountManager);

import ExpandMore from 'material-ui-icons/ExpandMore';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles/';
import Divider from 'material-ui/Divider';
import { FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import List, { ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import * as Enums from '../constants/Enums';
import { HoleInfo as HoleInfoData, PlotInfo as PlotInfoData, PurchaseEventInfo } from '../models';

import PlotInfo from './PlotInfo';

const styles: StyleRulesCallback = theme => ({
  root: {
    paddingTop: 24,
    paddingBottom: 16
  },
  noTxHeader: {
    marginTop: 8
  },
  divider: {
    margin: 16
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

interface AccountManagerState {
  showUnsoldPlots: boolean;
}

class AccountManager extends React.Component<AccountManagerProps, AccountManagerState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showUnsoldPlots: false
    };
  }

  /**
   * Returns an array of plots that are owned by the current user.
   */
  getUserFilteredPlots(): Array<PlotInfoData> {
    return this.props.plots.filter((plot, index) => {
      if (index !== plot.zoneIndex) {
        throw 'Unexpected malformed data in plots data.';
      }
      
      if (plot.owner === this.props.activeAccount && index > 0) {
        return plot;
      }
    });
  }

  toggleSoldPlots(): void {
    this.setState({ showUnsoldPlots: !this.state.showUnsoldPlots });
  }

  /**
   * Returns true if every pixel in the plot has been sold
   */
  isPlotSold(plot: PlotInfoData): boolean {
    const plotHoles = this.props.holes[plot.zoneIndex];

    if (!plotHoles) {
      return false; // this plot hasn't sold any pixels yet
    }

    let tiledPixels = 0;
    plotHoles.forEach(hole => {
      tiledPixels += (hole.w * hole.h);
    });

    return (tiledPixels === (plot.rect.w * plot.rect.h));
  }

  getUserContent(filteredPlots: Array<PlotInfoData>) {
    const plotInfoComponents: JSX.Element[] = [];
    const soldPlotInfoComponents: JSX.Element[] = [];
    
    filteredPlots.forEach(plot => {   
      const isPlotSold = this.isPlotSold(plot);  
      const plotElement = (
        <Grid key={plot.zoneIndex} item xs={9}>
          <Paper>
            <PlotInfo info={plot} 
                      holes={this.props.holes[plot.zoneIndex] || []} 
                      updatePrice={this.props.updatePrice}
                      purchaseInfo={this.props.plotTransactions[plot.zoneIndex]}
                      isPlotSold={isPlotSold} />
          </Paper>
        </Grid>
      );

      if (isPlotSold) {
        soldPlotInfoComponents.push(plotElement);
      } else {
        plotInfoComponents.push(plotElement);
      }
    });

    const soldPlotsHeader = (soldPlotInfoComponents.length > 0) ? [
      <Grid key="divider" item xs={9}>
        <Divider className={this.props.classes.divider} light />
      </Grid>,
      <Grid key="toggle" container justify="center" >
      <FormControlLabel
        control={
          <Switch color="primary" checked={this.state.showUnsoldPlots} onChange={this.toggleSoldPlots.bind(this)} />
        }
        label="Show sold plots"
      />
      </Grid>
    ] : null;

    return [
      plotInfoComponents,
      soldPlotsHeader,
      (this.state.showUnsoldPlots) ? soldPlotInfoComponents : null
    ];
  }

  render() {
    const filteredPlots = this.getUserFilteredPlots();
    const plotInfoComponents = this.getUserContent(filteredPlots);

    return (
      <Grid container className={this.props.classes.root} justify="center" spacing={24} >
        <Grid key="title" item xs={9}>
          <Typography align="center" variant="headline">My Plots</Typography>
        </Grid>
        {plotInfoComponents}
        {(filteredPlots.length === 0) ? 
        <Typography 
          className={this.props.classes.noTxHeader} 
          variant="subheading">
          You do not own any plots on the grid. Visit the grid to purchase a plot.
        </Typography>
        : plotInfoComponents }
      </Grid>
    );
  }
}

export default withStyles(styles)(AccountManager);

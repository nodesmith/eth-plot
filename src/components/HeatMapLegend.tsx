import { Paper, Typography } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { BigNumber } from 'bignumber.js';
import * as d3Palette from 'd3-scale-chromatic';


const colors = d3Palette.schemeRdYlGn[11].slice(0, 11);
const styles: StyleRulesCallback = theme => ({
  root: {
    padding: theme.spacing.unit,
    width: 220,
    height: 38
  },
  gradient: {
    width: '100%',
    height: '100%',
    background: `linear-gradient(to right, ${colors.join(' , ')})`,
    border: 'solid',
    borderColor: theme.palette.grey['600'],
    borderWidth: 1
  }
});

export interface HeatMapLegendProps extends WithStyles {
  minPrice: string;
  maxPrice: string;
}

class HeatMapLegend extends React.Component<HeatMapLegendProps> {
  render() {
    const { classes } = this.props;

    const priceRange = new BigNumber(this.props.maxPrice).minus(new BigNumber(this.props.minPrice));
    // const value = new BigNumber(1).minus(aboveMin.div(priceRange));
    // const color = d3Palette.schemeRdYlGn[11];

    return (
      <Paper className={classes.root}>
        <div className={classes.gradient}>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(HeatMapLegend);

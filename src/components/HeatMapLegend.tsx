import { BigNumber } from 'bignumber.js';
import * as d3Palette from 'd3-scale-chromatic';
import { Paper, Typography } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { formatEthValueToString } from '../data/ValueFormatters';


const colors = d3Palette.schemeRdYlGn[11].slice(0, 11).reverse();
const styles: StyleRulesCallback = theme => ({
  root: {
    padding: theme.spacing.unit,
    paddingBottom: 0
    // width: 220
  },
  gradient: {
    stroke: theme.palette.grey['800'],
    strokeWidth: 1
  },
  legendSvg: {
    width: 200,
    height: 40,
  },
  tickLine: {
    stroke: theme.palette.grey['800'],
    strokeWidth: 2
  },
  labelFont: theme.typography.headline
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

    const minLabel = formatEthValueToString(this.props.minPrice);
    const maxLabel = formatEthValueToString(this.props.maxPrice);

    return (
      <Paper className={classes.root}>
        <svg className={classes.legendSvg} width="400" height="80" viewBox="-5 -5 405 85">
          <defs>
            <linearGradient id="colorGradient">
              {colors.map((color, index) => (<stop offset={`${index * 100 / 11}%`} stopColor={color} key={index} />))}
            </linearGradient>
          </defs>
          <rect className={classes.gradient} x={0} y={20} width={400} height={60} fill="url(#colorGradient)" />

          <line className={classes.tickLine} x1={1} x2={1} y1={15} y2={20} />
          <line className={classes.tickLine} x1={100} x2={100} y1={15} y2={20} />
          <line className={classes.tickLine} x1={200} x2={200} y1={15} y2={20} />
          <line className={classes.tickLine} x1={300} x2={300} y1={15} y2={20} />
          <line className={classes.tickLine} x1={399} x2={399} y1={15} y2={20} />
          <text className={classes.labelFont} alignmentBaseline="baseline" x="4" y="12" width="100" height="15">{minLabel}</text>
          <text className={classes.labelFont} textAnchor="end" alignmentBaseline="baseline" x="396" y="12" width="100" height="15">{maxLabel}</text>
        </svg>
        <Typography variant="body1" align="center" gutterBottom={true}>
          Price per Pixel
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(HeatMapLegend);

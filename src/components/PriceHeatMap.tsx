import * as d3Interpolate from 'd3-interpolate';
import * as d3Palette from 'd3-scale-chromatic';
import { Paper } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Popover from 'material-ui/Popover';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as ActionTypes from '../actions';
import { HoleInfo, PlotInfo, Rect } from '../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    pointerEvents: 'none',
    opacity: .9
  },
  notForSale: {
    fill: 'black'
  },
  forSale: {
    fill: 'green'
  }
});

export interface PriceHeatMapProps extends WithStyles {
  plots: Array<PlotInfo>;
  holes: HoleInfo;
  scale: number;
}

class PriceHeatMap extends Component<PriceHeatMapProps> {
  render() {
    let minPrice = Number.MAX_SAFE_INTEGER;
    let maxPrice = Number.EPSILON;

    this.props.plots.forEach((plot) => {
      if (plot.buyoutPrice > 0) {
        minPrice = Math.min(minPrice, plot.buyoutPrice);
        maxPrice = Math.max(maxPrice, plot.buyoutPrice);
      }
    });

    const priceRange = maxPrice - minPrice;
    const scale = this.props.scale;

    const elements = this.props.plots.map((plot) => {
      let color = 'black';
      if (plot.buyoutPrice > 0) {
        const aboveMin = plot.buyoutPrice - minPrice;
        const value = 1 - (aboveMin / priceRange);
        color = d3Palette.interpolateRdYlGn(value);
      }

      return (<rect
        fill={color}
        x={plot.rect.x * scale} y={plot.rect.y * scale} width={plot.rect.w * scale} height={plot.rect.h * scale} 
      />);
    });

    return (
    <svg className={this.props.classes.root} viewBox={`0 0 ${this.props.scale * 250} ${this.props.scale * 250}`}>
      {elements}
    </svg>);
  }
}

export default withStyles(styles)(PriceHeatMap);

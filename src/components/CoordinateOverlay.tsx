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
});

export interface CoordinateOverlayProps extends WithStyles {
  scale: number;
}

class CoordinateOverlay extends Component<CoordinateOverlayProps> {
  render() {
    const vertical: JSX.Element[] = [];
    const horizontal: JSX.Element[] = [];

    const thinStyle = {
      strokeWidth: '.5px',
      stroke: 'black'
    };

    const scaledBox = 250 * this.props.scale;

    for (let i = 0; i <= 250; i++) {
      const scaled = i * this.props.scale;
      vertical.push((<line style={thinStyle} x1={scaled} x2={scaled} y1={0} y2={scaledBox} key={`vert_${i}`} />));
      horizontal.push((<line style={thinStyle} y1={scaled} y2={scaled} x1={0} x2={scaledBox} key={`hor_${i}`} />));
    }
    return (
    <svg className={this.props.classes.root} viewBox={`0 0 ${scaledBox} ${scaledBox}`}>
      {vertical}
      {horizontal}
    </svg>);
  }
}

export default withStyles(styles)(CoordinateOverlay);

import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as React from 'react';

import { PlotInfo } from '../models';

export interface GridPlotProps extends WithStyles {
  plot: PlotInfo;
  index: number;
  scale: number;
  hoverAction: (index: number) => void;
  isHovered: boolean;
  imageUrl: string;
}

const styles: StyleRulesCallback = theme => ({
  gridPlot: {
    position: 'absolute'
  }
});

class GridPlot extends React.Component<GridPlotProps> {
  mouseOver() {
    this.props.hoverAction(this.props.index);
  }

  render() {
    const rect = this.props.plot.rect;
    const scale = this.props.scale;
    const plotStyle: React.CSSProperties = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale,
      // backgroundImage: `url("${this.props.imageUrl}")`,
      backgroundSize: 'cover'
      // backgroundColor: this.props.plot.color
    };

    if (this.props.isHovered) {
      plotStyle.outlineColor = '#fff';
      plotStyle.outlineWidth = '1px';
      plotStyle.outlineStyle = 'solid';
    }

    return (
      <a href={this.props.plot.data.url}
        target="blank" key={this.props.index}
        style={plotStyle}
        className={this.props.classes.gridPlot}
        onMouseOver={this.mouseOver.bind(this)}>
        <img src={this.props.imageUrl} height={'100%'} width={'100%'} />
      </a>
    );
  }
}

export default withStyles(styles)(GridPlot);

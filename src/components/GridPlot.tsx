import * as React from 'react';
import { PlotInfo } from '../models';

export interface GridPlotProps {
  plot: PlotInfo;
  index: number;
  scale: number;
  hoverAction: (index: number) => void;
  isHovered: boolean;
}

export default class GridPlot extends React.Component<GridPlotProps> {
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
      backgroundColor: this.props.plot.color
    };

    if (this.props.isHovered) {
      plotStyle.outlineColor = '#fff';
      plotStyle.outlineWidth = '1px';
      plotStyle.outlineStyle = 'solid';
    }

    return (
      <a href={this.props.plot.data.url}
        target='blank' key={this.props.index}
        style={plotStyle}
        className="gridPlot"
        onMouseOver={this.mouseOver.bind(this)}>
      </a>
    );
  }
}

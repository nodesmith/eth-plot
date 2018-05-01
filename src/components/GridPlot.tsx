import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import * as React from 'react';

import { loadFromIpfsOrCache } from '../data/ImageRepository';
import { PlotInfo } from '../models';

export interface GridPlotProps extends WithStyles {
  plot: PlotInfo;
  index: number;
  scale: number;
  hoverAction: (index: number, source: HTMLElement) => void;
  clickAction: (index: number, source: HTMLElement) => void;
  isHovered: boolean;
  ipfsHash: string;
  tooltipTitle: string;
}

const styles: StyleRulesCallback = theme => ({
  gridPlot: {
    position: 'absolute'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    opacity: 0,
    transition: '.5s ease',
    backgroundColor: '#FFFFFF',
    backgroundBlendMode: 'multiply'
  }
});

class GridPlot extends React.Component<GridPlotProps> {
  constructor(props: GridPlotProps, context?: any) {
    super(props, context);

    this.state = {
      imageUrl: undefined
    };
  }

  mouseOver(event: MouseEvent) {
    this.props.hoverAction(this.props.index, event.target as HTMLElement);
  }

  onClick(event: MouseEvent) {
    this.props.clickAction(this.props.index, event.target as HTMLElement);
  }

  // componentDidMount() {
  //   loadFromIpfsOrCache(this.props.ipfsHash).then(imageBlob => {
  //     this.setState({ imageUrl: URL.createObjectURL(imageBlob) });
  //   }).catch(err => {
  //     // TODO - Put in some sort of error url
  //   });
  // }

  render() {
    const rect = this.props.plot.rect;
    const scale = this.props.scale;
    const plotStyle: React.CSSProperties = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale,
      backgroundSize: 'cover'
    };

    const showToolTip = this.props.isHovered && this.props.index !== 0;
    const overlayStyle: React.CSSProperties = {};

    if (showToolTip) {
      plotStyle.cursor = 'pointer';
      overlayStyle.opacity = .25;
    }

    const imageSource = this.props.plot.data.blobUrl;

    return (
      <div
        key={this.props.index}
        style={plotStyle}
        className={this.props.classes.gridPlot}
        onMouseOver={this.mouseOver.bind(this)}
        onClick={this.onClick.bind(this)}>
          <img src={imageSource} height={'100%'} width={'100%'} />
          <div className={this.props.classes.overlay} style={overlayStyle} />
      </div>
    );
  }
}

export default withStyles(styles)(GridPlot);
    

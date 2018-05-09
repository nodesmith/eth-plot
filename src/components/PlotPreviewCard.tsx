import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import { PixelStatus } from './PlotInfo';

export interface PlotPreviewCardProps extends WithStyles {
  blobUrl: string;
  w: number;
  h: number;
  pixelStatus: PixelStatus;
}

interface PlotPreviewCardState {
  showGrid: boolean;
}

const styles: StyleRulesCallback = theme => ({
  imgContainer: {
    position: 'relative',
    display: 'inline-block',
    transition: 'transform 150ms ease-in-out',
  },
  imgStyle: {
    width: '100%',
    maxWidth: 300,
  },
  svgStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    maxWidth: 300,
  },
  unsoldPixelColor: {
    fill: 'rgba(255,255,255,0.3)'
  },
  soldPixelColor: {
    fill: 'rgba(0,0,0,0.3)'
  }
});

class PlotPreviewCard extends Component<PlotPreviewCardProps, PlotPreviewCardState> {
  imageRef;

  constructor(props, context) {
    super(props, context);
    this.state = {
      showGrid: false
    };
  }
  
  showGrid() {
    this.setState({ showGrid: true });
  }

  hideGrid() {
    this.setState({ showGrid: false });
  }

  getGridSvgElements(): Array<JSX.Element> {    
    const pixelsPerRow = this.props.w;
    const pixelsPerColumn = this.props.h;
    const pixelWidth = this.imageRef.clientWidth / pixelsPerRow;  
    const pixelHeight = this.imageRef.clientHeight / pixelsPerColumn;  

    const gridElements = new Array<JSX.Element>();

    for (let i = 0; i < pixelsPerRow; i++) {
      for (let j = 0; j < pixelsPerColumn; j++) {
        const pixelIsSold = this.props.pixelStatus.soldPixels[i * pixelsPerColumn + j];
        const pixelClass = (pixelIsSold) ? this.props.classes.soldPixelColor : this.props.classes.unsoldPixelColor;

        gridElements.push(
          <rect x={i * pixelWidth}
                y={j * pixelHeight} 
                width={pixelWidth} 
                height={pixelHeight} 
                className={pixelClass}
                key={i * pixelsPerColumn + j} />
        );
      }
    }

    return gridElements;
  }

  render() {
    let gridElements = new Array<JSX.Element>();
    if (this.state.showGrid) {
      gridElements = this.getGridSvgElements();
    }
    
    const hasSoldPixels = this.props.pixelStatus.soldPixelCount > 0;
    let caption = 'The darker pixels are pixels that have already been sold.';
    if (!hasSoldPixels) {
      caption = 'No portion of this plot has been sold.';
    }

    return (
      <Grid container justify="center">
        <div onMouseEnter={this.showGrid.bind(this)} onMouseLeave={this.hideGrid.bind(this)} className={this.props.classes.imgContainer}>
          <img ref={element => this.imageRef = element} 
               src={this.props.blobUrl}
               className={this.props.classes.imgStyle} />
          <svg className={this.props.classes.svgStyle} xmlns="http://www.w3.org/2000/svg">
            { (this.state.showGrid && hasSoldPixels) ? gridElements : null }
            <title>{caption}</title>
          </svg>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(PlotPreviewCard);

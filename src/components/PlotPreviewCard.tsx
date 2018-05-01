import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import Grid from 'material-ui/Grid';

export interface PlotPreviewCardProps extends WithStyles {
  blobUrl: string;
  w: number;
  h: number;
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
    '&:hover': {
      opacity: 0.3
    },
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
    color: "rgba(255,255,255,0.7)"
  },
  soldPixelColor: {
    color: "rgba(200,200,200,0.7)"
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
    this.setState({ showGrid: true});
  }

  hideGrid() {
    this.setState({ showGrid: false});
  }

  getGridSvgElements(): Array<JSX.Element> {    
    const unsoldColor = "rgba(255,255,255,0.7)";
    const soldColor = "rgba(200,200,200,0.7)";
    const pixelsPerRow = this.props.w;
    const pixelsPerColumn = this.props.h;
    const pixelWidth = this.imageRef.clientWidth / pixelsPerRow;  
    const pixelHeight = this.imageRef.clientHeight / pixelsPerColumn;  

    let gridElements = new Array<JSX.Element>();

    for (let i = 0; i < pixelsPerRow; i++) {
      for (let j = 0; j < pixelsPerColumn; j++) {
        const colorRand = Math.round(Math.random()); // TEMP
        const currentColor = (colorRand == 0) ? soldColor : unsoldColor;

        gridElements.push(
          <rect x={i*pixelWidth}
                y={j*pixelHeight} 
                width={pixelWidth} 
                height={pixelHeight} 
                fill={currentColor}
                key={i*pixelsPerColumn + j} />
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

    return (
      <Grid container justify="center">
        <div onMouseEnter={this.showGrid.bind(this)} onMouseLeave={this.hideGrid.bind(this)} className={this.props.classes.imgContainer}>
          <img ref={element => this.imageRef = element} 
               src={this.props.blobUrl}
               className={this.props.classes.imgStyle} />
          <svg className={this.props.classes.svgStyle} xmlns="http://www.w3.org/2000/svg">
            { (this.state.showGrid) ? gridElements : null }
            <title>The darker pixels are pixels that have already been sold.</title>
          </svg>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(PlotPreviewCard);
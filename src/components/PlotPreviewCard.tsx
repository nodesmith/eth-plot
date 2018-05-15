import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { PlotInfo, Rect } from '../models';

export interface PlotPreviewCardProps extends WithStyles {
  blobUrl: string;
  rect: Rect;
  holes: Array<Rect>;
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
  soldPixelColor: {
    fill: 'rgba(0,0,0,0.3)'
  }
});

class PlotPreviewCard extends React.Component<PlotPreviewCardProps, PlotPreviewCardState> {
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
    const pixelWidth = this.imageRef.clientWidth / this.props.rect.w;  
    const pixelHeight = this.imageRef.clientHeight / this.props.rect.h;  

    const gridElements = new Array<JSX.Element>();
       
    this.props.holes.forEach((hole: Rect, index: number) => {
      const holeX = (hole.x - this.props.rect.x) * pixelWidth;
      const holeY = (hole.y - this.props.rect.y) * pixelHeight;

      gridElements.push(
        <rect x={holeX}
              y={holeY} 
              width={hole.w * pixelWidth} 
              height={hole.h * pixelHeight} 
              className={this.props.classes.soldPixelColor}
              key={index} />
      );
    });

    return gridElements;
  }

  render() {
    let gridElements = new Array<JSX.Element>();
    if (this.state.showGrid) {
      gridElements = this.getGridSvgElements();
    }
    
    const hasSoldPixels = this.props.holes.length > 0;
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

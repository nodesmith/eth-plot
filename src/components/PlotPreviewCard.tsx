import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { Typography } from 'material-ui';

import { PlotInfo, Rect } from '../models';

const MAX_IMAGE_WIDTH = 250;
const MAX_IMAGE_HEIGHT = 400;

export interface PlotPreviewCardProps extends WithStyles {
  blobUrl: string;
  rect: Rect;
  holes: Array<Rect>;
  isNsfwImage: boolean;
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
  saleOverlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    maxWidth: MAX_IMAGE_WIDTH,
  },
  soldPixelColor: {
    fill: 'rgba(0,0,0,0.3)'
  }
});

class PlotPreviewCard extends React.Component<PlotPreviewCardProps, PlotPreviewCardState> {
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
    const imageDimensions = this.computeImageDimensions();
    const pixelWidth = imageDimensions[0] / this.props.rect.w;  
    const pixelHeight = imageDimensions[1] / this.props.rect.h;  

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

  /**
   * Returns an array of length 2, where the first entry represents the width the
   * image should be based on the underlying rect dimensions, and the 2nd entry
   * represents the height.
   * 
   * The width and height come from the original width and height of the underlying 
   * rect that this preview represents. The goal is to make the image as large as possible
   * while preserving the original aspect ratio of the image. 
   */
  computeImageDimensions(): number[] {
    const widthHeight: number[] = [];
    const w = this.props.rect.w;
    const h = this.props.rect.h;

    const widthLargerThanHeight = (w > h);
    const widthToHeightAspectRatio = (w / h);
    const bothDimensionsMaxed = (w >= MAX_IMAGE_WIDTH && h >= MAX_IMAGE_HEIGHT);

    if (widthLargerThanHeight || (MAX_IMAGE_HEIGHT * widthToHeightAspectRatio) > MAX_IMAGE_WIDTH) {
      widthHeight[0] = MAX_IMAGE_WIDTH;
      widthHeight[1] = MAX_IMAGE_WIDTH / widthToHeightAspectRatio;
    } else {
      widthHeight[1] = MAX_IMAGE_HEIGHT;
      widthHeight[0] = MAX_IMAGE_HEIGHT * widthToHeightAspectRatio;
    }

    return widthHeight;
  }

  render() {
    let gridElements = new Array<JSX.Element>();
    if (this.state.showGrid && !this.props.isNsfwImage) {
      gridElements = this.getGridSvgElements();
    }
    
    const hasSoldPixels = this.props.holes.length > 0;
    let caption = 'The darker pixels are pixels that have already been sold.';
    if (!hasSoldPixels) {
      caption = 'No portion of this plot has been sold.';
    }

    const imageDimensions = this.computeImageDimensions();

    const imgStyle: React.CSSProperties = {
      width: imageDimensions[0],
      height: imageDimensions[1],
    };

    const nsfwOverlayStyle: React.CSSProperties = {
      width: imageDimensions[0],
      height: imageDimensions[1],
      backgroundColor: '#efefef',
      border: '1px solid black',
      padding: 10,
      overflow: 'hidden' 
    };

    //            <img ref={element => this.imageRef = element} src={this.props.blobUrl} style={imgStyle} />

    return (
      <Grid container justify="center">
        <div onMouseEnter={this.showGrid.bind(this)} onMouseLeave={this.hideGrid.bind(this)} className={this.props.classes.imgContainer}>
          { (this.props.isNsfwImage) ?
            <div style={nsfwOverlayStyle}>
              <Typography variant="body1" color="error">
                This image has been flagged as inappropriate. Please see the About section for details.
              </Typography>
            </div>
            :     
            <svg style={imgStyle}>
              <image style={imgStyle} xlinkHref={this.props.blobUrl} preserveAspectRatio="none" />
            </svg>
          }
          <svg className={this.props.classes.saleOverlayStyle} xmlns="http://www.w3.org/2000/svg">
            { (this.state.showGrid && hasSoldPixels) ? gridElements : null }
            <title>{caption}</title>
          </svg>
        </div>
      </Grid >
    );
  }
}

export default withStyles(styles)(PlotPreviewCard);

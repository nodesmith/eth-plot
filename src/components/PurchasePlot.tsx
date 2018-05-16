import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as React from 'react';

import { MovementActions } from '../constants/Enums';
import { Rect } from '../models';

const styles: StyleRulesCallback = theme => ({
  wrapper: {
    position: 'absolute',
    pointerEvents: 'auto'
  }
});

const IMAGE_BORDER_WIDTH = 2;

export interface PurchasePlotProps extends WithStyles {
  rect: Rect;
  scale: number;
  startAction: (x: number, y: number, movement: MovementActions) => void;
  src: string;
}

class PurchasePlot extends React.Component<PurchasePlotProps> {
  onDragStart(movement, e) {
    e.preventDefault();

    const scale = this.props.scale;
    const x = (e.clientX - e.target.parentElement.parentElement.getBoundingClientRect().x) / scale;
    const y = (e.clientY - e.target.parentElement.parentElement.getBoundingClientRect().y) / scale;

    e.stopPropagation();

    this.props.startAction(x, y, movement);
  }

  render() {
    const rect = this.props.rect;
    const scale = this.props.scale;
    const plotStyle: React.CSSProperties = {
      top: 0,
      left: 0,
      width: rect.w * scale,
      height: rect.h * scale,
      position: 'absolute',
      cursor: 'move',
      borderWidth: IMAGE_BORDER_WIDTH,
      borderColor: 'white',
      borderStyle: 'dashed'
    };

    const wrapperStyle: React.CSSProperties = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale
    };

    const handleWidth = 10;
    const leftStyle: React.CSSProperties = {
      top: 0,
      left: 0 - (handleWidth * .5),
      width: handleWidth,
      height: rect.h * scale,
      position: 'absolute',
      cursor: 'ew-resize'
    };

    const rightStyle: React.CSSProperties = Object.assign({}, leftStyle, {
      left: (rect.w * scale) - (handleWidth * .5)
    });

    const topStyle: React.CSSProperties = {
      top: 0 - (handleWidth * .5),
      left: 0,
      width: rect.w * scale,
      height: handleWidth,
      position: 'absolute',
      cursor: 'ns-resize'
    };

    const bottomStyle: React.CSSProperties = Object.assign({}, topStyle, {
      top: (rect.h * scale) - (handleWidth * .5)
    });

    const upperLeftStyle: React.CSSProperties = {
      top: -handleWidth,
      left: -handleWidth,
      width: handleWidth * 2,
      height: handleWidth * 2,
      position: 'absolute',
      cursor: 'nwse-resize'
    };

    const upperRightStyle: React.CSSProperties = Object.assign({}, upperLeftStyle, {
      left: (rect.w * scale) - handleWidth,
      cursor: 'nesw-resize'
    });

    const lowerRightStyle: React.CSSProperties = Object.assign({}, upperLeftStyle, {
      left: (rect.w * scale) - handleWidth,
      top: (rect.h * scale) - handleWidth
    });

    const lowerLeftStyle: React.CSSProperties = Object.assign({}, upperLeftStyle, {
      top: (rect.h * scale) - handleWidth,
      cursor: 'nesw-resize'
    });

    const imageBackgroundStyle: React.CSSProperties = {
      height: (rect.h * scale) - 2 * IMAGE_BORDER_WIDTH,
      width: (rect.w * scale) - 2 * IMAGE_BORDER_WIDTH
    };

    const controlItems: Array<{movement: MovementActions; style: React.CSSProperties; className: string; }> = [
      { movement: MovementActions.TOP, style: topStyle, className: 'handle' },
      { movement: MovementActions.LEFT, style: leftStyle, className: 'handle' },
      { movement: MovementActions.BOTTOM, style: bottomStyle, className: 'handle' },
      { movement: MovementActions.RIGHT, style: rightStyle, className: 'handle' },
      { movement: MovementActions.UPPER_LEFT, style: upperLeftStyle, className: 'handle' },
      { movement: MovementActions.LOWER_LEFT, style: lowerLeftStyle, className: 'handle' },
      { movement: MovementActions.LOWER_RIGHT, style: lowerRightStyle, className: 'handle' },
      { movement: MovementActions.UPPER_RIGHT, style: upperRightStyle, className: 'handle' },
    ];

    const controls = controlItems.map((item) => {
      return (<div
        draggable={true}
        key={item.movement}
        style={item.style} 
        className={item.className}
        onDragStart={this.onDragStart.bind(this, item.movement)}
      >
      
      </div>);
    });

    return (
      <div className={this.props.classes.wrapper} draggable={false} style={wrapperStyle}>
        <div
          draggable={true}
          key={MovementActions.DRAG}
          style={plotStyle} 
          className="purchasePlot"
          onDragStart={this.onDragStart.bind(this, MovementActions.DRAG)}
        >
          <svg style={imageBackgroundStyle}>
            <image style={imageBackgroundStyle} xlinkHref={this.props.src} preserveAspectRatio="none" />
          </svg>
        </div>
    {controls}
      </div >
    );
  }
}

export default withStyles(styles)(PurchasePlot);
  

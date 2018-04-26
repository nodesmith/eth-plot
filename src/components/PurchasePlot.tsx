import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';

import { MovementActions } from '../constants/Enums';
import { Rect } from '../models';

const styles: StyleRulesCallback = theme => ({
  purchaseTooltip: {
    backgroundColor: 'rgba($color: #000000, $alpha: 0.6)',
    borderRadius: 5,
    display: 'inline',
    color: 'white',
    lineHeight: 35,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    paddingLeft: '10',
    paddingRight: '10',
    whiteSpace: 'nowrap'
  }
});

export interface PurchasePlotProps extends WithStyles {
  rect: Rect;
  scale: number;
  startAction: (x: number, y: number, movement: MovementActions) => void;
  src: string;
}

class PurchasePlot extends Component<PurchasePlotProps> {

  overlayMouseDown(movement, e) {
    const scale = this.props.scale;
    const x = (e.clientX - e.target.parentElement.parentElement.getBoundingClientRect().x) / scale;
    const y = (e.clientY - e.target.parentElement.parentElement.getBoundingClientRect().y) / scale;

    e.stopPropagation();

    this.props.startAction(x, y, movement);
  }

  overlayMouseMove(movement, e) {

  }

  overlayMouseUp(e) {
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
      backgroundImage: `url(${this.props.src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%'
    };

    const wrapperStyle: React.CSSProperties = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale,
      position: 'absolute',
      pointerEvents: 'auto',
      userDrag: 'none'
    };

    const tooltipStyle = {
      top: -40
    }

    const handleWidth = 10;
    const leftStyle: React.CSSProperties = {
      top: 0,
      left: 0 - (handleWidth * .5),
      width: handleWidth,
      height: rect.h * scale,
      position: 'absolute',
      cursor: 'ew-resize'
    }

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
    })

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

    const controlItems: Array<{movement: MovementActions; style: React.CSSProperties; className: string; }> = [
      { movement: MovementActions.DRAG, style: plotStyle, className: 'purchasePlot' },
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
        key={item.movement}
        style={item.style} 
        className={item.className}
        onMouseDown={this.overlayMouseDown.bind(this, item.movement)}
        onMouseMove={this.overlayMouseMove.bind(this, item.movement)}
        onMouseUp={this.overlayMouseUp.bind(this, item.movement)}
      ></div>);
    })

    const tooltipText = `${rect.w} x ${rect.h}`;

    return (
      <div draggable={false} style={wrapperStyle}>
        {controls}
        <div className='purchaseTooltip' style={tooltipStyle}>
          <span>{tooltipText}</span>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PurchasePlot);

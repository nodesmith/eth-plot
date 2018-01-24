import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MovementActions } from '../constants/Enums';

export default class PurchasePlot extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      currentAction: MovementActions.NONE
    }
  }

  overlayMouseDown(movement, e) {
    const scale = this.props.scale;
    const x = (e.clientX - this.rootElement.parentElement.getBoundingClientRect().x) / scale;
    const y = (e.clientY - this.rootElement.parentElement.getBoundingClientRect().y) / scale;
    this.setState({
      actionStart: {x, y},
      currentAction: movement
    });

    // e.stopPropagation();

    this.props.startAction(x, y, movement);
  }

  overlayMouseMove(movement, e) {

    // const scale = this.props.scale;
    // const x = (e.clientX - this.rootElement.parentElement.getBoundingClientRect().x) / scale;
    // const y = (e.clientY - this.rootElement.parentElement.getBoundingClientRect().y) / scale;

    // const deltaX = x - this.state.actionStart.x;
    // const deltaY = y - this.state.actionStart.y;

    // let rect = Object.assign({}, this.props.rect);
    // switch(movement) {
    //   case MovementActions.DRAG:
    //     rect.x += deltaX;
    //     rect.y += deltaX;
    //     rect.x2 += deltaX;
    //     rect.y2 += deltaY;
    //     break;
    //   case MovementActions.TOP:
    //     rect.y += deltaY;
    //     break;
      
    // }

    // rect.w = rect.x2 - rect.x;
    // rect.h = rect.y2 - rect.y;

    // // console.log(rect);

    // // this.props.actions.resizeDraggingRect(Math.round(x / scale), Math.round(y / scale));
    // // e.stopPropagation();
  }

  overlayMouseUp(e) {
    // this.props.actions.stopDraggingRect();
    // e.stopPropagation();
  }

  render() {
    const rect = this.props.rect;
    const scale = this.props.scale;
    const plotStyle = {
      top: 0,
      left: 0,
      width: rect.w * scale,
      height: rect.h * scale,
      position: 'absolute',
      cursor: 'move'
    };

    const wrapperStyle = {
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
    const leftStyle = {
      top: 0,
      left: 0 - (handleWidth * .5),
      width: handleWidth,
      height: rect.h * scale,
      position: 'absolute',
      cursor: 'ew-resize'
    }

    const rightStyle = Object.assign({}, leftStyle, {
      left: (rect.w * scale) - (handleWidth * .5)
    });

    const topStyle = {
      top: 0 - (handleWidth * .5),
      left: 0,
      width: rect.w * scale,
      height: handleWidth,
      position: 'absolute',
      cursor: 'ns-resize'
    };

    const bottomStyle = Object.assign({}, topStyle, {
      top: (rect.h * scale) - (handleWidth * .5)
    })

    const upperLeftStyle = {
      top: -handleWidth,
      left: -handleWidth,
      width: handleWidth * 2,
      height: handleWidth * 2,
      position: 'absolute',
      cursor: 'nwse-resize'
    };

    const upperRightStyle = Object.assign({}, upperLeftStyle, {
      left: (rect.w * scale) - handleWidth,
      cursor: 'nesw-resize'
    });

    const lowerRightStyle = Object.assign({}, upperLeftStyle, {
      left: (rect.w * scale) - handleWidth,
      top: (rect.h * scale) - handleWidth
    });

    const lowerLeftStyle = Object.assign({}, upperLeftStyle, {
      top: (rect.h * scale) - handleWidth,
      cursor: 'nesw-resize'
    });

    const controlItems = [
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
      <div draggable={false} ref={(ref => this.rootElement = ref)} style={wrapperStyle} >
        {controls}
        <div className='purchaseTooltip' style={tooltipStyle}>
          <span>{tooltipText}</span>
        </div>
      </div>
    );
  }
}

PurchasePlot.propTypes = {
  rect: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired,
  startAction: PropTypes.func.isRequired
};
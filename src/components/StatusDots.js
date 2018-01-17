import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StatusDots extends Component {

  createItem(label, index, isSelected) {
    const wrapperStyle = {
      height: '24px',
      width: '24px',
      position: 'relative'
    };

    const dotSyle = {
      height: '24px',
      width: '24px',
      borderRadius: '12px',
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: '2px'
    };

    if (isSelected) {
      dotSyle.backgroundColor = 'gray';
    }

    const labelStyle = {
      position: 'absolute',
      width: '200px',
      textAlign: 'center',
      top: '27px',
      left: '50%',
      marginLeft: '-100px'
    }

    return (
      <div style={wrapperStyle} key={index} className='dotContainer'>
        <div style={dotSyle} />
        <div style={labelStyle}>
          <h5>{label}</h5>
        </div>
      </div>
    )
  }

  createDivider(index) {
    const wrapperStyle = {
      height: '8px',
      marginTop: '8px',
      borderColor: 'black',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderLeft: 'none',
      borderRight: 'none',
      position: 'relative',
      flexGrow: 1
    };

    return (
      <div style={wrapperStyle} key={index + ' divider'}>
      </div>
    )
  }

  render() {
    const items = this.props.items.map((val, index) => this.createItem(val, index, index === this.props.currentIndex));
    const itemsWithDividers = items.reduce((result, val, index, self) => {
      result.push(val);
      if (index != self.length - 1) {
        result.push(this.createDivider(index));
      }

      return result;
    }, []);

    const wrapperStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      height: '55px'
    };

    return (
    <div style={wrapperStyle} className='dotWrapper'>
      {itemsWithDividers}
    </div>);
  }
}

StatusDots.propTypes = {
  items: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import ButtonBase from 'material-ui/ButtonBase';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider/Divider';

import Icon from 'material-ui/Icon';

const size = 30;
const styles = theme => ({
  root: {
    width: size
  },
  button: {
    height: size,
    width: size,
    backgroundColor: theme.palette.grey[200]
  }
});


class ZoomControl extends Component {

  zoomIn() {
    this.props.changeZoom(+1);
  }

  zoomOut() {
    this.props.changeZoom(-1);
  }

  render() {
    const { classes } = this.props;
    return (

      <div className={classes.root}>
        <ButtonBase focusRipple key='plus' className={classes.button} onClick={this.zoomIn.bind(this)}>
          <Icon>add</Icon>
        </ButtonBase>
        <Divider />
        <ButtonBase focusRipple key='minus' className={classes.button} onClick={this.zoomOut.bind(this)}>
          <Icon>remove</Icon>
        </ButtonBase>
      </div>);
  }
}

ZoomControl.propTypes = {
  scale: PropTypes.number.isRequired,
  changeZoom: PropTypes.func.isRequired
}

export default withStyles(styles)(ZoomControl);
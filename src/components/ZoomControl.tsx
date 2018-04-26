import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import ButtonBase from 'material-ui/ButtonBase';
import Divider from 'material-ui/Divider/Divider';
import Typography from 'material-ui/Typography';

import Add from 'material-ui-icons/Add';
import Remove from 'material-ui-icons/Remove';

const size = 30;
const styles: StyleRulesCallback = theme => ({
  root: {
    width: size
  },
  button: {
    height: size,
    width: size,
    backgroundColor: theme.palette.grey[200]
  }
});

export interface ZoomControlProps extends WithStyles {
  scale: number;
  changeZoom: (direction: number) => void;
}


class ZoomControl extends Component<ZoomControlProps> {

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
        <ButtonBase focusRipple key="plus" className={classes.button} onClick={this.zoomIn.bind(this)}>
          <Add />
        </ButtonBase>
        <Divider />
        <ButtonBase focusRipple key="minus" className={classes.button} onClick={this.zoomOut.bind(this)}>
          <Remove />
        </ButtonBase>
      </div>);
  }
}

export const ZoomControlComponent = withStyles(styles, { name: 'ZoomControl' })(ZoomControl);

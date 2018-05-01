import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import ButtonBase from 'material-ui/ButtonBase';
import Paper from 'material-ui/Paper';

const styles: StyleRulesCallback = theme => ({
  root: {
  },
  button: {
    margin: 0,
    backgroundColor: theme.palette.grey[200]
  }
});

export interface FloatingLogoProps extends WithStyles {
  onClick: () => void;
  size: number;
}


class FloatingLogo extends Component<FloatingLogoProps> {

  render() {
    const sizeStyle: React.CSSProperties = {
      height: this.props.size,
      width: this.props.size
    };

    const { classes } = this.props;
    return (
      <Paper className={classes.root} style={sizeStyle}>
        <ButtonBase focusRipple className={classes.button} style={sizeStyle} onClick={this.props.onClick}>
          <img src="./ethgridlogo.svg" style={sizeStyle}/>
        </ButtonBase>
      </Paper>
    );
  }
}

export default withStyles(styles, { name: 'ZoomControl' })(FloatingLogo);

import { Typography } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import ButtonBase from 'material-ui/ButtonBase';
import Paper from 'material-ui/Paper';
import * as React from 'react';

import * as Enums from '../constants/Enums';

const styles: StyleRulesCallback = theme => ({
  root: {}, // Intentionally Empty
  button: {
    margin: 0,
    backgroundColor: theme.palette.grey[200]
  },
  networkOverlay: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'orange',
    fontSize: '0.6em',
    padding: '2px'
  }
});

export interface FloatingLogoProps extends WithStyles {
  onClick: () => void;
  size: number;
  networkName: Enums.NetworkName;
}


class FloatingLogo extends React.Component<FloatingLogoProps> {

  render() {
    const sizeStyle: React.CSSProperties = {
      height: this.props.size,
      width: this.props.size
    };

    const { classes, networkName } = this.props;
    return (
      <Paper className={classes.root} style={sizeStyle}>
        <ButtonBase focusRipple className={classes.button} style={sizeStyle} onClick={this.props.onClick}>
          <img src="./ethgridlogo.svg" style={sizeStyle}/>
          { networkName !== Enums.NetworkName.Main && networkName !== Enums.NetworkName.Unknown && 
            <Typography variant="button" className={classes.networkOverlay}>{networkName}</Typography>
          }
        </ButtonBase>
      </Paper>
    );
  }
}

export default withStyles(styles, { name: 'ZoomControl' })(FloatingLogo);

import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography/Typography';

const styles: StyleRulesCallback = theme => ({
  container: {
    paddingTop: 30,
    textAlign: "center"
  }
});


export interface FullPageStatusProps extends WithStyles {
  message: string;
};


class FullPageStatus extends Component<FullPageStatusProps> {
  render() {
    return (
      <div className={this.props.classes.container} >
        <Typography gutterBottom variant='subheading'>
          {this.props.message}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(FullPageStatus);
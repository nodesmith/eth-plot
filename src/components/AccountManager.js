import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';

import * as Enums from '../constants/Enums';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    paddingBottom: 30
  }
});

class AccountManager extends Component {
  getUserContent() {
    const plotInfos = this.props.userPlots.map((plot, index) => {
      return (
        <Grid item xs={12}>
          <Paper>
            <PlotInfo info={plot} key={index} updatePrice={this.props.updatePrice} />
          </Paper>
        </Grid>
      );
    });

    if (plotInfos.length == 0) {
      plotInfos.push(
        <Grid item xs={12} >
          <Typography type="subheading">You don't have any owned plots. Visit the grid to purchase a plot.</Typography>
        </Grid>
      )
    }

    return [
      (<Grid item xs={8}>
        <Typography type='title'>My Content</Typography>
      </Grid>),
      plotInfos
    ]
  }

  render() {
    const content = this.getUserContent();

    return (
      <Grid container className={this.props.classes.root} justify="center" >
        <Grid item xs={9} >
          <Grid container spacing={24} >
            {content}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AccountManager.propTypes = {
  userPlots: PropTypes.array.isRequired,
  updatePrice: PropTypes.func.isRequired,
};

export default withStyles(styles)(AccountManager);
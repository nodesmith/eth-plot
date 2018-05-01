import { Typography } from 'material-ui';
import ExpandMore from 'material-ui-icons/ExpandMore';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import FAQ from './FAQ';

const styles: StyleRulesCallback = theme => ({
  root: {
    marginTop: 16,
    paddingBottom: 16
  }
});

const questionsAndAnswers = [
  { question: 'What is Eth Grid?', answer: 'Coolest thing since sliced bread.' },
  { question: 'Why would I use this?', answer: 'To be part of hethstory.' },
  { question: 'Are there fees?', answer: 'Minor, to keep the lights on.  You can interact directly with our contracts though.' }
];

export interface AboutProps extends WithStyles {

}

class About extends Component<AboutProps> {
  render() {
    const items = questionsAndAnswers.map((qa, index) => (<FAQ {...this.props} key={index} {...qa} />));
    return (
        <Grid className={this.props.classes.root} container justify="center" spacing={24} >
          <Grid item xs={9} >
            <Typography align="center" variant="headline">About</Typography>
          </Grid>
          <Grid item xs={9} >
            {items}
          </Grid>
        </Grid>
    );
  }
}

export default withStyles(styles)(About);

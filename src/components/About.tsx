import { Typography } from 'material-ui';
import ExpandMore from 'material-ui-icons/ExpandMore';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import FAQGroup from './FAQGroup';

const styles: StyleRulesCallback = theme => ({
  root: {
    paddingTop: 24,
    paddingBottom: 16
  },
  main: {
    padding: 20
  }
});

const faqGroups = [
  { 
    title: "General",
    questions: [
      'What is Eth Grid?',
      'Why would I use this?'
    ],
    answers: [
      'Coolest thing since sliced bread.',
      'Because eth grid is cool.'
    ]
  },
  { 
    title: "Gameplay",
    questions: [
      'How do I purchase a plot?',
      'How do I sell a plot?'
    ],
    answers: [
      'Coolest thing since sliced bread.',
      'Because eth grid is cool.'
    ]
  },
];

export interface AboutProps extends WithStyles {

}

class About extends Component<AboutProps> {
  render() {
    const items = faqGroups.map((g, index) =>
      <FAQGroup questions={g.questions} answers={g.answers} groupTitle={g.title} classes={{}} key={index}/> 
    );

    return (
      <Grid className={this.props.classes.root} container justify="center" spacing={24} >
        <Grid item xs={9} >
          <Typography align="center" variant="headline">About Eth Grid</Typography>
        </Grid>
        <Grid item xs={9} >
          {items}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(About);

import { Typography } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import * as React from 'react';

import * as FAQAnswers from './FAQAnswers';
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
    title: 'Getting Started',
    questions: [
      'What is Eth Plot?',
      'What do I need to start using Eth Plot?',
      'Installing Metamask and funding your wallet',
      'Why did we build Eth Plot?'
    ],
    answers: [
      FAQAnswers.gettingStartedAnswer1(),
      FAQAnswers.gettingStartedAnswer2(),
      FAQAnswers.gettingStartedAnswer3(),
      FAQAnswers.gettingStartedAnswer4(),
    ]
  },
  { 
    title: 'Gameplay Mechanics',
    questions: [
      'How do I purchase a plot?',
      'How does selling a plot work?',
      'How do I change the price of my plot?',
      'Are there fees?'
    ],
    answers: [
      FAQAnswers.gameplayAnswer1(),
      FAQAnswers.gameplayAnswer2(),
      FAQAnswers.gameplayAnswer3(),
      FAQAnswers.gameplayAnswer4(),
    ]
  },
  { 
    title: 'Technical Details',
    questions: [
      'How does Eth Plot work?',
      'Can I see the smart contract?',
      'Is there a version running on the test net?'
    ],
    answers: [
      FAQAnswers.techDetailsAnswer1(),
      FAQAnswers.techDetailsAnswer2(),
      FAQAnswers.techDetailsAnswer3(),
    ]
  },
];

export interface AboutProps extends WithStyles {

}

class About extends React.Component<AboutProps> {
  render() {
    const items = faqGroups.map((g, index) =>
      <FAQGroup questions={g.questions} answers={g.answers} groupTitle={g.title} classes={{}} key={index}/> 
    );

    return (
      <Grid className={this.props.classes.root} container justify="center" spacing={24} >
        <Grid item xs={12} >
          <Typography align="center" variant="headline">About Eth Plot</Typography>
        </Grid>
        <Grid item xs={8} md={6} >
          {items}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(About);

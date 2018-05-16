import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import * as React from 'react';

import FAQ from './FAQ';

export interface FAQGroupProps extends WithStyles {
  questions: Array<string>;
  answers: Array<JSX.Element>;
  groupTitle: string;
}

const styles: StyleRulesCallback = theme => ({
  faqGroup: {
    marginBottom: 48
  },
  title: {
    fontSize: '1.5em',
    paddingBottom: 8,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1.5px',
    borderBottomColor: 'rgba(0,0,0,0.3)'
  }
});

class FAQGroup extends React.Component<FAQGroupProps> {
  render() {
    if (this.props.questions.length !== this.props.answers.length) {
      throw 'FAQGroup requires same number of questions as answers.';
    }

    const items = this.props.questions.map(
      (question, index) => (<FAQ question={question} answer={this.props.answers[index]} classes={{}} key={index} />)
    );

    return (
      <div className={this.props.classes.faqGroup} >
        <Typography variant="display1" className={this.props.classes.title}>{this.props.groupTitle}</Typography>
        {items}
      </div>
    );
  }
}

export default withStyles(styles)(FAQGroup);

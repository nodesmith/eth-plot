import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import ExpandMore from 'material-ui-icons/ExpandMore';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';

export interface FAQProps extends WithStyles {
  question: string;
  answer: JSX.Element;
}

const styles: StyleRulesCallback = theme => ({
  wrapper: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1.5px',
    borderBottomColor: 'rgba(0,0,0,0.3)'
  },
  question: {
    paddingLeft: 0,
    paddingTop: 16,
    paddingBottom: 16
  },
  answer: {
    paddingLeft: 0,
    paddingBottom: 40,
    paddingTop: 0
  }
});

class FAQ extends Component<FAQProps> {
  render() {
    return (
    <ExpansionPanel className={this.props.classes.wrapper} key={this.props.question}>
      <ExpansionPanelSummary className={this.props.classes.question} expandIcon={<ExpandMore />}>
        <Typography variant="subheading">{ this.props.question }</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={this.props.classes.answer}>
        { this.props.answer }
      </ExpansionPanelDetails>
    </ExpansionPanel>);
  }
}

export default withStyles(styles)(FAQ);

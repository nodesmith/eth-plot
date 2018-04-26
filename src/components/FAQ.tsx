import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

const styles: StyleRulesCallback = theme => ({
});

export interface FAQProps extends WithStyles {
  question: string;
  answer: string;
}

class FAQ extends Component<FAQProps> {
  render() {
    return (
    <ExpansionPanel key={this.props.question}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant='subheading'>{ this.props.question }</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
        { this.props.answer }
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>);
  }
}

export default withStyles(styles)(FAQ);

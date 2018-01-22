import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

class FAQ extends Component { 
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    return (
    <ExpansionPanel key={this.props.question}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography type='subheading'>{ this.props.question }</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
        { this.props.answer }
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>);
  }
}

FAQ.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired  
};

export default FAQ;
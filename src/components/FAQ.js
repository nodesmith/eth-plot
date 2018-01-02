import React, { Component } from 'react';
import { Button, Collapse, Well } from 'react-bootstrap';

class FAQ extends Component { 
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    return (
      <div className="faqContainer">
        <div role="button">
          <h4 onClick={() => this.setState({ open: !this.state.open })}> { this.props.question } </h4>
        </div>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              { this.props.answer }
            </Well>
          </div>
        </Collapse>
      </div>  
    );
  }
}

FAQ.propTypes = {
  question: React.PropTypes.string.isRequired,
  answer: React.PropTypes.string.isRequired  
};

export default FAQ;
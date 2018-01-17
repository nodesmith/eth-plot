import React, { Component } from 'react';
import { Button, Collapse, Well } from 'react-bootstrap';
import PropTypes from 'prop-types';

class FAQ extends Component { 
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div role="button">
          <hr />
          <h4 onClick={() => this.setState({ open: !this.state.open })}> 
          { this.state.open 
          ? <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
          : <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span> }
          { this.props.question } </h4>
        </div>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              <div className="wellPadding">
                { this.props.answer }
              </div>
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
}

FAQ.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired  
};

export default FAQ;
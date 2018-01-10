import React, { Component } from 'react';
import { 
  Button,
  Col,
  Grid,
  Row
} from 'react-bootstrap';

import FAQ from './FAQ';

export default class About extends Component {
  render() {
    return (
      <div className="about-section">
        <Grid>
          <Row className="show-grid">
            <Col xs={2} />
            <Col xs={8}>
              <FAQ question={ "What is Eth Grid?"} answer = { "Coolest thing since sliced bread."} />
              <FAQ question={ "Why would I use this?"} answer = { "To be part of hethstory."} />
              <FAQ question={ "Are there fees?"} answer = { "Minor, to keep the lights on.  You can interact directly with our contracts though."} />
              <hr />
            </Col>
            <Col xs={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}

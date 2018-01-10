import React, { Component, PropTypes } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import RectImage from './RectImage';

export default class PurchaseModal extends Component {
  close() {
    this.props.closeDialog();
  }

  buyIt() {
    this.props.actions.purchasePlot(
      this.props.contractInfo,
      this.props.plots,
      this.props.rectToPurchase,
      'http://woo.com',
      'abc123');
  }

  render() {
    const baseRect = { x: 0, y: 0, w: 250, h: 250, color: 'red' };
    const subRects = [Object.assign({}, this.props.rectToPurchase, { color: 'blue' })];
    const imageStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%'
    };

    return (
      <Modal show={this.props.isVisible} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Purchase Plot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className='modalRow'>
              <Col xs={2} style={imageStyle} >
                <RectImage baseRect={baseRect} subRects={subRects} height={60} width={60} />
              </Col>
              <Col xs={10} style={imageStyle} >
                <div>
                  <span>Number 1</span>
                  <br />
                  <span>Second Number</span>
                </div>
              </Col>
            </Row>
            
            <Button onClick={this.buyIt.bind(this)}>Yeah</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

PurchaseModal.propTypes = {
  rectToPurchase: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired
};
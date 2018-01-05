import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class PurchaseModal extends Component {
  close() {
    this.props.closeDialog();
  }

  render() {
    return (
      <Modal show={this.props.isVisible} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Purchase Plot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>You wanna buy this?</h4>
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
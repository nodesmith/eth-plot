import React, { Component, PropTypes } from 'react';
import { Button, ControlLabel, DropdownButton, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, PageHeader, Row, Col, Glyphicon } from 'react-bootstrap';
import RectImage from './RectImage';
import PlotPurchaseForm from './PlotPurchaseForm';

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
    const baseRect = { x: 0, y: 0, w: 250, h: 250, color: 'hsl(0, 0%, 90%)' };
    const subRects = [Object.assign({}, this.props.rectToPurchase, { color: 'hsl(0, 0%, 40%)' })];
    const imageStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%'
    };

    const imageHeight = 140;

    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    const purchasePreviewBaseRect = this.props.rectToPurchase;
    const colors = this.props.purchaseInfo.chunksToPurchaseAreaIndices.reduce((result, chunkIndex) => {
      result[chunkIndex] = getRandomColor();
      return result;
    }, {});



    const purchasePreviewSubRects = this.props.purchaseInfo.chunksToPurchase.map((chunk, index) => {
      return Object.assign({}, chunk, {color: colors[this.props.purchaseInfo.chunksToPurchaseAreaIndices[index]]});
    });

    const purchaseAspectRatio = purchasePreviewBaseRect.h / purchasePreviewBaseRect.w;
    let purchasePreviewImageWidth = imageHeight;
    let purchasePreviewImageHeight = imageHeight;
    if (purchaseAspectRatio > 1) {
      purchasePreviewImageWidth = imageHeight / purchaseAspectRatio;
    } else {
      purchasePreviewImageHeight = imageHeight * purchaseAspectRatio;
    }

    const coordinatesMessage = `x: ${this.props.rectToPurchase.x}, y: ${this.props.rectToPurchase.y}, w: ${this.props.rectToPurchase.w}, h: ${this.props.rectToPurchase.h}`;
    const purchasingMessage = `${this.props.rectToPurchase.w * this.props.rectToPurchase.h} pixels from ${Object.keys(colors).length} plots`;

    return (
      <Modal show={this.props.isVisible} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Purchase for {this.props.purchaseInfo.purchasePrice} eth</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PlotPurchaseForm rectToPurchase={this.props.rectToPurchase} />
{/*             
            <Row>
            <Col sm={4} style={imageStyle} >
              <RectImage baseRect={baseRect} subRects={subRects} height={imageHeight} width={imageHeight} />
              <div className='rectImageCaption'>
                <span>{coordinatesMessage}</span>
              </div>
            </Col>
            <Col sm={4} style={imageStyle} >
              <RectImage baseRect={purchasePreviewBaseRect} subRects={purchasePreviewSubRects} height={purchasePreviewImageHeight} width={purchasePreviewImageWidth} />
              <div className='rectImageCaption'>
                <span>{purchasingMessage}</span>
              </div>
            </Col>
            <Col sm={4} style={imageStyle} >
              <RectImage baseRect={purchasePreviewBaseRect} subRects={purchasePreviewSubRects} height={purchasePreviewImageHeight} width={purchasePreviewImageWidth} />
              <div className='rectImageCaption'>
                <span>{purchasingMessage}</span>
              </div>
            </Col>
            </Row> */}
          </Modal.Body>
          <Modal.Footer>
            {/* <Button onClick={this.close.bind(this)}>Cancel</Button> */}
            <Button style={{width: '100%'}} bsStyle='primary' onClick={this.buyIt.bind(this)}>Next: Choose Image</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

PurchaseModal.propTypes = {
  rectToPurchase: PropTypes.object.isRequired,
  purchaseInfo: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired
};
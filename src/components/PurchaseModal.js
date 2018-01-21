import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Thumbnail, ControlLabel, DropdownButton, Image, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, Pager, PageHeader, Row, Col, Glyphicon, Panel } from 'react-bootstrap';
import RectImage, {SVGRectImageBuilder} from './RectImage';
import Decimal from 'decimal.js';

import { formatEthValue } from '../data/ValueFormatters';
import ChooseImageInputBox from './PurchaseDialog/ChooseImageInputBox';
import WebsiteInputBox from './PurchaseDialog/WebsiteInputBox';
import BuyoutPriceInputBox from './PurchaseDialog/BuyoutPriceInputBox';

export default class PurchaseModal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      image: {
        valid: false
      },
      website: {
        valid: false
      },
      buyout: {
        valid: false
      }
    };
  }

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

  computeInitialBuyout() {
    const purchasePrice = Decimal(this.props.purchaseInfo.purchasePrice);
    const purchaseMultiplier = 3;
    const newPurchasePriceInWei = purchasePrice.times(purchaseMultiplier);

    // TODO
    return {
      units: 'wei',
      ammountInWei: newPurchasePriceInWei.toFixed()
    };
  }

  inputChanged(inputType, value) {
    this.setState({
      [inputType]: value
    });
  }

  getLocationSvg() {
    const imageHeight = 200;
    const baseRect = { x: 0, y: 0, w: 250, h: 250, color: 'hsl(0, 0%, 90%)' };
    const subRects = [Object.assign({}, this.props.rectToPurchase, { color: 'hsl(0, 0%, 40%)' })];

    const builder = new SVGRectImageBuilder(imageHeight, imageHeight, baseRect, subRects);
    return `data:image/svg+xml;base64,${btoa(builder.output())}`;
  }

  onImageSelected(imageData) {
    this.setState({imageData});
  }

  getInputPage() {

    const initialBuyoutPrice = this.computeInitialBuyout();
    let imageSvg = './assets/YourImageHere.svg';
    if (this.state.image.valid && this.state.image.value) {
      imageSvg = this.state.image.value;
    }

    const rectToPurchase = this.props.rectToPurchase;

    const imageHeight = 200;
    const purchaseAspectRatio = rectToPurchase.h / rectToPurchase.w;
    let purchasePreviewImageWidth = imageHeight;
    let purchasePreviewImageHeight = imageHeight;
    if (purchaseAspectRatio > 1) {
      purchasePreviewImageWidth = imageHeight / purchaseAspectRatio;
    } else {
      purchasePreviewImageHeight = imageHeight * purchaseAspectRatio;
    }

    return (
      <div className='modalDialog'>
        <Col xs={8} >
          <ChooseImageInputBox 
            onImageLoaded={this.onImageSelected.bind(this)}
            rectToPurchase={this.props.rectToPurchase}
            onImageChanged={this.inputChanged.bind(this, 'image')}/>

          <WebsiteInputBox
            onWebsiteChanged={this.inputChanged.bind(this, 'website')}/>
          
          <BuyoutPriceInputBox
            initialValue={initialBuyoutPrice}
            title='Set Initial Buyout Price (Optional)'
            rectToPurchase={this.props.rectToPurchase}
            purchasePrice={this.props.purchaseInfo.purchasePrice.toString()} 
            onBuyoutChanged={this.inputChanged.bind(this, 'buyout')}/>

        </Col>
        <Col xs={4} style={{textAlign: 'center', height: '100%'}}>
          <div style={{ height: '100%'}}>
            <Panel style={{ height: '100%'}}>
              <Panel.Heading style={{height: '41px'}}>
                Image Preview
              </Panel.Heading>
              <Panel.Body style={{display:'flex', height: 'calc(100% - 41px)', flexDirection: 'column', justifyContent: 'center'}}>
              <img style={{ outlineWidth: '2px', outlineColor: 'hsl(0, 0%, 40%)', outlineStyle: 'dashed', objectFit: 'fill', margin: 'auto' }}
                width={purchasePreviewImageWidth} height={purchasePreviewImageHeight} src={imageSvg} />
              {/* <Image style={{outlineWidth: '2px', outlineColor: 'hsl(0, 0%, 40%)', outlineStyle: 'dashed'}} src={imageSvg} /> */}
              </Panel.Body>
            </Panel>
          </div>
        </Col>
      </div>);
  }

  render() {
    let content, buttonMessage, buttonAction, title;
    content = this.getInputPage();
    buttonMessage = 'Purchase';
    title = `Purchase for ${this.props.purchaseInfo.purchasePrice} eth`;
    buttonAction = this.state.buyout.valid && this.state.website.valid && this.state.image.valid ? 
      () => this.setState({page: 1}) : undefined;

    const imageHeight = 30;
    const baseRect = { x: 0, y: 0, w: 250, h: 250, color: 'hsl(0, 0%, 90%)' };
    const subRects = [Object.assign({}, this.props.rectToPurchase, { color: 'hsl(0, 0%, 40%)' })];

    const builder = new SVGRectImageBuilder(imageHeight, imageHeight, baseRect, subRects);
    const previewImage = `data:image/svg+xml;base64,${btoa(builder.output())}`;

    return (
      <Modal bsSize='lg' show={this.props.isVisible} onHide={this.close.bind(this)}> 
        <Modal.Header closeButton>
          <div style={{display: 'flex'}}>
            <img src={previewImage} style={{outlineColor: 'hsl(0, 0%, 40%)', outlineWidth: '1px', outlineStyle:'solid'}} />
            <h2 style={{ margin: 0, marginLeft: '20px', lineHeight: '30px', display: 'inline'}}><span>Purchase Plot</span><span>{'   '}</span><small>52 eth</small></h2>
          </div>
        </Modal.Header> 
        <Modal.Body> 
          <Row>
          {content}
          </Row>
        </Modal.Body> 
        <Modal.Footer> 
          <Button style={{width: '100%'}} bsStyle='primary' disabled={!buttonAction} onClick={buttonAction}>{buttonMessage}</Button> 
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
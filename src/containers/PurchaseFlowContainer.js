import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Thumbnail, Col, Panel, Button, Grid, Jumbotron, Row, PageHeader, Image } from 'react-bootstrap';
import PurchaseModal from '../components/PurchaseModal';
import { SVGRectImageBuilder } from '../components/RectImage';
import StatusDots from '../components/StatusDots';

import ChooseImageInputBox from '../components/PurchaseDialog/ChooseImageInputBox';

export default class PurchaseFlowContainer extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      image: ''
    };
  }

  imageLoaded(image) {
    this.setState({
      image: image
    });
  }

  render() {
    const imageHeight = 50;
    const baseRect = { x: 0, y: 0, w: 250, h: 250, color: 'hsl(0, 0%, 90%)' };
    const subRects = [Object.assign({}, this.props.rectToPurchase, { color: 'hsl(0, 0%, 40%)' })];

    const builder = new SVGRectImageBuilder(imageHeight, imageHeight, baseRect, subRects);
    const previewImage = `data:image/svg+xml;base64,${btoa(builder.output())}`;
    const price = '3.22 gwei';

    const maxHeight = 250;
    const maxWidth = 250;

    const purchaseAspectRatio = this.props.rectToPurchase.h / this.props.rectToPurchase.w;
    let purchasePreviewImageWidth = maxHeight;
    let purchasePreviewImageHeight = maxWidth;
    if (purchaseAspectRatio > 1) {
      purchasePreviewImageWidth = maxHeight / purchaseAspectRatio;
    } else {
      purchasePreviewImageHeight = maxWidth * purchaseAspectRatio;
    }



    return (
      <Grid>
        <Row >
          <PageHeader style={{textAlign: 'center', width: '100%', marginTop: '0'}}>
            <span>Purchase Plot</span><small>{'        '}{price}{'        '}</small>
            <Image thumbnail src={previewImage} />
            <br /><br />
            <StatusDots items={['Image', 'Website', 'Buyout', 'Summary']} currentIndex={0} />
          </PageHeader>
        </Row>
        <Row>
          <Panel>
            <Panel.Body>
              <Col sm={8}>
                <h3>What Image Should Go In Your Plot?</h3>
                <br />
                <ChooseImageInputBox rectToPurchase={this.props.rectToPurchase} onImageLoaded={this.imageLoaded.bind(this)}/>
              </Col>
              <Col sm={4} style={{textAlign: 'center', height: '100%'}}>
                <div>
                  <h4>Image Preview</h4>
                  <img style={{objectFit: 'fill'}} width={purchasePreviewImageWidth} height={purchasePreviewImageHeight} src={this.state.image} />
                </div>
              </Col>

              <Button>Next: Choose Website</Button>
            </Panel.Body>
          </Panel>
        </Row>
      </Grid>
    )
  }
}

PurchaseModal.propTypes = {
  rectToPurchase: PropTypes.object.isRequired
};
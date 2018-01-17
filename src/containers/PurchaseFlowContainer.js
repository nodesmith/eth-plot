import React, { Component, PropTypes } from 'react';
import { Button, Grid, Jumbotron, Row, PageHeader, Image } from 'react-bootstrap';
import PurchaseModal from '../components/PurchaseModal';
import { SVGRectImageBuilder } from '../components/RectImage';
import StatusDots from '../components/StatusDots';

export default class PurchaseFlowContainer extends Component {
  render() {
    const imageHeight = 50;
    const baseRect = { x: 0, y: 0, w: 250, h: 250, color: 'hsl(0, 0%, 90%)' };
    const subRects = [Object.assign({}, this.props.rectToPurchase, { color: 'hsl(0, 0%, 40%)' })];

    const builder = new SVGRectImageBuilder(imageHeight, imageHeight, baseRect, subRects);
    const previewImage = `data:image/svg+xml;base64,${btoa(builder.output())}`;
    const price = '3.22 gwei';

    return (
      <Grid>
        <Row >
          <PageHeader style={{textAlign: 'center', width: '100%', marginTop: '0'}}>
            <span>Purchase Plot</span><small>{'        '}{price}{'        '}</small>
            <Image thumbnail src={previewImage} />
          </PageHeader>
          <StatusDots items={['Image', 'Website', 'Buyout', 'Summary']} currentIndex={1} />
        </Row>
        <Row>
          
        </Row>
      </Grid>
    )
  }
}

PurchaseModal.propTypes = {
  rectToPurchase: PropTypes.object.isRequired
};
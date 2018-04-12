import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';

import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Stepper, { Step, StepButton, StepLabel, StepContent } from 'material-ui/Stepper';
import { formatEthValueToString } from '../data/ValueFormatters';

import ChooseImageInputBox from './PurchaseDialog/ChooseImageInputBox';
import { ImageFileInfo } from '../models';
import WebsiteInputBox from './PurchaseDialog/WebsiteInputBox';
import BuyoutPriceInputBox from './PurchaseDialog/BuyoutPriceInputBox';
import { Rect, PlotInfo } from '../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  card: {
    height: '100%'
  },
  contrastColor: {
    color: theme.palette.secondary.contrastText
  },
  cardHeader: {
    backgroundColor: theme.palette.secondary.main
  },
  media: {
    height: 150,
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  summaryLine: {
    display: 'inline'
  }
});

export interface PurchaseFlowCardProps extends WithStyles {
    onClose: () => void;
    onImageSelected: (imageFileInfo: ImageFileInfo, plots: Array<PlotInfo>) => void;
    onStepComplete: (index: number, wasSkipped: boolean) => void;
    goToStep: (index: number) => void;
    onWebsiteChanged: (website: string, validationMessage: string) => void;
    onBuyoutChanged: (newPrice: string) => void;
    onBuyoutEnabledChanged: (isEnabled: boolean) => void;
  
    purchasePlot: (contractInfo, plots, rectToPurchase, imageData, website, initialBuyout) => void; // TODO
  
    rectToPurchase: Rect;
    purchasePriceInWei: string;
    activeStep: number;
    completedSteps: {[index: number]: boolean};
    imageName: string;
    imageDimensions: {
      h: number;
      w: number;
    }
    website: string;
    buyoutPriceInWei: string;
    buyoutEnabled: boolean;
    
    imageData?: string;
  
    contractInfo: any; // TODO
    plots: Array<PlotInfo>;
}

class PurchaseFlowCard extends Component<PurchaseFlowCardProps> {

  onImageChanged(imageFileInfo) {
    this.props.onImageSelected(imageFileInfo, this.props.plots);
  }

  goToStep(index) {
    this.props.goToStep(index);
  }

  stepCompleted(index, wasSkipped) {
    this.props.onStepComplete(index, wasSkipped);
  }

  onWebsiteChanged(websiteChangedMessage) {
    this.props.onWebsiteChanged(websiteChangedMessage.value, websiteChangedMessage.validation);
  }

  onBuyoutChanged(buyoutChangedMessage) {
    this.props.onBuyoutChanged(buyoutChangedMessage.value);
  }

  onBuyoutEnabledChanged(isEnabled) {
    this.props.onBuyoutEnabledChanged(isEnabled);
  }

  completePurchase() {
    const { contractInfo, plots, rectToPurchase, imageData, website, buyoutPriceInWei, buyoutEnabled } = this.props;
    const initialBuyout = buyoutEnabled ? buyoutPriceInWei : '';

    this.props.purchasePlot(contractInfo, plots, rectToPurchase, imageData, website, initialBuyout);
  }

  getButtons(backButtonProps, nextButtonProps) {
    const { classes } = this.props;
    return (
    <div className={classes.actionsContainer}>
      <div>
        <Button {...backButtonProps} className={classes.button}>
          {backButtonProps.text}
        </Button>
        <Button variant='raised' color="primary" className={classes.button} {...nextButtonProps}>
          {nextButtonProps.text}
        </Button>
      </div>
    </div>)
  }

  getStepContents(index) {
    let stepHeader, stepContent;
    const defaultBackButtonAction = this.goToStep.bind(this, index - 1);
    const defaultNextButtonAction = this.stepCompleted.bind(this, index, false);
    let stepDisabled = !(index == 0 || this.props.completedSteps[index - 1]);
    const { classes } = this.props;

    switch (index) {
      case 0:
      {
        const buttonEnabled = this.props.imageName.length > 0;
        stepHeader = 'Pick and place an image';
        stepContent = (
          <div>
            <Typography variant='body1'>
              Choose an image, then position and resize it in the grid. The purchase price will update as you move
            </Typography>
            <ChooseImageInputBox onImageChanged={this.onImageChanged.bind(this)} imageName={this.props.imageName}/>
            { this.getButtons({text: 'Reset'}, {text: 'Next', onClick: defaultNextButtonAction, disabled: !buttonEnabled}) }
          </div>
        );
        break;
      }
      case 1:
      {
        stepHeader = 'Add a URL (optional)';
        stepContent = (
          <div>
            <Typography variant='body1'>
              Add an optional website and initial buyout price
            </Typography>
            <WebsiteInputBox onWebsiteChanged={this.onWebsiteChanged.bind(this)} website={this.props.website}/>
            { this.getButtons({text: 'Back', onClick: defaultBackButtonAction}, {text: 'Next', onClick: defaultNextButtonAction}) }
          </div>
        );
        break;
      }
      case 2:
      {
        stepHeader = 'Set a buyout price (optional)';
        stepContent = (
          <div>
            <Typography variant='body1'>
              Set an optional initial buyout price
            </Typography>
            <BuyoutPriceInputBox
              onBuyoutChanged={this.onBuyoutChanged.bind(this)}
              onToggleChanged={this.onBuyoutEnabledChanged.bind(this)}
              rectToPurchase={{x: 0, y: 0, w: 10, h:10}}
              purchasePrice={this.props.purchasePriceInWei}
              buyoutPriceInWei={this.props.buyoutPriceInWei}
              toggleEnabled={this.props.buyoutEnabled}
              toggleText={'Enable Buyout'}
              title={'Buyout Price'}
              initialValue={{units: 'wei', ammountInWei: 500}}
              buyoutVisible={true}
              />
            { this.getButtons({text: 'Back', onClick: defaultBackButtonAction}, {text: 'Next', onClick: defaultNextButtonAction}) }
          </div>
        );
        break;
      }
      case 3:
      {
        const makeLine = (label, value) => (
          <div>
            <Typography className={classes.summaryLine} noWrap variant="body2">{label}{': '}</Typography>
            <Typography className={classes.summaryLine} noWrap variant="body1">{value}</Typography>
          </div>
        );
        stepHeader = 'Review and purchase';
        const rect = this.props.rectToPurchase;
        const buyoutPrice = this.props.buyoutEnabled ? formatEthValueToString(this.props.buyoutPriceInWei) : 'Not Enabled';
        stepContent = (
          <div>
            {makeLine('Purchase Price', formatEthValueToString(this.props.purchasePriceInWei))}
            {makeLine('Image', this.props.imageName)}
            {makeLine('Grid Location', `x: ${rect.x} y: ${rect.y}`)}
            {makeLine('Plot Dimensions', `${rect.w}x${rect.h} (${rect.w * rect.h} units)`)}
            {makeLine('Website', this.props.website)}
            {makeLine('Buyout Price', buyoutPrice)}
            { this.getButtons({text: 'Back', onClick: defaultBackButtonAction}, {text: 'Buy', onClick: this.completePurchase.bind(this)}) }
          </div>
        );
        break;
      }
    }

    const isCompleted = !!this.props.completedSteps[index];

    return (
      <Step key={index}>
        <StepButton onClick={this.goToStep.bind(this, index)} completed={isCompleted} disabled={stepDisabled}>
          {stepHeader}
        </StepButton>
        <StepContent>
          {stepContent}
        </StepContent>
      </Step>
    );
  }

  getStepperContent() {
    const { activeStep } = this.props;
    const steps = [0, 1, 2, 3].map(index => this.getStepContents(index));
    return (
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps}
      </Stepper>
    )
  }

  render() {
    const { classes, purchasePriceInWei } = this.props;
    const subheading = purchasePriceInWei ? formatEthValueToString(purchasePriceInWei) : 'Be Part of History';
    return (<div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader}
          classes={{title: classes.contrastColor, subheader: classes.contrastColor}}
            action={
              <IconButton color='primary' classes={{colorPrimary: classes.contrastColor}} onClick={this.props.onClose}>
                <CloseIcon />
              </IconButton>
            }
            title="Purchase Plot"
            subheader={subheading}
        />
        <CardContent>
          {this.getStepperContent()}
        </CardContent>
        <CardActions>
        </CardActions>
      </Card>
    </div>);
  }
}
export default withStyles(styles)(PurchaseFlowCard);

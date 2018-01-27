import React, { Component } from 'react';
import PurchaseModal from '../components/PurchaseModal';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Stepper, { Step, StepButton, StepLabel, StepContent } from 'material-ui/Stepper';

import ChooseImageInputBox from './PurchaseDialog/ChooseImageInputBox';
import WebsiteInputBox from './PurchaseDialog/WebsiteInputBox';
import BuyoutPriceInputBox from './PurchaseDialog/BuyoutPriceInputBox';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  card: {
    height: '100%'
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
});

class PurchaseFlowCard extends Component {
  constructor(...args) {
    super(...args);
  }

  onImageChanged(imageFileInfo) {
    this.props.onImageSelected(imageFileInfo);
  }

  goToStep(index) {
    this.props.goToStep(index);
  }

  stepCompleted(index, wasSkipped) {
    this.props.onStepComplete(index, wasSkipped);
  }

  onWebsiteChanged() {

  }

  getButtons(backButtonProps, nextButtonProps) {
    const { classes } = this.props;
    return (
    <div className={classes.actionsContainer}>
      <div>
        <Button {...backButtonProps} className={classes.button}>
          {backButtonProps.text}
        </Button>
        <Button raised color="primary" className={classes.button} {...nextButtonProps}>
          {nextButtonProps.text}
        </Button>
      </div>
    </div>)
  }

  getStepContents(index) {
    let stepHeader, stepContent;
    const defaultBackButtonAction = this.goToStep.bind(this, index - 1);
    const defaultNextButtonAction = this.stepCompleted.bind(this, index);

    switch (index) {
      case 0:
      {
        stepHeader = 'Pick and place an image';
        stepContent = (
          <div>
            <Typography type='body1'>
              Choose an image, then position and resize it in the grid. The purchase price will update as you move
            </Typography>
            <ChooseImageInputBox onImageChanged={this.onImageChanged.bind(this)} />
            { this.getButtons({text: 'Reset'}, {text: 'Next', onClick: defaultNextButtonAction}) }
          </div>
        );
        break;
      }
      case 1:
      {
        stepHeader = 'Add a URL (optional)';
        stepContent = (
          <div>
            <Typography type='body1'>
              Add an optional website and initial buyout price
            </Typography>
            <WebsiteInputBox onWebsiteChanged={this.onWebsiteChanged.bind(this)} />
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
            <Typography type='body1'>
              Set an optional initial buyout price
            </Typography>
            <BuyoutPriceInputBox
              rectToPurchase={{x: 0, y: 0, w: 10, h:10}}
              purchasePrice={'422287'}
              title={'Buyout Price'}
              initialValue={{units: 'wei', ammountInWei: 500}}
              />
            { this.getButtons({text: 'Back', onClick: defaultBackButtonAction}, {text: 'Next', onClick: defaultNextButtonAction}) }
          </div>
        );
        break;
      }
      case 3:
      {
        stepHeader = 'Review and purchase';
        stepContent = (
          <div>
            <Typography type='body1'>
              Make sure everything looks good
            </Typography>
          </div>
        );
        break;
      }
    }

    const isCompleted = !!this.props.completedSteps[index];

    return (
      <Step key={index}>
        <StepButton onClick={this.goToStep.bind(this, index)} completed={isCompleted}>
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
    const { classes } = this.props;
    return (<div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader}
            action={
              <IconButton onClick={this.props.onClose}>
                <CloseIcon />
              </IconButton>
            }
            title="Purchase Plot"
            subheader="A plot is forever"
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

PurchaseFlowCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  onImageSelected: PropTypes.func.isRequired,

  onStepComplete: PropTypes.func.isRequired,
  goToStep: PropTypes.func.isRequired,

  purchasePriceInWei: PropTypes.string.isRequired,
  activeStep: PropTypes.number.isRequired,
  completedSteps: PropTypes.object.isRequired,
  imageName: PropTypes.string.isRequired,
  imageDimensions: PropTypes.object.isRequired,
  website: PropTypes.string.isRequired,
  buyoutPriceInWei: PropTypes.string.isRequired
}

export default withStyles(styles)(PurchaseFlowCard);

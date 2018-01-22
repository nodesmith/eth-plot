import React, { Component } from 'react';
import PurchaseModal from '../components/PurchaseModal';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';

import ChooseImageInputBox from './PurchaseDialog/ChooseImageInputBox';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  card: {
    height: '100%'
  },
  media: {
    height: 200,
  },
});

class PurchaseFlowCard extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activeStep: 0
    };
  }

  onImageChanged(newImage) {
    this.setState({
      activeStep: 1
    })
  }

  getStepperContent() {
    const activeStep = this.state.activeStep;
    return (
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        <Step key={0}>
          <StepLabel>Choose An Image</StepLabel>
          <StepContent>
            <ChooseImageInputBox onImageChanged={this.onImageChanged.bind(this)} />
          </StepContent>
        </Step>
        <Step key={1}>
          <StepLabel>Resize and Position</StepLabel>
          <StepContent>
            Do some stuff
          </StepContent>
        </Step>
      </Stepper>
    )
  }

  render() {
    const { classes } = this.props;
    return (<div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
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
  onClose: PropTypes.func.isRequired
}

export default withStyles(styles)(PurchaseFlowCard);

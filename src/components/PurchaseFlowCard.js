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
      activeStep: 0,
      completed: {}
    };
  }

  onImageChanged(imageFileInfo) {
    this.props.onImageSelected(imageFileInfo);

    const { completed } = this.state;
    completed[0] = true;

    this.setState({
      activeStep: 1,
      completed
    })
  }

  handleStep(index) {
    this.setState({
      activeStep: index
    });
  }

  getStepperContent() {
    const activeStep = this.state.activeStep;
    return (
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        <Step key={0}>
          <StepButton onClick={() => this.handleStep(0)} completed={this.state.completed[0]} >
            Choose An Image
          </StepButton>
          <StepContent>
            <ChooseImageInputBox onImageChanged={this.onImageChanged.bind(this)} />
          </StepContent>
        </Step>
        <Step key={1}>
          <StepButton onClick={() => this.handleStep(1)} completed={this.state.completed[1]} >
            Resize and Position
          </StepButton>
          <StepContent>
            <Typography type='body1'>
              Resize and position your image. The purchase price will update as you move
            </Typography>
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
  onClose: PropTypes.func.isRequired,
  onImageSelected: PropTypes.func.isRequired
}

export default withStyles(styles)(PurchaseFlowCard);

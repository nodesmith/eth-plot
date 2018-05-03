import Close from '@material-ui/icons/Close';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import { Button, Divider, Snackbar } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as Actions from '../actions';
import { formatEthValueToString } from '../data/ValueFormatters';
import { ImageFileInfo, PlotInfo } from '../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    pointerEvents: 'all',
    paddingLeft: theme.spacing.unit * 2
  },
  contrastColor: {
    color: theme.palette.primary.contrastText
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main
  },
  priceText: {
    alignSelf: 'center',
    marginRight: theme.spacing.unit
  },
  dividerDiv: {
    backgroundColor: theme.palette.divider,
    width: 1,
    height: 48,
    margin: 0
  },
  mainContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  gone: {
    display: 'none'
  }
});

export interface PurchaseToolbarProps extends WithStyles {
  currentPrice: string;
  onClose: () => void;
  onCheckout: () => void;
  onImageSelected: Actions.purchaseImageSelected;
  entered: boolean;
  plots: Array<PlotInfo>;
}

class PurchaseToolbar extends Component<PurchaseToolbarProps> {
  componentDidUpdate(prevProps: PurchaseToolbarProps, prevState: PurchaseToolbarProps) {
    if (!prevProps.entered && this.props.entered) {
      const hiddenInput = document.getElementById('hiddenFileInput') as HTMLInputElement;
      hiddenInput.click();
    }
  }

  async onFileSelected(files: FileList) {
    if (files.length === 1) {
      const chosenFile = files[0];
      const fileSize = chosenFile.size;

      // Read this file and get some info about it
      const imageFileInfo = await this.getImageFileInfoAsync(chosenFile);
      this.props.onImageSelected(imageFileInfo, this.props.plots);
    }
  }

  getImageFileInfoAsync(file: File): Promise<ImageFileInfo> {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(file);
      const imagePreview = document.getElementById('hiddenIimage') as HTMLImageElement;

      imagePreview.onload = () => {
        const imageFileInfo: ImageFileInfo = {
          w: imagePreview.width,
          h: imagePreview.height,
          fileName: file.name,
          blobUrl,
          fileSize: file.size
        };

        resolve(imageFileInfo);
      };

      imagePreview.src = blobUrl;
    });
  }

  render() {
    const { classes, currentPrice } = this.props;
    const currentPriceDescription = currentPrice ? formatEthValueToString(this.props.currentPrice) : 'No Image Selected';
    return (
      <Paper className={classes.root}>
        <input id="hiddenFileInput" type="file" className={classes.gone}
          onChange={event => {this.onFileSelected(event.target.files!); event.target.value = '';}} />
        <img id="hiddenIimage" className={classes.gone} />
        <div className={classes.mainContainer}>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={true} color="primary" value="checkedA" />}
                label="Prices" />
              <FormControlLabel
                control={<Checkbox checked={true} color="primary" value="checkedA" />}
                label="Grid" />
            </FormGroup>
            <Typography className={classes.priceText} variant="subheading">
              {currentPriceDescription}
            </Typography>
            <FormGroup row>
              {/* <Button color="primary">Checkout</Button> */}
              <IconButton color="primary" onClick={this.props.onCheckout}>
                <ShoppingCart />
              </IconButton>
              <IconButton onClick={this.props.onClose}>
                <Close />
              </IconButton>
          </FormGroup>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(PurchaseToolbar);

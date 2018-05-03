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

import * as Actions from '../../actions';
import { formatEthValueToString } from '../../data/ValueFormatters';
import { ImageFileInfo, PlotInfo } from '../../models';

const styles: StyleRulesCallback = theme => ({
  root: {
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
  },
  showLabel: {
    marginTop: theme.spacing.unit,
    marginBottom: -10
  },
  priceLabel: {

  }
});

export interface PlaceImageInputProps extends WithStyles {
  currentPrice: string;
  showHeatmap: boolean;
  showGrid: boolean;
  toggleShowHeatmap: (show: boolean) => void;
  toggleShowGrid: (show: boolean) => void;
}

class PlaceImageInput extends Component<PlaceImageInputProps> {
  render() {
    const { classes, currentPrice } = this.props;
    const currentPriceDescription = currentPrice ? formatEthValueToString(this.props.currentPrice) : 'No Image Selected';
    return (
      <div className={classes.root}>
        <Typography className={classes.showLabel} variant="body2">
          Show:
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={this.props.showHeatmap} color="primary" value="checkedA" />}
            label="Prices" onChange={(event) => this.props.toggleShowHeatmap(event.target.checked)} />
          <FormControlLabel
            control={<Checkbox checked={this.props.showGrid} color="primary" value="checkedA" />}
            label="Grid"  onChange={(event) => this.props.toggleShowGrid(event.target.checked)}/>
        </FormGroup>
        <Typography className={classes.priceLabel} variant="body2">
          Current Price:
        </Typography>
        <FormGroup row>
          <Typography className={classes.priceText} variant="headline">
            {currentPriceDescription}
          </Typography>
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(styles)(PlaceImageInput);

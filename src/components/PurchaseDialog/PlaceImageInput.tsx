import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Typography from 'material-ui/Typography';
import * as React from 'react';

import { formatEthValueToString } from '../../data/ValueFormatters';


const styles: StyleRulesCallback = theme => ({
  root: { },
  priceText: {
    alignSelf: 'center',
    marginRight: theme.spacing.unit
  },
  showLabel: {
    marginTop: theme.spacing.unit,
    marginBottom: -10
  },
  priceLabel: { }
});

export interface PlaceImageInputProps extends WithStyles {
  currentPrice: string;
  showHeatmap: boolean;
  showGrid: boolean;
  toggleShowHeatmap: (show: boolean) => void;
  toggleShowGrid: (show: boolean) => void;
}

class PlaceImageInput extends React.Component<PlaceImageInputProps> {
  render() {
    const { classes, currentPrice } = this.props;
    let currentPriceDescription = currentPrice ? formatEthValueToString(this.props.currentPrice) : 'No Image Selected';
    if (this.props.currentPrice === '0') {
      currentPriceDescription = 'Invalid placement';
    }
    
    return (
      <div className={classes.root}>
        <Typography className={classes.showLabel} variant="body2">
          Show:
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={this.props.showHeatmap} color="primary" value="checkedA" />}
            label="Prices" onChange={(event) => this.props.toggleShowHeatmap((event.target as HTMLInputElement).checked)} />
          <FormControlLabel
            control={<Checkbox checked={this.props.showGrid} color="primary" value="checkedA" />}
            label="Grid"  onChange={(event) => this.props.toggleShowGrid((event.target as HTMLInputElement).checked)}/>
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

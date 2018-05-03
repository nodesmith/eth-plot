import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import Close from '@material-ui/icons/Close';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Typography from 'material-ui/Typography';

import { Button } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';

const styles: StyleRulesCallback = theme => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    pointerEvents: 'all'
  },
  contrastColor: {
    color: theme.palette.primary.contrastText
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main
  },
});

export interface PurchaseToolbarProps extends WithStyles {
  currentPrice: string;
  onClose: () => void;
}

class PurchaseToolbar extends Component<PurchaseToolbarProps> {
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardHeader className={classes.cardHeader}
          classes={{ title: classes.contrastColor, subheader: classes.contrastColor }}
            action={
            <IconButton color="primary" classes={{ colorPrimary: classes.contrastColor }} onClick={this.props.onClose}>
                <Close />
              </IconButton>
            }
            title="Purchase Plot"
        />
        <CardContent>
          <FormGroup row>
            <FormControlLabel
              control={<Switch checked={true} color="primary" value="checkedA" />}
              label="Heat Map" />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={<Switch checked={true} color="primary" value="checkedA" />}
              label="Gridlines" />
          </FormGroup>
        </CardContent>
        <CardActions>
          <Button color="primary">Checkout</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(PurchaseToolbar);

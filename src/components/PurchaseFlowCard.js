import React, { Component } from 'react';
import PurchaseModal from '../components/PurchaseModal';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

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

  }

  render() {
    const { classes } = this.props;
    return (<div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
            action={
              <IconButton>
                <CloseIcon />
              </IconButton>
            }
            title="Purchase Plot"
            subheader="A plot is forever"
        />
        <CardContent>
          <Typography type="headline" component="h2">
            Purchase Plot
          </Typography>
          <Typography component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button dense color="primary">
            Share
          </Button>
          <Button dense color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>);
  }
}

export default withStyles(styles)(PurchaseFlowCard);

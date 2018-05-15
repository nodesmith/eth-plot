import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { LinearProgress, LinearProgressProps } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import * as React from 'react';

const styles: StyleRulesCallback = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  progressRoot: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    marginBottom: theme.spacing.unit * 2
  }
});

export interface LoadingStatusProps extends WithStyles {
  message: string;
  progress: number;
}

class LoadingStatus extends React.Component<LoadingStatusProps> {

  render() {
    const { classes } = this.props;

    const progressProps: LinearProgressProps = {
      classes: { root: classes.progressRoot },
      variant: 'buffer',
      value: this.props.progress,
      valueBuffer: this.props.progress + 5
    };

    return (
      <Grid container className={classes.root} justify="center" alignItems="center">
        <Grid item xs={4}>
          <LinearProgress {...progressProps}/>
          <Typography align="center" variant="title">
            {this.props.message}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(LoadingStatus);
  

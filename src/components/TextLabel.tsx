import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import Typography from 'material-ui/Typography';

export interface TextLabelProps {
  caption: string;
  value: string | number;
  urlLink?: string;
}

class TextLabel extends Component<TextLabelProps> {
  render() {
    return (
      <div>
        <Typography variant="caption">{this.props.caption}:</Typography>
        {this.props.urlLink ?
          <Typography variant="body1" gutterBottom={true} noWrap><a href={this.props.urlLink}>{this.props.value}</a></Typography>
        : 
          <Typography variant="body1" gutterBottom={true} noWrap>{this.props.value}</Typography>
        }
      </div>
    );
  }
}

export default TextLabel;

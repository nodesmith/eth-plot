import Typography from 'material-ui/Typography';
import * as React from 'react';

export interface TextLabelProps {
  caption: string;
  value: string | number;
  urlLink?: string;
}

class TextLabel extends React.Component<TextLabelProps> {
  render() {
    return (
      <div>
        <Typography variant="caption">{this.props.caption}:</Typography>
        {this.props.urlLink ?
          <Typography variant="body1" gutterBottom={true} noWrap><a target="_blank" href={this.props.urlLink}>{this.props.value}</a></Typography>
        : 
          <Typography variant="body1" gutterBottom={true} noWrap>{this.props.value}</Typography>
        }
      </div>
    );
  }
}

export default TextLabel;

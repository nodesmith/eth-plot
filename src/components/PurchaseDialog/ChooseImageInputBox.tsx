import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { FormHelperText } from 'material-ui/Form';
import * as React from 'react';

import { InputValidationState } from '../../constants/Enums';
import { ImageFileInfo, InputValidation } from '../../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    marginBottom: 4
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  hidden: {
    display: 'none'
  }
});

export interface ChooseImageInputBoxPropTypes extends WithStyles {
  onImageChanged: (fileInfo: ImageFileInfo) => void;
  imageFileInfo?: ImageFileInfo;
  validation: InputValidation;
  allowedFileTypes: string[];
}

class ChooseImageInputBox extends React.Component<ChooseImageInputBoxPropTypes> {
  browseForImage() {
    const element = document.getElementById('hidden_input') as HTMLInputElement;
    element.click();
  }

  onFileSelected(event) {
    const files: File[] = event.target.files;
    if (files.length === 1) {
      const chosenFile = files[0];

      // Read this file and get some info about it
      this.getImageFileInfoAsync(chosenFile).then(imageFileInfo => {
        this.props.onImageChanged(imageFileInfo);
      });
    }
  }

  getImageFileInfoAsync(file: File): Promise<ImageFileInfo> {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(file);
      const imagePreview = document.getElementById('hidden_image') as HTMLImageElement;

      imagePreview.onload = () => {
        const imageFileInfo: ImageFileInfo = {
          w: imagePreview.width,
          h: imagePreview.height,
          fileName: file.name,
          blobUrl,
          fileSize: file.size,
          fileType: file.type
        };

        resolve(imageFileInfo);
      };

      imagePreview.src = blobUrl;
    });
  }

  render() {
    const { classes, allowedFileTypes, validation } = this.props;

    const validationMessage = (validation.state === InputValidationState.SUCCESS || validation.state === InputValidationState.UNKNOWN) ?
      '' : validation.message;
    return (
      <div>
        <FormHelperText>{validationMessage}</FormHelperText>
        <Button variant="raised" className={this.props.classes.button} id="browse-for-image" onClick={this.browseForImage.bind(this)} > Browse...</Button >
        <input
          accept={allowedFileTypes.join(',')}
          onChange={this.onFileSelected.bind(this)}
          type="file"
          id="hidden_input"
          className={classes.hidden} />
        <img id="hidden_image" className={classes.hidden} />
      </div>
    );
  }
}

export default withStyles(styles)(ChooseImageInputBox);

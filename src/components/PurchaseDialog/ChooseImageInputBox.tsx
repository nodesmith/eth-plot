import { Decimal } from 'decimal.js';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputAdornment, InputLabel } from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { InputValidationState } from '../../constants/Enums';
import { ImageFileInfo, InputValidation } from '../../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
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
    let newFileToUse;

    const files: File[] = event.target.files;
    if (files.length === 1) {
      const chosenFile = files[0];
      const fileSize = chosenFile.size;
      const fileName = chosenFile.name;
      const fileType = chosenFile.type;
      const lastModified = chosenFile.lastModified;

      newFileToUse = {
        fileSize: chosenFile.size,
        fileName: chosenFile.name,
        fileType: chosenFile.type,
        lastModified: chosenFile.lastModified
      };

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
    const imageLabel = 'Choose an image';
    const { classes, imageFileInfo, allowedFileTypes, validation } = this.props;
    const currentFileName = imageFileInfo ? imageFileInfo.fileName : '';

    const browseInputFn = () => (
      <div>
        <Button id="browse-for-image" onClick={this.browseForImage.bind(this)}>Browse...</Button>
        {currentFileName}
      </div>
    );


    const validationMessage = (validation.state === InputValidationState.SUCCESS || validation.state === InputValidationState.UNKNOWN) ?
      '' : validation.message;
    return (
      <FormControl className={classes.formControl}>
        {/* <InputLabel htmlFor="browse-for-image"></InputLabel>
        <Input margin="dense" fullWidth inputComponent={browseInputFn} /> */}
        <Button variant="raised" id="browse-for-image" onClick={this.browseForImage.bind(this)}>Browse...</Button>
        <FormHelperText>{validationMessage}</FormHelperText>
        <input
          accept={allowedFileTypes.join(',')}
          onChange={this.onFileSelected.bind(this)}
          type="file"
          id="hidden_input"
          className={classes.hidden} />
        <img id="hidden_image" className={classes.hidden} />
      </FormControl>
    );
  }
}

export default withStyles(styles)(ChooseImageInputBox);

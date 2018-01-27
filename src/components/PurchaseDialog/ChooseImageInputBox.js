import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Button, ControlLabel, DropdownButton, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, PageHeader, Row, Col, Glyphicon, Image, HelpBlock, Checkbox } from 'react-bootstrap';
import Decimal from 'decimal.js';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Typography from 'material-ui/Typography';

const allowedFileTypes = [
  'image/jpeg',
  'image/jpeg',
  'image/png',
  'image/svg+xml'
];

const styles = theme => ({
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
});

class ChooseImageInputBox extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      fileToUse: null,
      imageFileInfo: null,
      fileValidation: this.validateImageFile(null, null)
    };
  }

  browseForImage() {
    this.fileSelectInput.click();
  }

  onFileSelected(event) {
    let newFileToUse = null;

    const files = event.target.files;
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
        const fileValidation = this.validateImageFile(this.state.fileToUse, imageFileInfo);
        this.setState({
          imageFileInfo: imageFileInfo,
          fileValidation: fileValidation
        });

        this.props.onImageChanged(imageFileInfo);
      });
    }

    const fileValidation = this.validateImageFile(this.state.fileToUse, this.state.imageFileInfo);
    this.setState({fileToUse: newFileToUse, fileValidation: fileValidation});
  }

  validateImageFile(file, imageFileInfo) {
    if (!file) {
      return {
        state: null,
        message: 'This is the file which will be in your plot'
      };
    }

    if (allowedFileTypes.indexOf(file.fileType) < 0) {
      // Not allowed file
      return {
        state: 'error',
        message: 'File must be an image type'
      };
    }

    if (file.fileSize > 3000000) {
      const fileSizeInMb = file.fileSize / 1000000;
      return {
        state: 'error',
        message: `File must be less than 3MB (file is ${fileSizeInMb}MB)`
      };
    }

    if (imageFileInfo) {
      const aspectRatio = imageFileInfo.w / imageFileInfo.h;
    } else {
      return {
        state: 'warning',
        message: 'Processing selected image...'
      };
    }

    return {
      state: 'success',
      message: 'The image looks great!'
    };
  }

  getImageFileInfoAsync(file) {
    return new Promise(function(resolve, reject) {
      const fileReader = new FileReader;
      fileReader.onload = function() {
        this.imagePreview.onload = function () {
          const imageFileInfo = {
            w: this.imagePreview.width,
            h: this.imagePreview.height,
            fileName: file.name,
            fileData: fileReader.result
          };

          resolve(imageFileInfo);
        }.bind(this);

        this.imagePreview.src = fileReader.result;
      }.bind(this);
      
      fileReader.readAsDataURL(file);
    }.bind(this));
  }

  render() {
    // const imageLabel = `Plot Image (${this.props.rectToPurchase.w} x ${this.props.rectToPurchase.h})`;
    const imageLabel = 'Choose an image';
    const { classes } = this.props;

    const currentFile = this.props.imageName;


    const browseInputFn = () => (
    <div>
      <Button autoFocus dense color="primary" id="browse-for-image" onClick={this.browseForImage.bind(this)}>Browse...</Button>
      {currentFile}
    </div>);

    return (
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel htmlFor='browse-for-image'></InputLabel>
        <Input margin='dense' fullWidth inputComponent={browseInputFn} />
        <FormHelperText>{this.state.fileValidation.message}</FormHelperText>
        <input accept={allowedFileTypes.join(',')} onChange={this.onFileSelected.bind(this)} type='file' ref={(input) => { this.fileSelectInput = input; }} className='hidden' />
        <img ref={(input) => this.imagePreview = input } className='hidden'/>
      </FormControl>
    );
  }
}

ChooseImageInputBox.propTypes = {
  onImageChanged: PropTypes.func.isRequired,
  imageName: PropTypes.string.isRequired
}

export default withStyles(styles)(ChooseImageInputBox);
import React, { Component, PropTypes } from 'react';
import { Button, ControlLabel, DropdownButton, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, PageHeader, Row, Col, Glyphicon, Image, HelpBlock } from 'react-bootstrap';

export default class PlotPurchaseForm extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      fileToUse: null,
      imageFileInfo: null,
      fileValidation: {
        state: null,
        message: 'This is the file which will be in your plot'
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.fileToUse != this.state.fileToUse || prevState.imageFileInfo != this.state.imageFileInfo) {
      const fileValidation = this.validateImageFile(this.state.fileToUse, this.state.imageFileInfo);
      this.setState({fileValidation: fileValidation});
    }
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
        this.setState({
          imageFileInfo: imageFileInfo
        });
      });
    }

    this.setState({fileToUse: newFileToUse});
  }

  validateImageFile(file, imageFileInfo) {
    if (!file) {
      return {
        state: null,
        message: 'This is the file which will be in your plot'
      };
    }

    const allowedFileTypes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png'
    ];

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
      const targetRatio = this.props.rectToPurchase.w / this.props.rectToPurchase.h;
      if (Math.abs(aspectRatio - targetRatio) > 0.01) {
        return {
          state: 'warning',
          message: `Selected image does not match the aspect ratio of the target`
        };
      }
    } else {
      return {
        state: 'warning',
        message: 'Processing selected image...'
      };
    }

    return {
      state: 'success',
      message: ``
    };
  }

  getImageFileInfoAsync(file) {
    return new Promise((resolve, reject) => {
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
    });
  }

  render() {
    const imageLabel = `Plot Image (${this.props.rectToPurchase.w} x ${this.props.rectToPurchase.h})`;

    return (
      <div>
        <form>
          <FormGroup controlId='imageSelection' validationState={this.state.fileValidation.state}>
            <ControlLabel>{imageLabel}<Glyphicon glyph='info-sign' /></ControlLabel>
            <InputGroup>
              <InputGroup.Button>
                <Button onClick={this.browseForImage.bind(this)}>Browse...</Button>
              </InputGroup.Button>
              <FormControl type="text" value={this.state.fileToUse ? this.state.fileToUse.fileName: ''}/>
              <FormControl.Feedback />
            </InputGroup>
            <HelpBlock>{this.state.fileValidation.message}</HelpBlock>
          </FormGroup>

          <FormGroup controleId='websiteEntry'>
            <ControlLabel>Website</ControlLabel>
            <FormControl type="text" />
          </FormGroup>

          <FormGroup controleId='buyoutPrice'>
            <ControlLabel>Initial Buyout Price</ControlLabel>
            <InputGroup>
            <FormControl type="text" />
              <DropdownButton componentClass={InputGroup.Button} id="input-wei" title="wei" > 
                <MenuItem key="wei">wei</MenuItem>
                <MenuItem key="gwei">gwei</MenuItem>
                <MenuItem key="eth">eth</MenuItem>
              </DropdownButton>
            </InputGroup>
          </FormGroup>
        </form>
        <input onChange={this.onFileSelected.bind(this)} type='file' ref={(input) => { this.fileSelectInput = input; }} style={{display: 'none'}} />
        <img ref={(input) => this.imagePreview = input } style={{display: 'none'}} />
      </div>);
  }
}

PlotPurchaseForm.propTypes = {
  rectToPurchase: PropTypes.object.isRequired
}

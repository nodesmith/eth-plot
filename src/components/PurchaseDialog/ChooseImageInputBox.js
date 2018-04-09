var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
var allowedFileTypes = [
    'image/jpeg',
    'image/jpeg',
    'image/png',
    'image/svg+xml'
];
var styles = function (theme) { return ({
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
}); };
var ChooseImageInputBox = /** @class */ (function (_super) {
    __extends(ChooseImageInputBox, _super);
    // private fileSelectInput?: HTMLInputElement;
    // private imagePreview?: HTMLImageElement;
    function ChooseImageInputBox(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            fileToUse: undefined,
            imageFileInfo: undefined,
            fileValidation: _this.validateImageFile(null, null)
        };
        return _this;
    }
    ChooseImageInputBox.prototype.browseForImage = function () {
        var element = document.getElementById('hidden_input');
        element.click();
    };
    ChooseImageInputBox.prototype.onFileSelected = function (event) {
        var _this = this;
        var newFileToUse;
        var files = event.target.files;
        if (files.length === 1) {
            var chosenFile = files[0];
            var fileSize = chosenFile.size;
            var fileName = chosenFile.name;
            var fileType = chosenFile.type;
            var lastModified = chosenFile.lastModified;
            newFileToUse = {
                fileSize: chosenFile.size,
                fileName: chosenFile.name,
                fileType: chosenFile.type,
                lastModified: chosenFile.lastModified
            };
            // Read this file and get some info about it
            this.getImageFileInfoAsync(chosenFile).then(function (imageFileInfo) {
                var fileValidation = _this.validateImageFile(_this.state.fileToUse, imageFileInfo);
                _this.setState({
                    imageFileInfo: imageFileInfo,
                    fileValidation: fileValidation
                });
                _this.props.onImageChanged(imageFileInfo);
            });
        }
        var fileValidation = this.validateImageFile(this.state.fileToUse, this.state.imageFileInfo);
        this.setState({ fileToUse: newFileToUse, fileValidation: fileValidation });
    };
    ChooseImageInputBox.prototype.validateImageFile = function (file, imageFileInfo) {
        if (!file) {
            return {
                state: undefined,
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
            var fileSizeInMb = file.fileSize / 1000000;
            return {
                state: 'error',
                message: "File must be less than 3MB (file is " + fileSizeInMb + "MB)"
            };
        }
        if (imageFileInfo) {
            var aspectRatio = imageFileInfo.w / imageFileInfo.h;
        }
        else {
            return {
                state: 'warning',
                message: 'Processing selected image...'
            };
        }
        return {
            state: 'success',
            message: 'The image looks great!'
        };
    };
    ChooseImageInputBox.prototype.getImageFileInfoAsync = function (file) {
        return new Promise(function (resolve, reject) {
            var fileReader = new FileReader;
            fileReader.onload = function () {
                var imagePreview = document.getElementById('hidden_image');
                imagePreview.onload = function () {
                    var imageFileInfo = {
                        w: imagePreview.width,
                        h: imagePreview.height,
                        fileName: file.name,
                        fileData: fileReader.result
                    };
                    resolve(imageFileInfo);
                }.bind(this);
                imagePreview.src = fileReader.result;
            }.bind(this);
            fileReader.readAsDataURL(file);
        }.bind(this));
    };
    ChooseImageInputBox.prototype.render = function () {
        var _this = this;
        // const imageLabel = `Plot Image (${this.props.rectToPurchase.w} x ${this.props.rectToPurchase.h})`;
        var imageLabel = 'Choose an image';
        var classes = this.props.classes;
        var currentFile = this.props.imageName;
        var browseInputFn = function () { return (React.createElement("div", null,
            React.createElement(Button, { mini: true, color: "primary", id: "browse-for-image", onClick: _this.browseForImage.bind(_this) }, "Browse..."),
            currentFile)); };
        return (React.createElement(FormControl, { fullWidth: true, className: classes.formControl },
            React.createElement(InputLabel, { htmlFor: 'browse-for-image' }),
            React.createElement(Input, { margin: 'dense', fullWidth: true, inputComponent: browseInputFn }),
            "} />",
            React.createElement(FormHelperText, null, this.state.fileValidation.message),
            React.createElement("input", { accept: allowedFileTypes.join(','), onChange: this.onFileSelected.bind(this), type: 'file', id: 'hidden_input', className: 'hidden' }),
            React.createElement("img", { id: 'hidden_image', className: 'hidden' })));
    };
    return ChooseImageInputBox;
}(Component));
var ChooseButtonInput = /** @class */ (function (_super) {
    __extends(ChooseButtonInput, _super);
    function ChooseButtonInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChooseButtonInput.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Button, { mini: true, color: "primary", id: "browse-for-image", onClick: this.props.browseForImage }, "Browse..."),
            this.props.currentFile));
    };
    return ChooseButtonInput;
}(React.Component));
export default withStyles(styles)(ChooseImageInputBox);
//# sourceMappingURL=ChooseImageInputBox.js.map
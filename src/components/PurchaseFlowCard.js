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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Stepper, { Step, StepButton, StepContent } from 'material-ui/Stepper';
import { formatEthValueToString } from '../data/ValueFormatters';
import ChooseImageInputBox from './PurchaseDialog/ChooseImageInputBox';
import WebsiteInputBox from './PurchaseDialog/WebsiteInputBox';
import BuyoutPriceInputBox from './PurchaseDialog/BuyoutPriceInputBox';
var styles = function (theme) { return ({
    root: {
        width: '100%',
        height: '100%'
    },
    card: {
        height: '100%'
    },
    contrastColor: {
        color: theme.palette.secondary.contrastText
    },
    cardHeader: {
        backgroundColor: theme.palette.secondary.main
    },
    media: {
        height: 150,
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    summaryLine: {
        display: 'inline'
    }
}); };
var PurchaseFlowCard = /** @class */ (function (_super) {
    __extends(PurchaseFlowCard, _super);
    function PurchaseFlowCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PurchaseFlowCard.prototype.onImageChanged = function (imageFileInfo) {
        this.props.onImageSelected(imageFileInfo, this.props.plots);
    };
    PurchaseFlowCard.prototype.goToStep = function (index) {
        this.props.goToStep(index);
    };
    PurchaseFlowCard.prototype.stepCompleted = function (index, wasSkipped) {
        this.props.onStepComplete(index, wasSkipped);
    };
    PurchaseFlowCard.prototype.onWebsiteChanged = function (websiteChangedMessage) {
        this.props.onWebsiteChanged(websiteChangedMessage.value, websiteChangedMessage.validation);
    };
    PurchaseFlowCard.prototype.onBuyoutChanged = function (buyoutChangedMessage) {
        this.props.onBuyoutChanged(buyoutChangedMessage.value);
    };
    PurchaseFlowCard.prototype.onBuyoutEnabledChanged = function (isEnabled) {
        this.props.onBuyoutEnabledChanged(isEnabled);
    };
    PurchaseFlowCard.prototype.completePurchase = function () {
        var _a = this.props, contractInfo = _a.contractInfo, plots = _a.plots, rectToPurchase = _a.rectToPurchase, imageData = _a.imageData, website = _a.website, buyoutPriceInWei = _a.buyoutPriceInWei, buyoutEnabled = _a.buyoutEnabled;
        var initialBuyout = buyoutEnabled ? buyoutPriceInWei : '';
        this.props.purchasePlot(contractInfo, plots, rectToPurchase, imageData, website, initialBuyout);
    };
    PurchaseFlowCard.prototype.getButtons = function (backButtonProps, nextButtonProps) {
        var classes = this.props.classes;
        return (React.createElement("div", { className: classes.actionsContainer },
            React.createElement("div", null,
                React.createElement(Button, __assign({}, backButtonProps, { className: classes.button }), backButtonProps.text),
                React.createElement(Button, __assign({ variant: 'raised', color: "primary", className: classes.button }, nextButtonProps), nextButtonProps.text))));
    };
    PurchaseFlowCard.prototype.getStepContents = function (index) {
        var stepHeader, stepContent;
        var defaultBackButtonAction = this.goToStep.bind(this, index - 1);
        var defaultNextButtonAction = this.stepCompleted.bind(this, index, false);
        var stepDisabled = !(index == 0 || this.props.completedSteps[index - 1]);
        var classes = this.props.classes;
        switch (index) {
            case 0:
                {
                    var buttonEnabled = this.props.imageName.length > 0;
                    stepHeader = 'Pick and place an image';
                    stepContent = (React.createElement("div", null,
                        React.createElement(Typography, { variant: 'body1' }, "Choose an image, then position and resize it in the grid. The purchase price will update as you move"),
                        React.createElement(ChooseImageInputBox, { onImageChanged: this.onImageChanged.bind(this), imageName: this.props.imageName }),
                        this.getButtons({ text: 'Reset' }, { text: 'Next', onClick: defaultNextButtonAction, disabled: !buttonEnabled })));
                    break;
                }
            case 1:
                {
                    stepHeader = 'Add a URL (optional)';
                    stepContent = (React.createElement("div", null,
                        React.createElement(Typography, { variant: 'body1' }, "Add an optional website and initial buyout price"),
                        React.createElement(WebsiteInputBox, { onWebsiteChanged: this.onWebsiteChanged.bind(this), website: this.props.website }),
                        this.getButtons({ text: 'Back', onClick: defaultBackButtonAction }, { text: 'Next', onClick: defaultNextButtonAction })));
                    break;
                }
            case 2:
                {
                    stepHeader = 'Set a buyout price (optional)';
                    stepContent = (React.createElement("div", null,
                        React.createElement(Typography, { variant: 'body1' }, "Set an optional initial buyout price"),
                        React.createElement(BuyoutPriceInputBox, { onBuyoutChanged: this.onBuyoutChanged.bind(this), onToggleChanged: this.onBuyoutEnabledChanged.bind(this), rectToPurchase: { x: 0, y: 0, w: 10, h: 10 }, purchasePrice: this.props.purchasePriceInWei, buyoutPriceInWei: this.props.buyoutPriceInWei, toggleEnabled: this.props.buyoutEnabled, toggleText: 'Enable Buyout', title: 'Buyout Price', initialValue: { units: 'wei', ammountInWei: 500 }, buyoutVisible: true }),
                        this.getButtons({ text: 'Back', onClick: defaultBackButtonAction }, { text: 'Next', onClick: defaultNextButtonAction })));
                    break;
                }
            case 3:
                {
                    var makeLine = function (label, value) { return (React.createElement("div", null,
                        React.createElement(Typography, { className: classes.summaryLine, noWrap: true, variant: "body2" },
                            label,
                            ': '),
                        React.createElement(Typography, { className: classes.summaryLine, noWrap: true, variant: "body1" }, value))); };
                    stepHeader = 'Review and purchase';
                    var rect = this.props.rectToPurchase;
                    var buyoutPrice = this.props.buyoutEnabled ? formatEthValueToString(this.props.buyoutPriceInWei) : 'Not Enabled';
                    stepContent = (React.createElement("div", null,
                        makeLine('Purchase Price', formatEthValueToString(this.props.purchasePriceInWei)),
                        makeLine('Image', this.props.imageName),
                        makeLine('Grid Location', "x: " + rect.x + " y: " + rect.y),
                        makeLine('Plot Dimensions', rect.w + "x" + rect.h + " (" + rect.w * rect.h + " units)"),
                        makeLine('Website', this.props.website),
                        makeLine('Buyout Price', buyoutPrice),
                        this.getButtons({ text: 'Back', onClick: defaultBackButtonAction }, { text: 'Buy', onClick: this.completePurchase.bind(this) })));
                    break;
                }
        }
        var isCompleted = !!this.props.completedSteps[index];
        return (React.createElement(Step, { key: index },
            React.createElement(StepButton, { onClick: this.goToStep.bind(this, index), completed: isCompleted, disabled: stepDisabled }, stepHeader),
            React.createElement(StepContent, null, stepContent)));
    };
    PurchaseFlowCard.prototype.getStepperContent = function () {
        var _this = this;
        var activeStep = this.props.activeStep;
        var steps = [0, 1, 2, 3].map(function (index) { return _this.getStepContents(index); });
        return (React.createElement(Stepper, { nonLinear: true, activeStep: activeStep, orientation: "vertical" }, steps));
    };
    PurchaseFlowCard.prototype.render = function () {
        var _a = this.props, classes = _a.classes, purchasePriceInWei = _a.purchasePriceInWei;
        var subheading = purchasePriceInWei ? formatEthValueToString(purchasePriceInWei) : 'Be Part of History';
        return (React.createElement("div", { className: classes.root },
            React.createElement(Card, { className: classes.card },
                React.createElement(CardHeader, { className: classes.cardHeader, classes: { title: classes.contrastColor, subheader: classes.contrastColor }, action: React.createElement(IconButton, { color: 'primary', classes: { colorPrimary: classes.contrastColor }, onClick: this.props.onClose },
                        React.createElement(CloseIcon, null)), title: "Purchase Plot", subheader: subheading }),
                React.createElement(CardContent, null, this.getStepperContent()),
                React.createElement(CardActions, null))));
    };
    return PurchaseFlowCard;
}(Component));
export default withStyles(styles)(PurchaseFlowCard);
//# sourceMappingURL=PurchaseFlowCard.js.map
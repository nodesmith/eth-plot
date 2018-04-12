import * as DataActions from '../actionCreators/DataActions';
import * as Enums from '../constants/Enums';
import { ContractInfo, PlotInfo } from '../models';
import { Rect, Point, RectDelta } from '../models';
import { ImageFileInfo } from '../models';

// Account Actions
export type updateMetamaskState = (newState: string) => void;
export type updateActiveAccount = (newActiveAccount: string) => void;
export type addTransaction = (txHash: string, txType: Enums.TxType, txStatus: Enums.TxStatus, blockNumber: number, isNew: boolean) => void;
export type clearNotificationCount = () => void;
export type loadTransactions = () => void;
export type doneLoadingTransactions = () => void;
export type fetchAccountTransactions = (contractInfo: ContractInfo, currentAddress: string) => void;

// Data Actions
export type addPlot = (newPlot: PlotInfo) => void;
export type loadPlots = () => void;
export type listPlots = () => void;
export type plotListed = (txHash: string, zoneIndex: number) => void;
export type doneLoadingPlots = () => void;
export type fetchPlotsFromWeb3 = (contractInfo: ContractInfo) => void;
export type updateAuction = (contractInfo: ContractInfo, zoneIndex: number, newPrice: string) => void;
export type purchasePlot = (contractInfo: ContractInfo, plots: Array<PlotInfo>, rectToPurchase: Rect, url: string, ipfsHash: string, changePurchaseStep: (stage: Enums.PurchaseStage) => void) => void;

// Grid Actions
export type hoverOverPlot = (plotIndex: number) => void;
export type enterBuyMode = () => void;
export type startDraggingRect = (x: number, y: number) => void;
export type stopDraggingRect = () => void;
export type resizeDraggingRect = (x: number, y: number) => void;
export type showPurchaseDialog = (rectToPurchase: Rect) => void;
export type hidePurchaseDialog = () => void;
export type changeZoom = (direction: number) => void;

// Purchase Actions
export type togglePurchaseFlow = () => void;
export type purchaseImageSelected = (imageFileInfo: ImageFileInfo, plots: Array<PlotInfo>) => void;
export type transformRectToPurchase = (delta: RectDelta, plots: Array<PlotInfo>) => void;
export type startTransformRectToPurchase = (startLocation: Point, transformAction: Enums.MovementActions) => void;
export type stopTransformRectToPurchase = () => void;
export type completePurchaseStep = (index: number, wasSkipped: boolean) => void;
export type goToPurchaseStep = (index: number) => void;
export type changePlotWebsite = (website: string, websiteValidation) => void;
export type changePlotBuyout = (buyoutPriceInWei: string) => void;
export type changeBuyoutEnabled = (isEnabled: boolean) => void;
export type completePlotPurchase = (contractInfo: ContractInfo, plots: Array<PlotInfo>, rectToPurchase: Rect, imageData: ImageFileInfo, website: string, initialBuyout: string) => void;
export type cancelPlotPurchase = () => void;
export type startPurchasePlot = () => void;
export type changePurchaseStep = (purchaseStage: Enums.PurchaseStage) => void;

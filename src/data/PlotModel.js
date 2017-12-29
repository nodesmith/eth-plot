export class PlotModel {
  constructor(ownershipInfo, imageData, index) {
    this._ownershipInfo = ownershipInfo;
    this._imageData = imageData;
    this._index = index;
  }

  get index() {
    return this._index;
  }
}
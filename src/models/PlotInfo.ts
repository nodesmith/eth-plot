import { Rect } from './Rect';

export interface PlotInfo {
  rect: Rect;
  data: {
    url: string;
    ipfsHash: string;
    blobUrl: string;
  };
  zoneIndex: number;
  txHash: string;
  buyoutPricePerPixelInWei: number; // TODO
  owner: string;
}

export interface PurchaseEventInfo {
  purchaseIndex: number;
  purchasePrice: string;
  blockNumber: number;
  txHash: string;
  timestamp?: number;
}

export interface HoleInfo {[index: number]: Array<Rect>;}

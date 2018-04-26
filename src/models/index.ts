
import { Rect } from './Rect';
export * from './Rect';
export * from './UserTransactions';
export * from './PlotInfo';
export * from './Contract';
export * from './ImageFileInfo';

export interface GridInfo {
  width: number;
  height: number;
}

export interface PlotInfo {
  rect: Rect;
  data: {
    url: string;
  };
  zoneIndex: number;
  color: string;
  txHash: string;
  buyoutPrice: number; // TODO
  owner: string;
}

import { Rect } from './Rect';

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


export interface HoleInfo {[index: number]: Array<Rect>;}

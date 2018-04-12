import * as Enums from '../constants/Enums';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  x2: number;
  y2: number;
};

export interface Point {
  x: number;
  y: number;
}

export interface RectDelta {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface RectTransform {
  startLocation: Point;
  transformAction: Enums.MovementActions;
}


export function createEmptyRect(): Rect {
  return {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    x2: 0,
    y2: 0
  };
}

export function cloneRect(rect: Rect): Rect {
  return Object.assign({}, rect);
}

export function fromCoordinates(x: number, y: number, x2: number, y2: number): Rect {
  return {
    x: x,
    y: y,
    x2: x2,
    y2: y2,
    w: x2 - x,
    h: y2 - y
  };
}

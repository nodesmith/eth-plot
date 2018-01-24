/**
 * Vanilla JS doesn't support enums, but we can 
 * emulate them with an object.
 */
export const METAMASK_STATE = {
  UNINSTALLED: 0,
  OPEN: 1,
  LOCKED: 2
}

export const MovementActions = {
  NONE: -1,
  DRAG: 0,
  TOP: 1,
  LEFT: 2,
  BOTTOM: 3,
  RIGHT: 4,
  UPPER_LEFT: 5,
  LOWER_LEFT: 6,
  LOWER_RIGHT: 7,
  UPPER_RIGHT: 8,
};

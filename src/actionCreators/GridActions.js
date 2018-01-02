import * as ActionTypes from '../constants/ActionTypes';

export function hoverOverPlot(plotIndex) {
  return {
    type: ActionTypes.HOVER_OVER_PLOT,
    plotIndex
  };
}
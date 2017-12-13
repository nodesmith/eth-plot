const gridSize = 10;
const pixelSize = 40;

export function generatePlots() {
  const plots = [{
    x: 0, // start x in grid, left to right
    y: 0, // start y in grid, top to bottom
    h: gridSize - 1, // height in 'pixel'
    w: gridSize - 1, // width in 'pixel'
    data: "#123456" 
  }];

  return plots;
}

export function generatePixels(pxNumber) {
  const pixels = []
  for (let i = 0; i < pxNumber * pxNumber; i++) {
    pixels.push(getRandomColor());
  }
  return pixels
}

export function getGridStyle() {
 const style = {
   cursor: 'pointer',
   margin: 'auto',
   width: `${(gridSize-1)*pixelSize}px`,
   maxWidth: `${(gridSize-1)*pixelSize}px`,
   display: 'inline-block'
 }
 return style;
}

export function getPlotStyle(plot) {
  const style = {
    width: `${plot.w * pixelSize}px`,
    height: `${plot.h * pixelSize}px`,
    backgroundColor: plot.data, // TODO support images
    float: 'left'
  }
  return style
}

export function getOffset(x, y, gridSize, pixelSize) {
  const column = Math.floor(x / pixelSize);
  const row = Math.floor(y / pixelSize);

  return (row * gridSize) + column;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
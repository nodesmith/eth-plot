export function generateGrid(pxNumber) {
  const pixels = []
  for (let i = 0; i < pxNumber * pxNumber; i++) {
    pixels.push(getRandomColor());
  }
  return pixels
}

export function getPixelStyles(width, color) {
  const styles = {
    width: `${width}%`,
    paddingBottom: `${width}%`,
    backgroundColor: color
  }
  return styles
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
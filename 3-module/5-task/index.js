function getMinMax(str) {
  const numbers = str
    .split(' ')
    .map(value => parseFloat(value))
    .filter(value => !isNaN(value));

  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
  };
}

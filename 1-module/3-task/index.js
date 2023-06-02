function ucFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
  // or less readable: str && str[0].toUpperCase() + str.slice(1)
}

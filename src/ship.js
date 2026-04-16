export function Ship(length, type) {
  let hits = 0;

  const ship = {};

  ship.length = length;
  ship.type = type;

  function hit() {
    hits++;

    return hits;
  }
  function getHits() {
    return hits;
  }
  function getLength() {
    return length;
  }
  function isSunk() {
    return hits >= length;
  }

  return {
    length: length,
    hit,
    getHits,
    getLength,
    isSunk,
    type: type,
    getType() {
      return type;
    },
  };
}

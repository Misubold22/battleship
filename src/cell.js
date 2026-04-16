// cell.js

export function Cell() {
  let value = "";

  function addShip(ship) {
    value = ship;
  }

  function getValue() {
    return value;
  }

  return { addShip, getValue };
}

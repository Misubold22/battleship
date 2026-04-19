import { Cell } from "./cell.js";

export function Gameboard() {
  let misses = 0;
  let missBool = false;
  const rows = 10;
  const columns = 10;
  const board = [];
  const playerShips = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  function addPlayerShips(ship) {
    playerShips.push(ship);
  }
  function getPlayerShip(type) {
    return playerShips.find((ship) => ship.type === type);
  }

  function PlayerShipsSunk(ship) {
    if (ship.isSunk()) {
      const index = playerShips.indexOf(ship);
      playerShips.splice(index, 1);
    }
  }

  function getPlayerShips() {
    if (playerShips.length === 0) {
      return 0;
    }
    return playerShips.length;
  }

  function getBoard() {
    return board;
  }

  function placeShip([row, column, ship]) {
    const cell = board[row][column];
    if (cell.getValue() === "") {
      cell.addShip(ship);
      return true; // Successfully placed
    }
    return false; // Cell already occupied
  }

  function deleteShip([row, column]) {
    const cell = board[row][column];
    if (cell.getValue() !== "") {
      cell.addShip("");
      return true;
    }

    return false;
  }

  function toggleMissesBoolean() {
    missBool = !missBool; // Toggling the boolean
    return missBool;
  }
  function getMissesBoolean() {
    return missBool;
  }
  function receiveValidAttack(row, column) {
    const cell = board[row][column];
    const ship = cell.getValue();
    const foundShip = getPlayerShip(ship);
    const validHit = foundShip && ship != "H" && ship != "";
    if (validHit) {
      cell.addShip("H");
      foundShip.hit();
      PlayerShipsSunk(foundShip);
      return true;
    }
    if (ship === "") {
      cell.addShip("X");
      misses++;
      toggleMissesBoolean();
      return true;
    }
    return false;
  }
  function getMisses() {
    return misses;
  }

  function printBoard() {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  }

  return {
    getBoard,
    placeShip,
    printBoard,
    getMisses,
    addPlayerShips,
    getPlayerShips,
    getPlayerShip,
    receiveValidAttack,
    toggleMissesBoolean,
    getMissesBoolean,
    deleteShip,
  };
}

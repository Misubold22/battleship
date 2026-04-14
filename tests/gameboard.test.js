/* eslint-disable no-undef */

//const { types } = require('@babel/core');
import { Gameboard } from "../src/gameboard";
import { Ship } from "../src/ship";

test("new gameboard cells start empty", () => {
  const gameboard = Gameboard(3, 3);
  const cell = gameboard.getBoard()[1][1];
  expect(cell.getValue()).toBe("");
});

test("adds ships correctly", () => {
  const board = Gameboard();
  const myShip = Ship(2, "Destroyer");
  board.addPlayerShips(myShip);
  expect(board.getPlayerShips()).toBe(1);
});

test("player ship(s) is 0", () => {
  const board = Gameboard();
  expect(board.getPlayerShips()).toBe(0);
});

test("retrieving a ship by name/type works", () => {
  const board = Gameboard();
  const myShip = Ship(2, "Destroyer");
  board.addPlayerShips(myShip);
  const ship = "Destroyer";
  expect(board.getPlayerShip(ship).type).toBe(myShip.type);
});

test("getPlayerShip returns the correct ship by type", () => {
  const board = Gameboard();

  const destroyer = Ship(2, "Destroyer");
  const submarine = Ship(3, "Submarine");

  board.addPlayerShips(destroyer);
  board.addPlayerShips(submarine);

  const found = board.getPlayerShip("Destroyer");

  expect(found).toBe(destroyer);
  expect(found.type).toBe("Destroyer");
  expect(found.length).toBe(2);
});

test("places ship on correct coordinates", () => {
  const board = Gameboard();
  const userShip = Ship(2, "Destroyer");
  const position = board.placeShip(0, 1, userShip.type);
  expect(position).toBe(true);
});

test("board does not overwrite existing ships", () => {
  const board = Gameboard();
  const fistShip = Ship(2, "Destroyer");
  const secondShip = Ship(2, "Raptor");
  board.placeShip(0, 1, fistShip.type);
  const samePosition = board.placeShip(0, 1, secondShip.type);
  expect(samePosition).toBe(false);
});

test("placing multiple ships works", () => {
  const board = Gameboard();
  const fistShip = Ship(2, "Destroyer");
  const secondShip = Ship(3, "Raptor");
  board.placeShip(0, 1, fistShip.type);
  const secondPosition = board.placeShip(1, 1, secondShip.type);
  expect(secondPosition).toBe(true);
});

test("receiveAttack hits a ship when present", () => {
  const board = Gameboard();
  board.placeShip(1, 1, "Destroyer");

  const hits = board.receiveAttack(1, 1);

  expect(hits).toBe(1); // first hit
});

test("ships track damage correctly", () => {
  const board = Gameboard();
  board.placeShip(1, 1, "Destroyer");
  board.placeShip(1, 2, "Destroyer");
  board.receiveAttack(1, 1);

  const hits = board.receiveAttack(1, 2);

  expect(hits).toBe(2);
});

test("receiveAttack returns a miss on empty cell", () => {
  const board = Gameboard();
  board.placeShip(1, 1, "Destroyer");
  board.receiveAttack(1, 0);
  const miss = board.receiveAttack(2, 0);

  expect(miss).toBe(2);
});

test("multiple hits on the same cell do not re-hit the ship", () => {
  const board = Gameboard();
  board.placeShip(1, 1, "Destroyer");
  board.receiveAttack(1, 0);
  const hit = board.receiveAttack(1, 0);

  expect(hit).toBe(1);
});

test("missed shot marks the cell with 'X'", () => {
  const board = Gameboard();

  // Attack an empty cell → this must be a miss
  board.receiveAttack(0, 1);

  // Read value from the actual board
  const cellValue = board.getBoard()[0][1].getValue();

  expect(cellValue).toBe("X");
});

test("hit marks the cell with 'H'", () => {
  const board = Gameboard();
  const destroyer = Ship("Destroyer", 2);
  board.addPlayerShips(destroyer);
  board.placeShip(0, 0, destroyer.type);
  board.receiveAttack(0, 0);
  const cellValue = board.getBoard()[0][0].getValue();

  expect(cellValue).toBe("H");
});

test("checking sunk ships via repeated attacks", () => {
  const board = Gameboard();

  const myShip = Ship(2, "Destroyer");
  board.addPlayerShips(myShip);

  board.placeShip(0, 1, myShip.type);
  board.placeShip(0, 2, myShip.type);

  board.receiveAttack(0, 1);
  board.receiveAttack(0, 2);

  expect(myShip.isSunk()).toBe(true);
});

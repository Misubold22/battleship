/* eslint-disable no-undef */
//const Ship = require('../src/ship');
import { Ship } from "../src/ship";

test("ship hit 1", () => {
  const battleship = Ship(3, "destroyer");
  battleship.hit();
  expect(battleship.getHits()).toBe(1);
});

test("ship hit 2", () => {
  const battleship = Ship(3, "destroyer");
  battleship.hit();
  battleship.hit();
  expect(battleship.getHits()).toBe(2);
});

test("length is 3", () => {
  const battleship = Ship(3, "destroyer");
  expect(battleship.getLength()).toBe(3);
});

test("ships contain expected type", () => {
  const myShip = Ship(2, "Destroyer");
  expect(myShip.getType()).toBe("Destroyer");
});

test("ship sunk - true", () => {
  const battleship = Ship(3, "destroyer");
  battleship.hit();
  battleship.hit();
  battleship.hit();
  expect(battleship.isSunk()).toBeTruthy();
});

test("ship sunk - false", () => {
  const battleship = Ship(3, "destroyer");
  battleship.hit();
  battleship.hit();
  expect(battleship.isSunk()).toBeFalsy();
});

/* eslint-disable no-undef */
import { Cell } from "../src/cell";

test("default cell value is empty string", () => {
  const cell = Cell();
  expect(cell.getValue()).toBe("");
});

test(" cell value is added value", () => {
  const cell = Cell();
  cell.addShip("ship");
  expect(cell.getValue()).toBe("ship");
});

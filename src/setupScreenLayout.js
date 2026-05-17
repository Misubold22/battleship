import { createUIShip, createUIBoard } from "./gameLayout.js";
import { playerSHIP_CONFIG, getCoordLocalStorage } from "./setupScreenUtils.js";

function createDropZoneShips(className, shipLength) {
  const dropZone = document.querySelector(".dropZone");
  const ship = document.createElement("div");
  ship.setAttribute("class", className);
  ship.setAttribute("data-ship-length", shipLength); // Unique identifier
  if (className === "three-elements-b") {
    ship.setAttribute("data-ship-id", "3-b"); // Unique identifier
  }
  dropZone.appendChild(ship);

  for (let i = 0; i < shipLength; i++) {
    const dragElement = document.createElement("div");
    dragElement.setAttribute("class", "dragElement");
    dragElement.setAttribute("draggable", "true");
    ship.appendChild(dragElement);
  }
}

function renderAllShips() {
  const allShips = getAllShipsClass();
  for (let i = 0; i < allShips.length; i++) {
    createDropZoneShips(allShips[i].shipClass, allShips[i].length);
  }
  // return remainingShips;
}

function renderRemainingShips(remainingShips) {
  const dropZone = document.querySelector(".dropZone");

  while (dropZone.firstChild) {
    dropZone.removeChild(dropZone.firstChild);
  }

  for (let i = 0; i < remainingShips.length; i++) {
    createDropZoneShips(remainingShips[i].shipClass, remainingShips[i].length);
  }
  return remainingShips;
}

function renderEmptyBoard(newPlayer = false) {
  const boardDivPlayer = document.querySelector(".empty-board");
  if (newPlayer) {
    createUIBoard(newPlayer, boardDivPlayer, false);
  }
}

function changeDisplayStyle(elements, displayStyle) {
  for (let i = 0, max = elements.children.length; i < max; i++) {
    elements.children[i].style.display = displayStyle;
  }
}

function createDropZoneContentStyle(style, renderRemainingShips) {
  const dropZone = document.querySelector(".dropZone");

  if (style === "horizontal") {
    dropZone.classList.remove("dropZone-vertical");
    changeDisplayStyle(dropZone, "flex");
    renderRemainingShips;
  }

  if (style === "vertical") {
    renderRemainingShips;
    dropZone.classList.add("dropZone-vertical");
    changeDisplayStyle(dropZone, "grid");
  }
}

function createUIShips(id, boardDiv) {
  let obj = getCoordLocalStorage(id);
  for (let value in Object.values(obj)) {
    createUIShip(boardDiv, obj[value].row, obj[value].column);
  }
}

function createUIShipsAll(boardDiv) {
  const shipLengthArr = Object.keys(playerSHIP_CONFIG);
  for (let i = 0; i < shipLengthArr.length; i++) {
    createUIShips(shipLengthArr[i], boardDiv);
  }
}

function createBoards(player1, player2) {
  const boardDivPlayer = document.querySelector(".player-board");
  const boardDivEnemy = document.querySelector(".enemy-board");
  createUIBoard(player1, boardDivEnemy, false);
  createUIBoard(player2, boardDivPlayer, false);
  createUIShipsAll(boardDivPlayer);
}

function getAllShipsClass() {
  const allShipsClasses = [
    { shipClass: "five-elements", length: 5 },
    { shipClass: "four-elements", length: 4 },
    { shipClass: "three-elements-b", length: 3 },
    { shipClass: "three-elements", length: 3 },
    { shipClass: "two-elements", length: 2 },
  ];
  return allShipsClasses;
}
//

export {
  createDropZoneContentStyle,
  renderRemainingShips,
  renderAllShips,
  renderEmptyBoard,
  createUIBoard,
  createUIShips,
  createUIShipsAll,
  createBoards,
  getAllShipsClass,
};

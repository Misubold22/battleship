import { Player } from "./player.js";
import { ScreenController } from "./index.js";
import {
  renderGameLayout,
  clearSetupScreen,
  clearDropzoneContainer,
} from "./gameLayout.js";
import * as shipUtils from "./setupScreenUtils.js";
import {
  createDropZoneContentStyle,
  renderAllShips,
  createBoards,
  renderEmptyBoard,
  createUIShipsAll,
  getAllShipsClass,
  renderRemainingShips,
} from "./setupScreenLayout.js";

export const player1 = new Player();
export const player2 = new Player();
const newPlayer = new Player();
renderEmptyBoard(newPlayer);
localStorage.clear();
shipUtils.addAllPlayerShips(player1);
shipUtils.addAllPlayerShips(player2);

const allShipsClasses = getAllShipsClass();
const remainingShips = shipUtils.getRemainingShips(allShipsClasses);
const remainingShipsRender = renderRemainingShips(remainingShips);

function randomlyPlacedShips(SHIP_CONFIG, shipID, player) {
  const rows = 10;
  const columns = 10;
  const rowIndex = Math.floor(Math.random() * rows);
  const colIndex = Math.floor(Math.random() * columns);
  const config = SHIP_CONFIG[shipID];
  const otherPCShipLengths = shipUtils.getOtherPCShipLengths(
    SHIP_CONFIG,
    shipID,
  );
  const validHorizontalMove = shipUtils.isHorizontalMoveValid(
    config.length,
    otherPCShipLengths,
    rowIndex,
    colIndex,
  );
  const validVerticalMove = shipUtils.isVerticalMoveValid(
    config.length,
    otherPCShipLengths,
    rowIndex,
    colIndex,
  );
  const isHorizontalShip = shipUtils.randomShipPlacement();
  const placementViolations = [
    isHorizontalShip && colIndex + config.length > 10,
    !isHorizontalShip && rowIndex + config.length > 10,
  ];

  if (placementViolations.some(Boolean)) return;

  if (validHorizontalMove || validVerticalMove) {
    return;
  }

  if (isHorizontalShip) {
    shipUtils.getShipCoord(SHIP_CONFIG, [rowIndex, colIndex], shipID);
  } else {
    shipUtils.getShipCoord(SHIP_CONFIG, [rowIndex, colIndex], shipID, true);
  }
  shipUtils.getCoordLocalStorage(shipID).forEach((ship) => {
    player.placeShip(`${ship.row}${ship.column}${ship.type}  `);
  });
}

function handleRandomlyPlacedShips(SHIP_CONFIG, player) {
  const shipKeys = Object.keys(SHIP_CONFIG);

  for (let i = 0; i < shipKeys.length; i++) {
    randomlyPlacedShips(SHIP_CONFIG, shipKeys[i], player);
  }
}

function fixInvalidPlacedShips(SHIP_CONFIG, player, computerShips = false) {
  const MAX_ATTEMPTS = 150;
  let attempts = 0;

  if (computerShips) {
    let invalidPlacedShips = shipUtils.getInvalidComputerPlacedShips();
    while (invalidPlacedShips.length > 0 && attempts < MAX_ATTEMPTS) {
      invalidPlacedShips.forEach((element) =>
        randomlyPlacedShips(SHIP_CONFIG, element, player),
      );
      invalidPlacedShips = shipUtils.getInvalidComputerPlacedShips();

      attempts++;
    }
  } else {
    let invalidPlacedShips = shipUtils.getInvalidPlayerPlacedShips();
    while (invalidPlacedShips.length > 0 && attempts < MAX_ATTEMPTS) {
      invalidPlacedShips.forEach((element) =>
        randomlyPlacedShips(SHIP_CONFIG, element, player),
      );
      invalidPlacedShips = shipUtils.getInvalidPlayerPlacedShips();

      attempts++;
    }
  }
}

function areAllShipsPlaced() {
  return player2.getPlayerShips() === 5 && player1.getPlayerShips() === 5;
}

function drag(element, shipLength, dataShipId) {
  const shipContainer = document.querySelector(`.${element}`);
  const draggedShipElements = [];

  draggedShipElements.push(shipContainer);
  shipContainer.addEventListener("dragstart", dragStart);

  function dragStart(e) {
    let draggedSegment = e.target;
    if (draggedSegment) {
      draggedShipElements.push(draggedSegment.parentElement);
    }
  }

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("dragover", dragOver);
    cell.addEventListener("dragleave", dragLeave);
    cell.addEventListener("drop", drop);
  });

  function dragOver(e) {
    e.preventDefault();
    if (!e.target.classList.contains("dragElement")) {
      e.target.classList.add("drag-over");
    }
    if (!e.target.classList.contains("cell")) {
      e.target.classList.remove("drag-over");
    }
  }

  function dragLeave(e) {
    e.target.classList.remove("drag-over");
  }

  function drop(e) {
    e.target.classList.remove("drag-over");
    e.preventDefault();

    let draggedSegment = e.target;
    const threeElemBShip = dataShipId;
    const curentShipLength = shipUtils.getCurrentShipLength(
      draggedSegment.childNodes,
    );
    const otherShipLengths = shipUtils.getOtherShipLengths(
      curentShipLength,
      shipLength,
    );
    const otherBShipLengths = shipUtils.getOtherShipLengths(
      curentShipLength,
      shipLength,
      true,
    );
    const droppedRow = parseInt(e.target.dataset.row, 10);
    const droppedCol = parseInt(e.target.dataset.column, 10);
    const isValidMove = shipUtils.isHorizontalMoveValid(
      shipLength,
      otherShipLengths,
      droppedRow,
      droppedCol,
    );
    const validBShipMove = shipUtils.isHorizontalMoveValid(
      shipLength,
      otherBShipLengths,
      droppedRow,
      droppedCol,
      draggedSegment,
    );
    const validVerticalMove = shipUtils.isVerticalMoveValid(
      shipLength,
      otherShipLengths,
      droppedRow,
      droppedCol,
    );
    const validBVerticalShipMove = shipUtils.isVerticalMoveValid(
      shipLength,
      otherBShipLengths,
      droppedRow,
      droppedCol,
    );

    const isDropZoneVertical = shipUtils.checkShipVerticalOrientation();
    const localStorageShipLength = shipUtils.getLocalStorageShipLength(
      threeElemBShip,
      shipLength,
    );
    const horizontalShip = shipUtils.getLocalStorageShipHorizontal(
      localStorageShipLength,
    );
    const verticalShip = shipUtils.getLocalStorageShipVertical(
      localStorageShipLength,
    );
    let localStorageShip = shipUtils.getCoordLocalStorage(
      localStorageShipLength,
    );

    const horizontalShipTail = droppedCol + shipLength - 1;
    const verticalShipTail = droppedRow + shipLength - 1;

    if (isNaN(droppedRow) || isNaN(droppedCol)) return;

    const placementViolations = [
      !localStorageShip && !isDropZoneVertical && horizontalShipTail > 9,
      horizontalShip && horizontalShipTail > 9,
      !localStorageShip && isDropZoneVertical && verticalShipTail > 9,
      verticalShip && verticalShipTail > 9,
    ];

    if (placementViolations.some(Boolean)) {
      shipUtils.cancelPlacement(draggedShipElements);
      draggedElement.clearElement();
      return;
    }

    if (horizontalShip || (!localStorageShip && !isDropZoneVertical)) {
      const invalidHorizontalMove =
        (shipLength !== 3 && isValidMove) ||
        (shipLength === 3 && threeElemBShip && validBShipMove) ||
        (shipLength === 3 && !threeElemBShip && isValidMove);

      if (invalidHorizontalMove) {
        shipUtils.cancelPlacement(draggedShipElements);
        return true;
      }
    } else if (verticalShip || (!localStorageShip && isDropZoneVertical)) {
      const invalidVerticalMove =
        (shipLength !== 3 && validVerticalMove) ||
        (shipLength === 3 && threeElemBShip && validBVerticalShipMove) ||
        (shipLength === 3 && !threeElemBShip && validVerticalMove);

      if (invalidVerticalMove) {
        shipUtils.cancelPlacement(draggedShipElements);
        return true;
      }
    }

    if (
      shipUtils.containsShipClass(draggedSegment.children, "three-elements-b")
    ) {
      shipUtils.handleShipDrop("3-b", draggedSegment, droppedRow, droppedCol);
    } else if (
      shipUtils.containsShipClass(draggedSegment.children, "three-elements")
    ) {
      shipUtils.handleShipDrop(
        curentShipLength,
        draggedSegment,
        droppedRow,
        droppedCol,
      );
    }

    switch (curentShipLength) {
      case 2:
      case 4:
      case 5:
        shipUtils.handleShipDrop(
          curentShipLength,
          draggedSegment,
          droppedRow,
          droppedCol,
        );
        break;
    }

    draggedShipElements.forEach((shipPart) => {
      draggedSegment.appendChild(shipPart);
    });

    shipContainer.addEventListener("drag", () =>
      shipContainer.classList.add("beingDragged"),
    );
    shipContainer.addEventListener("dragend", () =>
      shipContainer.classList.remove("beingDragged"),
    );

    shipUtils.cancelPlacement(draggedShipElements);
    draggedElement.clearElement();
  }
}

function shipDirectionButtons() {
  const buttons = document.querySelector(".direction-button-container");
  buttons.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;
    createDropZoneContentStyle(e.target.dataset.action, remainingShipsRender);
  });
}
shipDirectionButtons();

let draggedElement = shipUtils.createDraggedSegment();

function setupShips() {
  const ships = document.querySelector(".dropZone");

  ships.addEventListener("dragover", (e) => {
    if (!e.target.matches(".dragElement")) return;

    let draggedSegment = e.target;
    const draggedSegmentClass = draggedSegment.parentElement.classList.value;
    const shipLength = Number(draggedSegment.parentElement.dataset.shipLength);
    const threeElementsBShip = draggedSegment.parentElement.dataset.shipId;
    draggedElement.setElement(draggedSegmentClass);

    if (!draggedSegmentClass.includes(draggedElement.getElement())) return;

    switch (draggedSegmentClass) {
      case "five-elements":
      case "four-elements":
      case "three-elements":
      case "two-elements":
        drag(draggedSegmentClass, shipLength);
        break;
      case "three-elements-b":
        drag(draggedSegmentClass, shipLength, threeElementsBShip);
        break;
    }
    ships.removeEventListener("dragover", e);
  });
}

function handleStartGame() {
  const playerPlacedShips = shipUtils.getInvalidPlayerPlacedShips();

  if (playerPlacedShips.length > 0) {
    return;
  }
  handleRandomlyPlacedShips(shipUtils.computerSHIP_CONFIG, player1);
  fixInvalidPlacedShips(shipUtils.computerSHIP_CONFIG, player1, true);
  shipUtils.placePlayerShips(player2);
  clearSetupScreen();
  renderGameLayout();
  createBoards(player1, player2);
  ScreenController();
}

function startGame() {
  if (!areAllShipsPlaced()) return;
  handleStartGame();
}

function handleSetupRandomShipPlacement() {
  const boardDivEmpty = document.querySelector(".empty-board");
  shipUtils.deletePlacedShips(player2, true);
  localStorage.clear();
  clearDropzoneContainer();
  renderEmptyBoard(newPlayer);
  handleRandomlyPlacedShips(shipUtils.playerSHIP_CONFIG, player2);
  fixInvalidPlacedShips(shipUtils.playerSHIP_CONFIG, player2);
  if (shipUtils.getInvalidPlayerPlacedShips().length > 0) return;
  createUIShipsAll(boardDivEmpty);
}

function setupRandomShipPlacement() {
  if (!areAllShipsPlaced()) return;
  handleSetupRandomShipPlacement();
}

function resetBoardContent() {
  shipUtils.deletePlacedShips(player2, true);
  clearDropzoneContainer();
  renderEmptyBoard(newPlayer);
  renderAllShips();
  if (shipUtils.checkShipVerticalOrientation()) {
    document.querySelector(".dropZone").classList.remove("dropZone-vertical");
  }
}

function setupButtons() {
  const buttons = document.querySelector(".button-container");

  buttons.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    switch (e.target.dataset.action) {
      case "reset":
        console.log("Reset game");
        resetBoardContent();
        break;
      case "random":
        console.log("Random placement");
        setupRandomShipPlacement();
        break;
      case "start":
        console.log("Start game");
        setTimeout(startGame, 500);
        break;
    }
  });
}

export { setupShips, setupButtons, shipDirectionButtons };

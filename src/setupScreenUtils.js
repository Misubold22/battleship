import { Ship } from "./ship.js";

export function appendCoordLocalStorage(id, value) {
  const jsonArray = JSON.stringify(value);
  localStorage.setItem(id, jsonArray);
}

export function getCoordLocalStorage(id) {
  const str = localStorage.getItem(id);
  const parsedArray = JSON.parse(str);
  return parsedArray;
}

const allShips = [
  { length: 2, type: "A" },
  { length: 3, type: "B" },
  { length: 3, type: "B" },
  { length: 4, type: "C" },
  { length: 5, type: "D" },
];

export const playerSHIP_CONFIG = {
  5: { length: allShips[4].length, type: allShips[4].type },
  4: { length: allShips[3].length, type: allShips[3].type },
  3: { length: allShips[1].length, type: allShips[1].type },
  "3-b": { length: allShips[2].length, type: allShips[2].type },
  2: { length: allShips[0].length, type: allShips[0].type },
};

export const computerSHIP_CONFIG = {
  6: { length: allShips[0].length, type: allShips[0].type },
  7: { length: allShips[1].length, type: allShips[1].type },
  8: { length: allShips[2].length, type: allShips[2].type },
  9: { length: allShips[3].length, type: allShips[3].type },
  10: { length: allShips[4].length, type: allShips[4].type },
};

export function addAllPlayerShips(player) {
  for (let i = 0, j = 0; i < allShips.length, j < allShips.length; i++, j++) {
    const myShipName = Ship(allShips[i].length, allShips[j].type);
    player.addPlayerShips(myShipName);
  }
}

export function getRemainingShips(allShips) {
  const remainedShips = [];
  const shipsNotDragged = getShipsNotDragged();
  const remainingShips = shipsNotDragged.filter((item) => item !== allShips);

  for (let i = 0; i < remainingShips.length; i++) {
    const result = allShips.find(
      ({ shipClass }) => shipClass === remainingShips[i],
    );
    remainedShips.push(result);
  }
  return remainedShips;
}

function getShipsNotDragged() {
  const dropZone = document.querySelector(".dropZone");
  const segments = [];
  const draggedSegmentChildrenArray = Array.from(dropZone.children);

  for (let child of draggedSegmentChildrenArray) {
    segments.push(child.classList.value);
  }
  return segments;
}

export function randomShipPlacement() {
  let shipStyle = ["horizontal", "vertical"],
    randomIndex = Math.floor(Math.random() * shipStyle.length);

  if (shipStyle[randomIndex] === "horizontal") {
    return true;
  }
  return false;
}

export function getOtherPCShipLengths(SHIP_CONFIG, curentShipLength) {
  const shipLengthArr = Object.keys(SHIP_CONFIG);
  return shipLengthArr.filter((item) => item !== curentShipLength);
}

export function getInvalidComputerPlacedShips() {
  let computerShipsKeys = Object.keys(computerSHIP_CONFIG);
  let playerShipsKeys = Object.keys(playerSHIP_CONFIG);
  let localStorageShips = Object.keys(localStorage);
  const firstUnique = computerShipsKeys.filter(
    (item) =>
      !localStorageShips.includes(item) && !playerShipsKeys.includes(item),
  );
  const secondUnique = localStorageShips.filter(
    (item) =>
      !computerShipsKeys.includes(item) && !playerShipsKeys.includes(item),
  );
  return [...firstUnique, ...secondUnique];
}

export function getInvalidPlayerPlacedShips() {
  let playerShipsKeys = Object.keys(playerSHIP_CONFIG);
  let localStorageShips = Object.keys(localStorage);
  const firstUnique = playerShipsKeys.filter(
    (item) => !localStorageShips.includes(item),
  );
  const secondUnique = localStorageShips.filter(
    (item) => !playerShipsKeys.includes(item),
  );
  return [...firstUnique, ...secondUnique];
}

export function deletePlacedShips(player, clearLocalStorage = false) {
  const playerShipKeys = Object.keys(localStorage);
  for (let i = 0; i < playerShipKeys.length; i++) {
    getCoordLocalStorage(playerShipKeys[i]).forEach((ship) => {
      player.deleteShip(`${ship.row}${ship.column}${ship.type}  `);
    });
  }
  if (clearLocalStorage) {
    localStorage.clear();
  }
  //
}

export function placePlayerShips(player) {
  const playerShipKeys = Object.keys(playerSHIP_CONFIG);
  for (let i = 0; i < playerShipKeys.length; i++) {
    getCoordLocalStorage(playerShipKeys[i]).forEach((ship) => {
      player.placeShip(`${ship.row}${ship.column}${ship.type}  `);
    });
  }
}

function isBaseHorizontalPlacementValid(id, row, col, shipLength) {
  if (getCoordLocalStorage(id) != null) {
    let obj = getCoordLocalStorage(id);
    const shipTail = col + shipLength - 1;

    const headOffsets = [
      [0, -1],
      [1, -1],
      [1, -1],
      [-1, -1],
      [-1, 1],
      [1, 1],
      [0, 2],
      [1, 2],
      [1, 0],
      [-1, 0],
    ];

    const tailOffsets = [
      [0, 1],
      [1, 1],
      [-1, 1],
      [1, 0],
      [-1, 0],
      [1, -1],
      [-1, -1],
      [-1, -2],
    ];

    for (const cell of Object.values(obj)) {
      const headCollision = headOffsets.some(
        ([dr, dc]) => row + dr === cell.row && col + dc === cell.column,
      );
      const tailCollision = tailOffsets.some(
        ([dr, dc]) => row + dr === cell.row && shipTail + dc === cell.column,
      );
      if (headCollision || tailCollision) return true;
    }
  }
  return false;
}

function isBaseVerticalPlacementValid(id, row, col, shipLength) {
  if (getCoordLocalStorage(id) != null) {
    let obj = getCoordLocalStorage(id);
    const shipTail = row + shipLength - 1;

    const headOffsets = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [-1, -1],
      [1, 1],
      [1, -1],
      [2, 1],
      [2, -1],
    ];

    const tailOffsets = [
      [1, 1],
      [1, -1],
      [0, 1],
      [-1, 1],
      [0, -1],
      [-1, -1],
      [1, 0],
    ];

    for (const cell of Object.values(obj)) {
      const headCollision = headOffsets.some(
        ([dr, dc]) => row + dr === cell.row && col + dc === cell.column,
      );
      const tailCollision = tailOffsets.some(
        ([dr, dc]) => shipTail + dr === cell.row && col + dc === cell.column,
      );
      if (headCollision || tailCollision) return true;
    }
  }
}

export function isHorizontalMoveValid(
  shipLength,
  curentShipLengthArr,
  row,
  column,
) {
  for (let i = 0; i < curentShipLengthArr.length; i++) {
    if (
      isBaseHorizontalPlacementValid(
        curentShipLengthArr[i],
        row,
        column,
        shipLength,
      )
    ) {
      return true;
    }
  }
}

export function isVerticalMoveValid(
  shipLength,
  curentShipLengthArr,
  row,
  column,
) {
  for (let i = 0; i < curentShipLengthArr.length; i++) {
    if (
      isBaseVerticalPlacementValid(
        curentShipLengthArr[i],
        row,
        column,
        shipLength,
      )
    ) {
      return true;
    }
  }
}

export function getOtherShipLengths(
  curentShipLength,
  shipLength,
  threeElemB = false,
) {
  const shipLengthArr = [2, 3, "3-b", 4, 5];
  const threeBOtherShipsLength = [2, 3, 4, 5];
  if (threeElemB) return threeBOtherShipsLength;

  if (curentShipLength === undefined) {
    return shipLengthArr.filter((item) => item !== shipLength);
  }
  return shipLengthArr.filter((item) => item !== curentShipLength);
}

function battleShip(row, column, type, position, length) {
  this.row = row;
  this.column = column;
  this.type = type;
  this.position = position;
  this.length = length;
}

function createShipSegments(
  SHIP_CONFIG,
  shipLength,
  row,
  column,
  verticalPlacement = false,
) {
  const config = SHIP_CONFIG[shipLength];
  if (!config) throw new Error("Invalid ship Length");

  const segments = [];
  if (verticalPlacement) {
    for (let i = 0; i < config.length; i++) {
      segments.push(new battleShip(row + i, column, config.type, "vertical"));
    }
    return segments;
  } else {
    for (let i = 0; i < config.length; i++) {
      segments.push(
        new battleShip(
          row,
          column + i,
          config.type,
          "horizontal",
          config.length,
        ),
      );
    }
    return segments;
  }
}

export function getShipCoord(
  SHIP_CONFIG,
  [row, column],
  shipLength,
  verticalPlacement = false,
) {
  if (verticalPlacement) {
    const shipSegments = createShipSegments(
      SHIP_CONFIG,
      shipLength,
      row,
      column,
      true,
    );
    appendCoordLocalStorage(shipLength, shipSegments);
  } else {
    const shipSegments = createShipSegments(
      SHIP_CONFIG,
      shipLength,
      row,
      column,
    );
    appendCoordLocalStorage(shipLength, shipSegments);
  }
}

export function getCurrentShipLength(elements) {
  for (let element of elements) {
    return Number(element.dataset.shipLength);
  }
  return;
}

export function containsShipClass(draggedSegmentChildren, childClass) {
  const draggedSegmentChildrenArray = Array.from(draggedSegmentChildren);
  for (let child of draggedSegmentChildrenArray) {
    if (child.classList.contains(childClass)) {
      return true;
    }
  }
  return false;
}

function applyShipOrientationClasses(
  draggedShip,
  shipLength,
  orientationClasses,
) {
  const carrierShip = document.querySelector(".five-elements");
  const destroyerShip = document.querySelector(".four-elements");
  const submarineShip = document.querySelector(".three-elements");
  const submarineBShip = document.querySelector(".three-elements-b");
  const patrolShip = document.querySelector(".two-elements");

  if (containsShipClass(draggedShip.children, "three-elements")) {
    submarineShip.classList.add(orientationClasses.submarine);
  }
  if (containsShipClass(draggedShip.children, "three-elements-b")) {
    submarineBShip.classList.add(orientationClasses.submarineB);
  }

  switch (shipLength) {
    case 2:
      patrolShip.classList.add(orientationClasses.patrol);
      break;
    case 4:
      destroyerShip.classList.add(orientationClasses.destroyer);
      break;
    case 5:
      carrierShip.classList.add(orientationClasses.carrier);
      break;
  }
}

function getVerticalClasses() {
  return {
    patrol: "verticalTwo",
    submarine: "verticalThree",
    submarineB: "verticalThreeB",
    destroyer: "verticalFour",
    carrier: "verticalFive",
  };
}

function applyVerticalClasses(draggedShip, shipLength) {
  applyShipOrientationClasses(draggedShip, shipLength, getVerticalClasses());
}

function getHorizontalClasses() {
  return {
    patrol: "horizontalTwo",
    submarine: "horizontalThree",
    submarineB: "horizontalThreeB",
    destroyer: "horizontalFour",
    carrier: "horizontalFive",
  };
}

function applyHorizontalClasses(draggedShip, shipLength) {
  applyShipOrientationClasses(draggedShip, shipLength, getHorizontalClasses());
}

export function checkShipVerticalOrientation() {
  return !!document.querySelector(".dropZone-vertical");
}

function getDroppedShipClass(draggedSegment) {
  const classes = [];
  draggedSegment.childNodes.forEach((child) => {
    classes.push(...child.classList);
  });
  return classes[1];
}

function isVerticalStyleWithShipHorizontal(draggedSegment) {
  const horizontalClasses = Object.values(getHorizontalClasses());
  const isVertical = checkShipVerticalOrientation();
  const droppedShipClass = getDroppedShipClass(draggedSegment);
  return isVertical && horizontalClasses.includes(droppedShipClass);
}

function isHorizontalStyleWithShipVertical(draggedSegment) {
  const verticalClasses = Object.values(getVerticalClasses());
  const isVertical = checkShipVerticalOrientation();
  const droppedShipClass = getDroppedShipClass(draggedSegment);
  return !isVertical && verticalClasses.includes(droppedShipClass);
}

export function handleShipDrop(
  shipLength,
  draggedSegment,
  droppedRow,
  droppedCol,
) {
  const isVerticalDropZone = checkShipVerticalOrientation();
  const isHorizontalShip = getLocalStorageShipHorizontal(shipLength);
  const isVerticalShip = getLocalStorageShipVertical(shipLength);
  let isVertical = false;

  if (isVerticalStyleWithShipHorizontal(draggedSegment)) {
    isVertical = false;
  } else if (isHorizontalStyleWithShipVertical(draggedSegment)) {
    isVertical = true;
  } else if (isHorizontalShip) {
    applyHorizontalClasses(draggedSegment, shipLength);
  } else if (isVerticalShip) {
    applyVerticalClasses(draggedSegment, shipLength);
    isVertical = true;
  } else if (isVerticalDropZone) {
    applyVerticalClasses(draggedSegment, shipLength);
    isVertical = true;
  } else {
    applyHorizontalClasses(draggedSegment, shipLength);
  }

  getShipCoord(
    playerSHIP_CONFIG,
    [droppedRow, droppedCol],
    shipLength,
    isVertical,
  );
}

function getLocalStorageShipPositionStyle(shipLength) {
  const shipPosStyle = [];
  if (getCoordLocalStorage(shipLength) != null) {
    let obj = getCoordLocalStorage(shipLength);
    for (let value in Object.values(obj)) {
      shipPosStyle.push(obj[value].position);
    }
  }
  return shipPosStyle;
}

export function getLocalStorageShipHorizontal(ShipLength) {
  return !!getLocalStorageShipPositionStyle(ShipLength).find(
    (item) => item === "horizontal",
  );
}

export function getLocalStorageShipVertical(ShipLength) {
  return !!getLocalStorageShipPositionStyle(ShipLength).find(
    (item) => item === "vertical",
  );
}

export function getLocalStorageShipLength(threeElemBShip, shipLength) {
  return threeElemBShip || shipLength;
}

export function cancelPlacement(draggedShipElements) {
  draggedShipElements.length = 0;
}

export function createDraggedSegment() {
  let dragElement = [];

  return {
    setElement(element) {
      const doesAlreadyExist = dragElement.includes(element);
      if (
        (dragElement.length > 0 && element != dragElement[0]) ||
        doesAlreadyExist
      )
        return;
      dragElement.push(element);
    },
    getElement() {
      return dragElement;
    },
    clearElement() {
      dragElement = [];
    },
  };
}

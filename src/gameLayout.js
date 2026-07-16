const containerDiv = document.querySelector(".container");

function createUIBoard(player, boardDiv, showValues = true) {
  const board = player.getBoard();

  board.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const cellButton = document.createElement("button");
      cellButton.classList.add("cell");
      cellButton.dataset.row = rowIndex;
      cellButton.dataset.column = columnIndex;
      if (showValues) {
        cellButton.textContent = cell.getValue();
      } else {
        cellButton.textContent = "";
      }
      boardDiv.appendChild(cellButton);
    });
  });
}

function createUIShip(boardDiv, row, column) {
  const divCell = boardDiv.querySelector(
    `[data-row="${row}"][data-column="${column}"]`,
  );
  divCell.style.backgroundColor = "oklch(35.9% 0.144 278.697)";
  const atackMarker = document.createElement("p");
  atackMarker.setAttribute("class", "ship");
  divCell.appendChild(atackMarker);
}
//

function handleUICellAttack(divCell, className) {
  divCell.style.backgroundColor = "oklch(35.9% 0.144 278.697)";
  divCell.classList.add("revealed");
  const atackMarker = document.createElement("p");
  atackMarker.setAttribute("class", className);
  divCell.appendChild(atackMarker);
}

function handleUIreceiveAttack(boardDiv, row, column, className) {
  const divCell = boardDiv.querySelector(
    `[data-row="${row}"][data-column="${column}"]`,
  );
  if (divCell.childNodes.length === 0) {
    handleUICellAttack(divCell, className);
  } else {
    divCell.innerHTML = "";
    handleUICellAttack(divCell, className);
  }
}

function toggleEnemyBoardInteraction(value) {
  const boardDivEnemy = document.querySelector(".enemy-board");
  boardDivEnemy.style.setProperty("pointer-events", value);
}

function clearContent() {
  const div = document.querySelector(".container");
  const playerBoard = document.querySelector(".player-board");
  const enemyBoard = document.querySelector(".enemy-board");

  if (playerBoard && enemyBoard) {
    playerBoard.remove();
    enemyBoard.remove();
  }

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function clearSetupScreen() {
  const div = document.querySelector(".container");

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function clearDropzoneContainer() {
  const div = document.querySelector(".dropZone");
  const emptyBoard = document.querySelector(".empty-board");

  while (emptyBoard.firstChild) {
    emptyBoard.removeChild(emptyBoard.firstChild);
  }

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function createButton(parentElement, className, buttonText) {
  const btn = document.createElement("button");
  btn.setAttribute("class", className);
  btn.textContent = buttonText;
  parentElement.appendChild(btn);

  return btn;
}

function createGameContainer(containerDiv, attribute, className) {
  const playerBoardElement = document.createElement("div");
  playerBoardElement.setAttribute(attribute, className);
  containerDiv.appendChild(playerBoardElement);
}

function renderPlayAgainBtn() {
  const turnsID = document.getElementById("turns");
  const turn = document.querySelector(".turn");
  turnsID.style.setProperty("display", "none");
  turn.style.setProperty("display", "none");
  const playAgainBtn = document.querySelector(".play-again");
  playAgainBtn.style.setProperty("display", "inline");
  playAgainBtn.style.setProperty("display", "flex");
}

function renderGameLayout() {
  createGameContainer(containerDiv, "class", "player-board");
  createGameContainer(containerDiv, "id", "turns");
  createButton(containerDiv, "play-again ", "Play again");
  const turnsID = document.getElementById("turns");
  const play = document.querySelector(".play-again");
  createGameContainer(turnsID, "class", "turn");
  createGameContainer(play, "class", "turn");
  createGameContainer(containerDiv, "class", "enemy-board");
}
export {
  createUIBoard,
  createUIShip,
  createGameContainer,
  handleUIreceiveAttack,
  clearContent,
  renderGameLayout,
  clearSetupScreen,
  clearDropzoneContainer,
  renderPlayAgainBtn,
  toggleEnemyBoardInteraction,
};

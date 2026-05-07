// index.js
import "./styles.css";
import {
  handleUIreceiveAttack,
  toggleEnemyBoardInteraction,
  renderPlayAgainBtn,
} from "./gameLayout.js";
import { setupButtons, player1, player2, setupShips } from "./setupScreen.js";

setupShips();
setupButtons();

function GameController(playerOneName, playerTwoName) {
  let players = [{ name: playerOneName }, { name: playerTwoName }];
  let activePlayer = players[0];
  const playerTurnDiv = document.querySelector(".turn");
  // for debugging (check valid ship placement) or to cheat:console.log("Computer ships(player1)" + player1.printBoard());
  console.log("Computer ships(player1)" + player1.printBoard());
  function switchPlayerTurn() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function playerWins(pc, player) {
    const activePlayer = getActivePlayer().name;
    const playerShips = player.getPlayerShips();
    const PCShips = pc.getPlayerShips();

    if (PCShips < 1) {
      playerTurnDiv.textContent = `${activePlayer} wins`;
      return true;
    } else if (playerShips < 1) {
      playerTurnDiv.textContent = `${activePlayer} wins`;
      return true;
    }
    return false;
  }

  function computerMoves(pc, player) {
    const rows = 10;
    const columns = 10;
    const rowIndex = Math.floor(Math.random() * rows);
    const colIndex = Math.floor(Math.random() * columns);
    const validAtack = player2.receiveValidAttack(rowIndex, colIndex);
    const boardDivPlayer = document.querySelector(".player-board");

    if (playerWins(pc, player)) {
      handleUIreceiveAttack(boardDivPlayer, rowIndex, colIndex, "hit");
      return true;
    }

    if (!validAtack) {
      setTimeout(computerMoves, 1000, pc, player);
    }

    if (validAtack && player2.getMissesBoolean() === true) {
      player2.toggleMissesBoolean();
      handleUIreceiveAttack(boardDivPlayer, rowIndex, colIndex, "atack");
      toggleEnemyBoardInteraction("auto");
      switchPlayerTurn();
      playerTurnDiv.textContent = `${getActivePlayer().name}'s turn...`;
    } else if (validAtack && player2.getMissesBoolean() === false) {
      handleUIreceiveAttack(boardDivPlayer, rowIndex, colIndex, "hit");
      setTimeout(computerMoves, 1000, pc, player);
      playerTurnDiv.textContent = `${getActivePlayer().name}'s turn...`;
    }

    return false; // Game continues
  }

  function playRound(row, column, pc, player) {
    const boardDivEnemy = document.querySelector(".enemy-board");
    const validAtack = player1.receiveValidAttack(row, column);

    if (!validAtack) {
      return;
    }

    if (validAtack && player1.getMissesBoolean() === true) {
      player1.toggleMissesBoolean();
      handleUIreceiveAttack(boardDivEnemy, row, column, "atack");
      toggleEnemyBoardInteraction("none");
      setTimeout(computerMoves, 1000, player, pc);
      switchPlayerTurn();
      playerTurnDiv.textContent = `${getActivePlayer().name}'s turn...`;
    } else {
      handleUIreceiveAttack(boardDivEnemy, row, column, "hit");
      playerTurnDiv.textContent = `${getActivePlayer().name}'s turn...`;
    }

    return false; // Game continues
  }

  return {
    playRound,
    getActivePlayer,
    playerWins,
    switchPlayerTurn,
  };
}

export function ScreenController() {
  const game = GameController("Player", "Computer");
  const boardDivEnemy = document.querySelector(".enemy-board");
  const playerTurnDiv = document.querySelector(".turn");
  const activePlayer = game.getActivePlayer();
  let gameOver = false;

  if (!gameOver) {
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
  }

  boardDivEnemy.addEventListener("click", (e) => {
    if (gameOver) return; // Prevent moves after game over
    const selectedRow = parseInt(e.target.dataset.row, 10);
    const selectedColumn = parseInt(e.target.dataset.column, 10);

    if (isNaN(selectedRow) || isNaN(selectedColumn)) return; // Ignore invalid clicks
    game.playRound(selectedRow, selectedColumn, player1, player2);

    if (game.playerWins(player1, player2)) {
      gameOver = true;
      setTimeout(renderPlayAgainBtn, 2000);
      toggleEnemyBoardInteraction("none");
    }
  });
  const playAgainBtn = document.querySelector(".play-again");
  playAgainBtn.addEventListener("click", () => {
    location.reload();
  });
}

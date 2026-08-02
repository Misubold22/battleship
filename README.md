# Battleship

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

---

## Introduction
**Battleship** is a browser implementation of the classic naval strategy game, built with vanilla JavaScript, factory functions, and Webpack. Place your fleet, then take turns firing at the computer's board until one side's ships are all sunk.

**Live Demo**: [View Site](https://misubold22.github.io/battleship/)

---

## Features
- **Drag-and-Drop Ship Placement**: Ships are positioned on the board using native drag-and-drop, with horizontal/vertical orientation toggling.
- **Placement Validation**: Prevents ships from overlapping or touching adjacent ships.
- **Random Placement**: Automatically arranges the player's fleet on request.
- **Computer Opponent**: AI selects valid random attack coordinates and takes its turn automatically.
- **Turn-Based Gameplay**: Turn indicator and board interaction lock while the opponent is moving.
- **Win Detection**: Game ends and displays the winner once a fleet is fully sunk.
- **Unit Tested**: Core game logic (cells, ships, gameboard) covered by Jest tests.

---

## Technologies Used
- **JavaScript (ES6+)**: Core game logic using factory functions and modules.
- **Webpack**: Module bundler and dev server.
- **Babel**: JavaScript transpilation for Jest.
- **Jest**: Unit testing framework.
- **ESLint**: Code linting.
- **Prettier**: Code formatting.

---

## Project Structure
The file structure of the project is as follows:

```
battleship/
├── dist/                        # Webpack build output
├── src/
│   ├── index.js                 # Game controller and turn logic
│   ├── gameboard.js             # Board state and attack handling
│   ├── player.js                # Player factory
│   ├── ship.js                  # Ship factory
│   ├── cell.js                  # Cell factory
│   ├── setupScreen.js           # Setup screen logic and drag-and-drop
│   ├── setupScreenLayout.js     # Setup screen UI rendering
│   ├── setupScreenUtils.js      # Ship placement and validation helpers
│   ├── gameLayout.js            # Game board UI rendering
│   ├── styles.css               # Styling
│   └── template.html            # HTML template
├── tests/
│   ├── cell.test.js             # Cell unit tests
│   ├── ship.test.js             # Ship unit tests
│   └── gameboard.test.js        # Gameboard unit tests
├── package.json                 # npm configuration
├── webpack.config.js            # Webpack configuration
└── README.md                    # Project documentation
```

- **src/index.js**: Controls the game loop, turns, and win condition.
- **src/gameboard.js, player.js, ship.js, cell.js**: Core game state factories.
- **src/setupScreen*.js**: Handles fleet placement, drag-and-drop, and validation.
- **src/gameLayout.js**: Renders the game boards and handles UI updates.
- **tests/**: Jest test suites for the core game logic.

---

## Usage
To set up and use Battleship, follow these steps:

```bash
git clone https://github.com/Misubold22/battleship.git
cd battleship
npm install
npm run dev
```

**Usage:**
- Drag each ship onto the board, or click "Random" to place the fleet automatically.
- Toggle ship orientation with the direction buttons.
- Click "Start" once all ships are placed.
- Click a cell on the enemy board to attack.
- Click "Play again" after the game ends to restart.

Other available scripts:

```bash
npm run build    # Production build
npm test         # Run Jest tests
```

---

## Credits
- **Font**: Modern Tetris

---

## License
This project is licensed under the ISC License.

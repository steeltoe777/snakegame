
# Architecture Overview

This document outlines the high-level architecture of the Snake, Tron, Pac-Man Hybrid Game.

## Core Components

*   **HTML (index.html):** Provides the basic structure of the game, including the canvas, score display, level display, and the game over overlay.
*   **CSS (style.css):** Handles the visual styling of all HTML elements, ensuring a consistent and appealing user interface with Tron-like aesthetics.
*   **JavaScript (script.js):** Contains the core game logic, including:
    *   Game State Management: A central `gameState` object manages all dynamic aspects like snake position, direction, score, level, game running status, maze, pellets, and trail.
    *   Canvas Drawing: Functions for drawing the snake, pellets, maze, and trail on the HTML5 canvas.
    *   Game Loop: An `update` function that runs at regular intervals to handle game progression, collision detection, and state updates.
    *   Input Handling: Event listeners for keyboard input to control the snake's direction and start/restart the game.
    *   Game Mechanics: Functions for `generateMaze`, `generatePellets`, `levelUp`, `gameOver`, and `resetGame`.

## Modularity

The game logic is encapsulated within `script.js` with clearly defined functions for different aspects of the game (drawing, updating, state management). Future enhancements are planned to further modularize the codebase into separate JavaScript files for better organization and maintainability.

## Data Flow

User input (arrow keys) modifies the snake's direction (`dx`, `dy`) in the `gameState`. The `update` function, part of the main game loop, reads this state, calculates new positions, checks for collisions, updates score/level, and then triggers drawing functions. The drawing functions read the `gameState` and render the game elements on the canvas.

## Quality Assurance

*   **ESLint:** Used for static code analysis to enforce code style and identify potential issues.
*   **Prettier:** Used for consistent code formatting.
*   **Jest:** Employed for automated unit and integration testing of core game logic.

## Future Architectural Considerations

*   **Further Modularization:** Breaking down `script.js` into smaller, more focused modules (e.g., `snake.js`, `maze.js`, `pellets.js`, `gameLoop.js`).
*   **State Management Pattern:** Potentially introducing a more formal state management pattern if the game complexity grows significantly.
*   **Asset Loading:** A dedicated module for loading images, sounds, and other game assets.

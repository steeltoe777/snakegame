
# Snake, Tron, Pac-Man Hybrid Game

## Description

This project presents an innovative web-based game that merges the classic mechanics of Snake with the visual aesthetics and strategic elements of Tron and the pellet-collecting objective of Pac-Man. Players control a snake that grows by consuming pellets, while leaving a Tron-like trail that becomes an obstacle. The game features dynamic maze generation and a custom game over experience, offering a challenging and engaging gameplay loop.

## Features

*   **Classic Snake Mechanics:** Grow by eating pellets, avoid self-collision and walls.
*   **Tron-like Trails:** The snake leaves a persistent trail that acts as a dynamic obstacle, increasing challenge.
*   **Pac-Man Inspired Pellets:** Collect pellets scattered across the maze to increase score and snake length.
*   **Dynamic Maze Generation:** Mazes are programmatically generated, with outer walls always present and internal walls introduced at higher levels for increased complexity.
*   **Level Progression:** Advance through levels with increasing difficulty and new maze layouts.
*   **Custom Game Over Screen:** A visually integrated HTML overlay replaces the default browser alert for a seamless user experience.
*   **Score and Level Tracking:** Real-time display of current score and level.
*   **Modular Architecture:** The codebase is structured with a focus on modularity, making it maintainable and extensible.

## Installation/Setup

To get the game running locally:

1.  Navigate to the project directory:
    ```bash
    cd /a0/projects/snakegame/
    ```
2.  Open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox):
    ```bash
    xdg-open index.html # On Linux, or manually open the file
    ```

## How to Play

*   Use the **Arrow Keys** (Up, Down, Left, Right) to control the snake's direction.
*   Eat the **pellets** (small squares) to grow your snake and increase your score.
*   Avoid colliding with the **walls**, your **own body**, or the **trail** left by your snake.
*   The game ends if you collide. Press the 'Restart Game' button on the game over screen to play again.

## Architecture & Design

This project follows a modular architecture to ensure maintainability and scalability. Detailed architectural decisions and design considerations are documented in the `docs/` directory.

*   **Architecture Overview:** For a high-level understanding of the system's structure and components, refer to [docs/architecture.md](docs/architecture.md).
*   **Design Decisions:** For specific design choices and their rationale, refer to [docs/design.md](docs/design.md).
*   **Architectural Decision Records (ADRs):** Important architectural decisions are formally documented in the `docs/adr/` directory. See [docs/adr/001-module-structure.md](docs/adr/001-module-structure.md) for an example.

## Development Guidelines

We are committed to maintaining high code quality throughout the project:

*   **Code Linting:** ESLint is configured to enforce consistent code style and identify potential issues.
*   **Automated Testing:** Jest is used for comprehensive unit and integration testing of game logic.
*   **File Size Principle:** JavaScript files adhere to a principle of maximum 500 lines of code to promote readability and maintainability (though `script.js` currently exceeds this as a monolithic starting point).

## Future Enhancements

Potential future features and areas for expansion include:

*   Further modularization of `script.js` into smaller, domain-specific files.
*   Implementation of a life system or alternative 'dying' mechanics.
*   Addition of power-ups or special pellets.
*   Sound effects and background music.
*   Multiplayer mode (Tron-style light cycles).

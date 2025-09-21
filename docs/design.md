
# Design Decisions

This document details specific design choices made during the development of the Snake, Tron, Pac-Man Hybrid Game.

## Game State Management

*   **Centralized `gameState` Object:** All mutable game data (snake position, score, level, maze, pellets, etc.) is consolidated into a single `gameState` JavaScript object. This simplifies state access and modification, making it easier to pass state around and test.
    *   **Pros:** Single source of truth, easy to serialize/deserialize (for saving game state), simplifies testing by allowing direct manipulation of state.
    *   **Cons:** Can become a large object if not carefully managed, potential for tight coupling if not accessed judiciously.

## Canvas Rendering

*   **HTML5 Canvas API:** Direct drawing using `CanvasRenderingContext2D` methods (`fillRect`, `arc`, `clearRect`). This provides fine-grained control over rendering and is performant for this type of 2D game.
    *   **Pros:** High performance for pixel-perfect control, widely supported by browsers.
    *   **Cons:** Requires manual drawing logic for all elements, can become complex for highly dynamic UIs.

## Collision Detection

*   **Grid-Based Collision:** Collisions are detected by checking if the snake's head occupies the same grid coordinates as a wall, its own body segments, or a trail segment. This is efficient given the grid-based nature of the game.
    *   **Pros:** Simple and highly efficient for grid-based games.
    *   **Cons:** Less flexible for non-grid-aligned movements or complex shapes.

## Maze Generation

*   **Dynamic Generation:** Mazes are generated programmatically based on the current level. Lower levels feature only outer walls, while higher levels introduce internal walls.
    *   **Pros:** Provides replayability and increasing challenge, avoids static, repetitive levels.
    *   **Cons:** Can sometimes generate unplayable or overly difficult mazes if pathfinding is not rigorously implemented (currently relies on random placement with basic checks).

## Game Over Screen

*   **Custom HTML Overlay:** Replaced the default browser `alert()` with a custom-styled HTML `div` overlay. This provides a more integrated and visually appealing user experience.
    *   **Pros:** Better aesthetics, full control over styling, non-blocking UI, allows for more complex interactions (e.g., restart button).
    *   **Cons:** Requires additional HTML and CSS, slightly more complex JavaScript to manage visibility and events.

## Testability

*   **Global Exposure for Testing:** Key functions and the `gameState` object are explicitly exposed on the `window` object (`window.gameState`, `window.resetGame`, etc.). This allows Jest tests running in a JSDOM environment to easily access and mock game components.
    *   **Pros:** Simplifies unit and integration testing, allows for mocking browser APIs (like Canvas).
    *   **Cons:** Exposing globals can be seen as a less "clean" pattern in large applications, but is pragmatic for a small vanilla JS project and testing.

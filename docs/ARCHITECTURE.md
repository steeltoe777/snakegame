# 🏗️ Technical Architecture

This document describes the high-level architecture of the **Snake Game Engine**. It is intended for developers who want to understand the data flow, rendering cycle, and collision detection logic.

---

## 🏗️ Core Design Pattern: Single Source of Truth

The entire engine revolves around a single, global **`gameState`** object. All game-related data—snake coordinates, pellets, maze walls, and timers—live here.

### **Game State Interface**

```javascript
const gameState = {
    snake: [{ x: 10, y: 10 }], // Array of coordinates
    level: 1, // Current progression
    maze: [[]], // 2D array (0=path, 1=wall)
    spatialGrid: [[]], // Grid mirror (30x30); not read by collision paths
    paused: false,
    consecutiveMouseClicks: 0, // Tracks mouse/touch-only mode for slowdown
    // ...other flags and timers
};
```

---

## 🔄 The Game Loop

The game uses a **Hybrid Update-Render Cycle**. While the graphics could run at 60 FPS, the movement is throttled to create that classic "grid-based" feel.

1. **Input Stage**: `handleDirectionChange` (keyboard), `handleMouseInput`, and `handleTouchInput` catch raw events.
2. **Update Stage**: `update()` moves the snake, clears old trail segments, and checks for collisions.
3. **Render Stage**: `drawGame()` clears the canvas and draws the grid, maze, pellets, trail, and finally the snake.

**Dynamic Speed Adjustments**: The game interval is computed fresh every frame by `calculateGameSpeed()`. It depends on:

- Snake length (a longer snake is a slower game)
- Level bands and level multipliers
- Power-ups active (speed boost, time slow, both together cancel)
- `MAX_TICK_INTERVAL_MS`, the longest tick interval (the slowest the snake gets)

---

## 🎯 Collision Detection: The Spatial Grid

To avoid the performance hit of checking every snake segment against every wall for every frame, the engine uses a **Spatial Grid**.

- **How it works**: A 2D array mirroring the 30x30 tile grid is filled from the maze at level start and refreshed on respawn.
- **Current reality**: No collision path reads it. Wall, body, and trail collisions read `gameState.maze`, `gameState.snake`, and `gameState.trail`. The grid is a mirror, not the lookup structure.
- **Consequence**: Do not add a collision check against `spatialGrid` without first making it authoritative (trail marks are written as `3` and are not cleared by `updateSpatialGrid`).

---

## 🔐 Deterministic Password Engine

Passwords are not stored in a database. Instead, they are **generated on the fly** using a deterministic algorithm seeded with the level number.

- **Formula**: `seed = (level * 9301 + 49297) % 233280`.
- **Result**: The same level always produces the same 6-character alphanumeric code.
- **Advantage**: Players can "save" their progress using a simple pen and paper, and the game requires zero local storage to function.
- **Known limit (documented, not fixed)**: the modulus makes the code repeat every 233,280 levels, so level L and level `L + 233280` share a code. Measured over the scan range: 23,328 unique codes for 100,000 levels. `tryPasswordTeleport` scans ascending and stops at the first match, so a code shared by a low level and a high level teleports to the low one (level 233,290 and level 10 both produce `VCS6KZ`). Levels below 233,280 are unaffected.
- **Scan cost**: the lookup runs only when the typed buffer is exactly 6 characters, which is the only length a code can have.

---

## 🎨 Rendering System: HTML5 Canvas

All graphics are drawn directly to two `<canvas>` elements:

1. **Main Canvas**: 600x600px grid (30x30 tiles) for the actual game.
2. **Minimap**: 100x100px scaled-down version that renders in the corner.

We use **Pure Vanilla JS** with the 2D Context (`ctx`). No WebGL or external libraries are required.

---

## 🛠️ How to Extend the Game

### **Adding a New Power-Up**

To add a new power-up (e.g., "Mega Shrink"), follow this pattern:

1.  **State**: Add `megaShrinkActive: false` and `megaShrinkTimer: 0` to `gameState`.
2.  **Generator**: Create a `generateMegaShrinks()` function (copy the logic from `generateMushrooms`).
3.  **Collision**: In `update()`, check if the head coordinate matches a mega-shrink.
4.  **Effect**: Set `megaShrinkActive = true` and reset its timer.
5.  **Logic**: Modify `update()` or `drawGame()` to react to the active state (e.g., reduce snake length).
6.  **UI**: Update `updatePasswordDisplay()` (or create a dedicated UI function) to show the new active power-up timer.

### **Adding a New Input**

All inputs are managed in `manageEventListeners`. If you add a new control:

1.  Add it to the whitelist in `handleDirectionChange` or `handlePasswordKey`.
2.  Ensure you call `e.preventDefault()` to avoid conflicting with browser behavior.
3.  If the input is not arrow keys, consider whether it should increment `consecutiveMouseClicks` for the slowdown mechanic.

**Mouse/Touch Specifics**: `handleMouseInput` and `handleTouchInput` compute the direction based on the click position relative to the snake head, then push to the `directionQueue`. They also manage the `consecutiveMouseClicks` counter, which arms the skip-turn and death-grace mechanics at 2+ clicks; it does not change the tick interval.

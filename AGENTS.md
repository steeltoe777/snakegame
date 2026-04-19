# Agent Guidelines for Snake Game

## Project Overview

This is a browser-based Snake game built with vanilla JavaScript. The project uses a canvas-based rendering system with game state managed through a centralized `gameState` object. No build step is required—just open `index.html` in a browser.

## Commands

### Testing

- Run all tests: `npm test`
- Run single test file: `npm test -- script.test.js` or `npm test -- password_system.test.js`
- Run test with pattern: `npm test -- "testNamePattern"`
- Run specific test: `npm test -- -t "test name"`
- Run test in watch mode: `npm test -- --watch` (not recommended for CI)
- Test setup file: `jest.setup.js` (configures jsdom environment)

### Linting

- Check for linting issues: `npm run lint`
- Linting command: `eslint . --ext .js --fix`
- ESLint config: Minimal custom rules in .eslintrc.json (no-undef: error, no-unused-vars: warn, no-const-assign: error)
- Prettier config: .prettierrc.js (semicolons, single quotes, 100 char width, 4 spaces)

### Project Scripts

- No build step required - browser-based JavaScript
- Dependencies are pre-installed in node_modules
- Main entry: `script.js`
- Tests: Jest with jsdom environment

## Code Style Guidelines

### General Principles

- Write clear, readable code with descriptive variable names
- Use named constants instead of magic numbers (see script.js for examples like GRID_SIZE, TILE_COUNT)
- Add helper functions to avoid code duplication
- Keep functions small and focused on a single task (30 lines or less preferred)
- Follow the DRY principle—extract repeated logic into reusable functions

### Formatting (Prettier)

- Semicolons: required
- Single quotes: prefer single quotes for strings
- Print width: 100 characters
- Tab width: 4 spaces (no tabs)
- Trailing commas: es5 compatible
- Config file: `.prettierrc.js`

### ESLint Configuration

- Minimal custom rules only (does NOT extend airbnb-base or prettier):
    - no-undef: error
    - no-unused-vars: warn
    - no-const-assign: error
- Environment: browser, es2021, node, jest

### Naming Conventions

- Variables and functions: camelCase (e.g., `snake`, `updateGame`)
- Constants: UPPER_SNAKE_CASE for magic number replacements (e.g., `GRID_SIZE`, `INITIAL_SPEED`)
- Functions: descriptive names describing what they do (e.g., `checkCollision`, `generateMaze`)
- Classes: PascalCase if used (e.g., `GameRenderer`)
- Boolean variables: use is/are/has prefixes (e.g., `isGameOver`, `hasPowerup`)

### Types and Values

- Use strict comparisons (=== and !==) instead of == and !=
- Use const for variables that don't change, let for mutable variables
- Avoid var in favor of const/let
- Initialize arrays with `[]` and objects with `{}`
- Use template literals for string interpolation

### Error Handling

- Check for null/undefined before accessing properties (use optional chaining or checks)
- Return early from functions when possible to reduce nesting
- Use fallback values when canvas/DOM elements may not be available
- Use defensive checks in test environments (JSDOM)
- Log errors to console with descriptive messages for debugging

### Imports and Modules

- No ES modules used - all code in single script.js file for file:// protocol compatibility
- Group related constants together at the top of files
- Use module patterns for game systems (e.g., passwordSystem object in script.js)
- Use named exports for utility functions (for testing only)

### Game State Management

- Use the centralized gameState object for all game variables
- Group related state properties together (position, dimensions, timing)
- Initialize state in a resetGame or levelUp function when needed
- Use performance.now() for accurate timer management
- Properties include: snake array, direction, score, level, powerups, maze configuration
- State properties:
    - `consecutiveMouseClicks: 0` - Tracks consecutive mouse/touch inputs to apply skip-turn precision mechanics at 2+ clicks. Reset to 0 when arrow keys or Space/Escape are used.
    - `skipNextMovement: false` - When true, the snake will not move on the next game tick. Set automatically after a direction change in mouse mode (consecutiveMouseClicks >= 2) to improve steering precision. Cleared when arrow keys or Space/Escape are used, or after the skip occurs.
    - `deathImminent: false` - When a collision would normally cause death in mouse mode (consecutiveMouseClicks >= 2), this flag is set to true and the death is delayed by one turn, allowing the player a final steering chance. If still colliding on the next tick, the game ends.
    - `pausedByPasswordInput: false` - Tracks whether the pause state was auto-triggered by the password input field gaining focus; used to selectively unpause when the input loses focus without overriding manual pauses.

### Testing Patterns

- Tests use Jest with jsdom environment
- Mock DOM elements when needed (see jest.setup.js)
- Use descriptive test names that explain what is being tested
- Test one thing per test case when possible
- Group related tests with describe blocks
- Use beforeEach/afterEach for test setup and cleanup

### Common Patterns in This Codebase

- Helper functions: getAvailableTiles(), getRandomPosition(), shouldBlockMovement(), tryRandomMovement()
- Generator functions: generateMaze(), generatePellets(), generateMushrooms(), generateShields(), generateLightningBolts(), generateHourglasses(), generateStars(), trySpawnPowerup()
- Draw functions: drawSnake(), drawMaze(), drawPellets(), drawTrail(), drawMushrooms(), drawShields(), drawLightningBolts(), drawHourglasses(), drawStars(), drawSuperPellets(), drawShieldEffect(), drawGame(), drawMinimap()
- Update functions: tick(), updatePowerupTimers(), updateSpatialGrid()
- Event listener management with add/remove pattern for cleanup
- Grid-based positioning with coordinate objects {x, y}
- Input handling: `handleDirectionChange()` (keyboard) resets mouse penalty; `handleMouseInput()` and `handleTouchInput()` increment counter that slows game after 2+ clicks.
- Password system: `updatePasswordDisplay()` syncs both the text display and the `#passwordInput` field. `handlePasswordInputChange()` processes on-screen input. `tryPasswordTeleport()` centralizes password matching logic.
- Special password commands: `RESTART` (case-insensitive) resets the game to level 1; `FORGET` (case-insensitive) clears the current password input and resets the stored milestone level; `HIDEPWD` (case-insensitive) hides the milestone password hint without clearing the milestone; `SHOWPWD` (case-insensitive) shows the milestone password hint if a milestone exists.
- Password input field: Clicks on it are ignored by the game to avoid accidental steering. Auto-pauses on focus; auto-unpauses on blur and sets `ignoreNextClick` to prevent the next click (the one that caused the blur) from turning the snake.

### Canvas and DOM Access

- Cache canvas and context references at module level for performance
- Check for element existence before accessing (e.g., minimapCanvas)
- Handle both browser and test environments gracefully
- Use requestAnimationFrame for game loop
- Clear canvas before each draw cycle

### File Structure

- `script.js`: Main game logic and state management
- `index.html`: Entry point with canvas and UI elements
- `*.test.js`: Test files (Jest convention—matching source file name)
- `jest.setup.js`: Test environment configuration
- Constants defined at module level in relevant files

### Common Bugs and Pitfalls

- Remember to remove event listeners when game ends or resets
- Check array bounds when accessing snake segments
- Handle edge cases where snake wraps around the grid
- Don't mutate the snake array directly during collision checks
- Ensure powerup timers are properly cleared on collection or expiration

### Performance Considerations

- Cache DOM element references at module level
- Use requestAnimationFrame instead of setInterval for game loop
- Throttle frequent operations like keyboard input handling
- Minimize canvas draw calls by batching similar operations
- Use spatial data structures for collision detection in larger grids

## Important Implementation Notes

- **No ES Modules**: The codebase intentionally avoids ES modules to maintain compatibility with the `file://` protocol. All code lives in `script.js`.
- **Single Global State**: The entire game state is managed by the global `window.gameState` object.
- **Spatial Grid**: Collision detection uses a 2D spatial grid (`gameState.spatialGrid`) for O(1) lookups instead of O(n²) searches.
- **Game Loop**: Uses `requestAnimationFrame` with a fixed timestep accumulator in `tick()` for consistent movement.
- **Power-up System**: Each powerup type (mushroom, shield, lightningBolt, hourglass, star) has its own generation function and collision logic. Spawning is throttled via `trySpawnPowerup()` with `lastSpawnTime` tracking.

## Key Functions Reference

### Core Game Loop

- `tick()` - Main update function called each game tick
- `drawGame()` - Renders all game elements to canvas
- `gameLoop(timestamp)` - RequestAnimationFrame loop with accumulator
- `calculateGameSpeed()` - Computes movement interval based on level, length, powerups

### Input Handling

- `handleDirectionChange(e)` - Keyboard arrow keys and pause (Space/Escape)
- `handleMouseInput(e)` - Mouse click anywhere on page (except buttons)
- `handleTouchInput(e)` - Touch on canvas only
- `handlePasswordKey(e)` - Alphanumeric keys for password entry
- `handlePasswordInputChange()` - On-screen password input field changes

### State Management

- `resetGame(level = 1)` - Full game reset
- `levelUp()` - Advance to next level, regenerate maze/pellets
- `gameOver()` / `realGameOver()` - Death handling with respawn logic
- `startGame()` / `stopGameLoop()` / `restartGameLoop()` - Game loop control

### Generation Functions

- `generateMaze()` - Create maze walls based on level
- `generatePellets()` - Spawn regular pellets
- `trySpawnSuperPellet()` - Spawn super-pellet when 1 pellet remains
- `generateMushrooms()` / `generateShields()` / `generateLightningBolts()` / `generateHourglasses()` / `generateStars()` - Powerup spawners
- `trySpawnPowerup(type)` - Unified throttled spawner for most powerups

### Collision & Movement

- `shouldBlockMovement(head)` - Checks walls/trail collisions with shield/mushroom handling
- `tryRandomMovement()` - AI fallback when snake is trapped but has shield
- `updateSpatialGrid()` - Maintain spatial grid for efficient collision

### Rendering

- `drawSnake()` / `drawTrail()` / `drawMaze()` / `drawPellets()`
- `drawMushrooms()` / `drawShields()` / `drawShieldEffect()` / `drawLightningBolts()` / `drawHourglasses()` / `drawStars()` / `drawSuperPellets`
- `drawMinimap()` - Radar in corner
- `updatePasswordDisplay()` - Sync password hint text and input field

### Password System (`passwordSystem` object)

- `generatePassword(level)` - Deterministic 6-char alphanumeric code
- `checkPassword(sequence, password)` - Validate typed sequence
- `addKey(key)` / `resetSequence()` - Manage typed buffer
- `tryPasswordTeleport()` - Handles teleportation and special commands (RESTART, FORGET, HIDEPWD, SHOWPWD)

### Utility

- `getAvailableTiles(gameState)` - Returns non-occupied tiles for spawning
- `getRandomPosition()` - Get random valid position with direction bias
- `calculateTileCount()` - Compute grid size from canvas dimensions
- `initializeSpatialGrid()` - Create spatial collision grid
- `resetPowerupTimestamps()` - Sync all powerup timers on unpause
- `saveRefreshState()` / `clearRefreshState()` / `startRefreshSaving()` / `stopRefreshSaving()` - Refresh penalty persistence

## Test Files

- `script.test.js` - Core game logic tests (initialization, level progression, game over, power-ups, timers)
- `password_system.test.js` - Password generation and validation tests
- `jest.setup.js` - mocks DOM environment (canvas, document, window)

## Current Configuration

- **ESLint**: Minimal custom rules (no external configs)
- **Prettier**: semi: true, singleQuote: true, printWidth: 100, tabWidth: 4, trailingComma: es5
- **Jest**: jsdom environment with setup file
- **No build step** - direct browser execution

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
- ESLint config extends: airbnb-base, prettier
- Custom rules in .eslintrc.json: no-undef (error), no-unused-vars (warn), no-const-assign (error)

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

- Extends: airbnb-base, prettier
- Environment: browser, es2021, node, jest
- Disabled rules (allowed in this codebase):
    - no-alert: alerts are used for game feedback
    - no-plusplus: ++ operators are permitted
    - no-param-reassign: parameter reassignment is acceptable
    - no-shadow: variable shadowing is permitted
    - no-use-before-define: hoisting is permitted
    - import/prefer-default-export: named exports are allowed
    - no-empty-function: empty functions allowed for mocks
    - global-require: require() allowed in tests
    - import/extensions: .js extensions allowed in imports

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

- Use ES modules (import/export) with .js extensions
- Group related constants together at the top of files
- Use module patterns for game systems (e.g., passwordSystem object in script.js)
- Import external modules first, then local modules
- Use named exports for utility functions

### Game State Management

- Use the centralized gameState object for all game variables
- Group related state properties together (position, dimensions, timing)
- Initialize state in a resetGame or levelUp function when needed
- Use performance.now() for accurate timing (see updatePowerupTimers)
- Properties to include: snake array, direction, score, level, powerups, maze configuration
- **New state properties**:
    - `consecutiveMouseClicks: 0` - Tracks consecutive mouse/touch inputs to apply slowdown (40% slower) and skip-turn precision mechanics at 2+ clicks. Reset to 0 when arrow keys are used.
    - `skipNextMovement: false` - When true, the snake will not move on the next game tick. Set automatically after a direction change in mouse mode (consecutiveMouseClicks >= 2) to improve steering precision. Cleared when arrow keys are used or after the skip occurs.
    - `deathImminent: false` - When a collision would normally cause death in mouse mode (consecutiveMouseClicks >= 2), this flag is set to true and the death is delayed by one turn, allowing the player a final steering chance. If still colliding on the next tick, the game ends.

### Testing Patterns

- Tests use Jest with jsdom environment
- Mock DOM elements when needed (see jest.setup.js)
- Use descriptive test names that explain what is being tested
- Test one thing per test case when possible
- Group related tests with describe blocks
- Use beforeEach/afterEach for test setup and cleanup

### Common Patterns in This Codebase

- Helper functions: getAvailableTiles(), getRandomPosition(), isValidPosition()
- Generator functions: generateMaze(), generatePellets(), generatePowerups()
- Draw functions: drawSnake(), drawMaze(), drawPellets(), drawUI()
- Update functions: updateSnake(), updatePowerupTimers(), checkCollisions()
- Event listener management with add/remove pattern for cleanup
- Grid-based positioning with coordinate objects {x, y}
- Input handling: Keyboard (arrow keys) resets mouse penalty; mouse/touch input increments counter that slows game after 2+ clicks. See `handleMouseInput()`, `handleTouchInput()`, and `handleDirectionChange()`.
- Password system: `updatePasswordDisplay()` syncs both the text display and the `#passwordInput` field. `handlePasswordInputChange()` processes on-screen input. `tryPasswordTeleport()` centralizes password matching logic.

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

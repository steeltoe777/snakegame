# API Documentation

## Overview
This document provides detailed API specifications for the Snake, Tron, Pac-Man Hybrid Game, designed for both human developers and AI coding assistants.

## Game State API

### Core State Object
**Location**: `script.js:50-100`

```javascript
const gameState = {
    // Snake properties
    snake: Array<{x: number, y: number}>,  // Snake segments (head first)
    dx: number,                            // Horizontal direction (-20, 0, 20)
    dy: number,                            // Vertical direction (-20, 0, 20)

    // Game progress
    score: number,                         // Current score (starts at 0)
    level: number,                         // Current level (starts at 1)

    // Game status
    gameRunning: boolean,                  // true = active, false = paused/over

    // Game elements
    maze: Array<Array<number>>,           // 2D grid: 0=empty, 1=wall
    pellets: Array<{x: number, y: number}>, // Pellet positions
    trail: Array<{x: number, y: number}>   // Trail segments to avoid
};
```

### State Management Functions

#### resetGame()
**Location**: `script.js:450-500`
- **Purpose**: Reset game to initial state
- **Side Effects**: 
  - Resets gameState to defaults
  - Regenerates maze and pellets
  - Clears canvas and redraws initial state
- **Usage**: Called on game over or manual restart

#### levelUp()
**Location**: `script.js:500-550`
- **Purpose**: Advance to next difficulty level
- **Behavior**:
  - Increments gameState.level
  - Increases game speed (reduces interval by 10ms)
  - Regenerates maze with more walls
  - Regenerates pellet positions
- **Triggers**: When all pellets are collected

### Canvas API

#### Canvas Configuration
**Location**: `script.js:15-25`

```javascript
const canvas = {
    element: HTMLCanvasElement,    // Canvas DOM element
    context: CanvasRenderingContext2D, // 2D rendering context
    width: 400,                    // Canvas width in pixels
    height: 400,                   // Canvas height in pixels
    gridSize: 20                   // Grid cell size in pixels
};
```

#### Drawing Functions

##### drawSnake()
**Location**: `script.js:200-220`
- **Purpose**: Render snake on canvas
- **Parameters**: Uses gameState.snake
- **Visual Style**: 
  - Head: Brighter color (#00ff00)
  - Body: Standard color (#008000)
  - Border: 1px outline for visibility

##### drawPellets()
**Location**: `script.js:220-240`
- **Purpose**: Render all pellets on canvas
- **Parameters**: Uses gameState.pellets
- **Visual Style**: 
  - Color: #ffff00 (yellow)
  - Shape: 15x15px squares centered in grid cells

##### drawMaze()
**Location**: `script.js:240-260`
- **Purpose**: Render maze walls on canvas
- **Parameters**: Uses gameState.maze
- **Visual Style**: 
  - Color: #0000ff (blue)
  - Shape: Full grid cell rectangles
  - Border: 2px outline for definition

##### drawTrail()
**Location**: `script.js:260-280`
- **Purpose**: Render trail segments as obstacles
- **Parameters**: Uses gameState.trail
- **Visual Style**: 
  - Color: #800080 (purple)
  - Transparency: 0.7 alpha for visual depth
  - Shape: 18x18px squares with rounded corners

### Game Logic API

#### Movement System

##### moveSnake()
**Location**: `script.js:300-320`
- **Purpose**: Update snake position based on direction
- **Algorithm**:
  1. Calculate new head position using dx/dy
  2. Add new head to snake array
  3. Remove tail if no pellet eaten
  4. Update trail with removed tail segment
- **Edge Cases**: Handles wall collision and self-collision

##### checkCollision()
**Location**: `script.js:320-340`
- **Purpose**: Detect collisions between snake and obstacles
- **Parameters**:
  - head: {x, y} - Snake head position
  - obstacles: Array<{x, y}> - Array of obstacle positions
- **Returns**: boolean - true if collision detected
- **Collision Types**:
  - Wall collision (maze boundaries)
  - Self-collision (snake body)
  - Trail collision (previous positions)

#### Generation Functions

##### generateMaze(level)
**Location**: `script.js:350-400`
- **Purpose**: Create maze layout for given level
- **Parameters**: 
  - level: number - Current game level (1+)
- **Algorithm**:
  1. Always include outer walls
  2. Add internal walls based on level
  3. Ensure at least one valid path exists
  4. Return 2D array (20x20) with 0=empty, 1=wall

##### generatePellets(maze, count)
**Location**: `script.js:400-420`
- **Purpose**: Generate pellet positions in valid maze locations
- **Parameters**:
  - maze: Array<Array<number>> - Current maze layout
  - count: number - Number of pellets to generate
- **Returns**: Array<{x, y}> - Valid pellet positions
- **Constraints**: 
  - Pellets cannot be on walls
  - Pellets cannot overlap snake starting position
  - Pellets should be reasonably distributed

### Input Handling API

#### Keyboard Events
**Location**: `script.js:550-570`

##### Event Types
- **keydown**: Arrow key presses for direction control
- **Space**: Start/restart game

##### Direction Mapping
```javascript
const keyMappings = {
    'ArrowUp': {dx: 0, dy: -20},
    'ArrowDown': {dx: 0, dy: 20},
    'ArrowLeft': {dx: -20, dy: 0},
    'ArrowRight': {dx: 20, dy: 0}
};
```

##### Validation Rules
- Prevent 180-degree turns (cannot reverse direction)
- Ignore input when game is not running
- Debounce rapid key presses

### Testing API

#### Test Utilities
**Location**: `script.test.js:1-100`

##### Mock Setup
```javascript
// JSDOM setup for canvas testing
global.HTMLCanvasElement = mockCanvas;
global.CanvasRenderingContext2D = mockContext;
```

##### Test Helpers
- **createMockGameState()**: Returns fresh game state object
- **simulateKeyPress(key)**: Simulates keyboard input
- **advanceGameFrames(count)**: Advances game by specified frames

#### Test Categories

##### Unit Tests
- **Snake Movement**: Test moveSnake() with various inputs
- **Collision Detection**: Test checkCollision() edge cases
- **Maze Generation**: Test generateMaze() output validity
- **Pellet Generation**: Test generatePellets() distribution

##### Integration Tests
- **Game Flow**: Test complete game lifecycle
- **Level Progression**: Test levelUp() behavior
- **Game Over**: Test gameOver() and restart flow
- **Input Handling**: Test keyboard event processing

### Configuration API

#### Game Settings
**Location**: `script.js:25-35`

```javascript
const gameConfig = {
    // Timing
    baseSpeed: 150,           // Base game speed in ms
    speedIncrement: 10,       // Speed increase per level
    minSpeed: 50,            // Minimum game speed

    // Grid
    gridSize: 20,            // Grid cells (20x20)
    cellSize: 20,            // Pixels per grid cell

    // Scoring
    pelletValue: 10,         // Points per pellet
    levelBonus: 100,         // Bonus points per level

    // Visual
    colors: {
        snake: '#00ff00',
        pellets: '#ffff00',
        walls: '#0000ff',
        trail: '#800080'
    }
};
```

### Error Handling API

#### Validation Functions

##### isValidPosition(position)
**Location**: `script.js:340-350`
- **Purpose**: Validate if position is within game bounds
- **Parameters**: position: {x, y}
- **Returns**: boolean - true if position is valid
- **Bounds**: 0 ≤ x < 20, 0 ≤ y < 20

##### isValidDirection(newDx, newDy)
**Location**: `script.js:570-580`
- **Purpose**: Validate direction change
- **Parameters**: 
  - newDx: number - Proposed horizontal direction
  - newDy: number - Proposed vertical direction
- **Returns**: boolean - true if direction change is valid
- **Rules**: Cannot reverse current direction (180-degree turn)

### Extension Points

#### Adding New Features

##### Power-ups System
```javascript
// Extend gameState to include power-ups
gameState.powerUps = [
    {type: 'speed', position: {x, y}, duration: 5000},
    {type: 'invincible', position: {x, y}, duration: 3000}
];
```

##### Multiplayer Support
```javascript
// Extend gameState for multiple players
gameState.players = [
    {snake: [...], dx: 20, dy: 0, score: 0, color: '#00ff00'},
    {snake: [...], dx: -20, dy: 0, score: 0, color: '#ff0000'}
];
```

### Performance Considerations

#### Rendering Optimization
- **Batch drawing**: All elements drawn in single frame
- **Minimal DOM manipulation**: Canvas-based rendering
- **Efficient collision detection**: Grid-based calculations

#### Memory Management
- **Trail cleanup**: Trail segments automatically removed
- **State pruning**: Old game states not retained
- **Canvas clearing**: Full clear each frame for simplicity

---

**Note**: This API documentation is designed for both human developers and AI coding assistants. All line numbers refer to the current version of the codebase.
# API Reference

## 📖 How to Use This Guide

This API reference documents all the major functions in the game. I've included some "from experience" notes that might save you some debugging time!

**Pro tip:** The game state object is the heart of everything - most functions either read from or modify gameState.

## Global Functions

### Game Control Functions

#### `startGame()`

**Purpose**: Initialize and start a new game session  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: void  
**Side Effects**:

- Resets gameState to initial values
- Generates new maze and pellets
- Starts game loop interval

#### `resetGame()`

**Purpose**: Reset game to initial state  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: void  
**Side Effects**:

- Clears game loop interval
- Resets all game state variables
- Hides game over overlay
  **Note from experience:** This function resets ALL game state, so be careful when calling it during debugging. If you call it multiple times, you'll get overlapping intervals that can cause performance issues.

**Common gotcha:** The game loop interval isn't cleared automatically, so make sure to call resetGame() first if you need to restart.
**Note from experience:** This is your "safe" reset function. Unlike startGame(), it properly clears the game loop interval first. Use this when you need to reset without causing interval stacking.

**Debugging tip:** If the game seems to be running too fast, you might have forgotten to call this before startGame().

#### `gameOver()`

**Purpose**: Handle game over state  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: void  
**Side Effects**:

- Sets gameState.gameOver = true
- Displays game over overlay
- Shows final score

### Game Loop Functions

**Note from experience:** This function handles the graceful shutdown. It shows the game over overlay but doesn't reset the game state completely - that's what resetGame() is for.

**UI quirk:** The game over screen uses absolute positioning, so if you modify the canvas size, you might need to update the overlay CSS too.

#### `update()`

**Purpose**: Main game loop update function  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: void  
**Called by**: setInterval() every 16.67ms (60 FPS)  
**Flow**:

1. Check if game is over
2. Update snake position
3. Check collisions
4. Handle food collection
5. Update score and level

#### `drawGame()`

**Purpose**: Render complete game frame  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: void  
**Rendering Order**:

1. Clear canvas
2. Draw maze
3. Draw pellets
4. Draw snake
5. Draw UI elements

### Rendering Functions

#### `drawSnake()`

**Purpose**: Render snake on canvas  
**Location**: Update approximate line references  
**Parameters**: None  
**Accesses**: gameState.snake, gameState.tileCount  
**Style**: Green rectangles with black border

#### `drawMaze()`

**Purpose**: Render maze obstacles  
**Location**: Update approximate line references  
**Parameters**: None  
**Accesses**: gameState.maze, gameState.tileCount  
**Style**: Gray rectangles

#### `drawPellets()`

**Purpose**: Render collectible pellets  
**Location**: Update approximate line references  
**Parameters**: None  
**Accesses**: gameState.pellets, gameState.tileCount  
**Style**: Yellow circles

#### `drawTrail()`

**Purpose**: Render snake trail effect  
**Location**: Update approximate line references  
**Parameters**: None  
**Accesses**: gameState.snake  
**Style**: Blue trail (rainbow during mushroom power-up)

### Generation Functions

#### `generateMaze()`

**Purpose**: Create maze obstacles for current level  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: 2D array (maze grid)  
**Algorithm**: Deterministic generation based on level seed  
**Complexity**: O(n²) where n = tileCount

#### `generatePellets()`

**Purpose**: Place collectible pellets on valid positions  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: Array of pellet positions  
**Algorithm**: Random placement avoiding obstacles  
**Count**: 5 pellets per level

#### `getRandomPosition()`

**Purpose**: Get valid random position on game grid  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: Object {x, y}  
**Constraints**: Must be empty space (not snake, food, or obstacle)

### Utility Functions

#### `calculateTileCount()`

**Purpose**: Calculate optimal tile count based on canvas size  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: Integer (tile count)  
**Formula**: Math.floor(canvas.width / 30)

#### `levelUp()`

**Purpose**: Progress to next level  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: void  
**Effects**:

- Increments gameState.level
- Generates new maze and pellets
- Updates password display

### Password System Functions

#### `generatePassword(level)`

**Purpose**: Generate deterministic password for given level  
**Location**: Update approximate line references  
**Parameters**:

- `level` (number): Current level number  
  **Returns**: String (6-character password)  
  **Algorithm**: Deterministic pseudo-random generation  
  **Characters**: A-Z, 0-9

#### `updatePasswordDisplay()`

**Purpose**: Update password display in UI  
**Location**: Update approximate line references  
**Parameters**: None  
**Returns**: void  
**Accesses**: gameState.password, DOM element #password

### Input Handling Functions

#### `handleDirectionChange(event)`

**Purpose**: Process keyboard input for snake movement  
**Location**: Update approximate line references  
**Parameters**:

- `event` (KeyboardEvent): Key press event  
  **Returns**: void  
  **Valid Keys**: Arrow keys (Up, Down, Left, Right)  
  **Validation**: Prevents 180-degree turns

#### `handlePasswordKey(event)`

**Purpose**: Handle password input for level skipping  
**Location**: Update approximate line references  
**Parameters**:

- `event` (KeyboardEvent): Key press event  
  **Returns**: void  
  **Functionality**: Validates password and jumps to corresponding level

## Event Listeners

### Keyboard Events

- **keydown**: `handleDirectionChange()` - Arrow key movement
- **keydown**: `handlePasswordKey()` - Password input

### DOM Events

- **load**: Initialize game on page load
- **click**: Restart button handler

## Global Variables

### Canvas Context

- **canvas**: HTML5 Canvas element (600x600px)
- **ctx**: 2D rendering context

### Game State

- **gameState**: Primary state object (see Architecture.md)
- **gameLoop**: setInterval reference for game loop

### Styling Constants

- **SNAKE_COLOR**: "#00FF00" (green)
- **FOOD_COLOR**: "#FF0000" (red)
- **MAZE_COLOR**: "#808080" (gray)
- **PELLET_COLOR**: "#FFFF00" (yellow)

## 🍄 Mushroom System Functions

### `generateMushrooms()`

**Purpose**: Generate initial mushrooms for powerups at level start
**Parameters**: None
**Returns**: Void
**Behavior**: Spawns 1-4 mushrooms on higher levels (level >= 5) with 30% probability
**Constraints**: Only places mushrooms on empty tiles not occupied by snake, pellets, or walls

### `spawnRandomMushroom()`

**Purpose**: Randomly spawn mushrooms during gameplay
**Parameters**: None
**Returns**: Void
**Behavior**: Has 1% chance per frame to spawn a mushroom on levels >= 3
**Note**: Uses performance.now() for accurate timing

### `drawMushrooms()`

**Purpose**: Render mushrooms on the game canvas
**Parameters**: None
**Returns**: Void
**Visuals**: Draws brown mushrooms with white spots for authentic appearance

### Mushroom Powerup Mechanics

- **Duration**: 8 seconds of powerup time
- **Effects**: Snake can pass through walls, grows when eating mushrooms
- **Timer**: Uses performance-based timing for accurate countdown
- **Visual Indicator**: Timer bar shown when powerup is active

**Pro tip**: The mushroom system was added through iterative development and includes collision bypass, visual effects, and strategic gameplay elements!

### `calculateGameSpeed()`

**Purpose**: Calculate dynamic game speed based on snake length and level
**Location**: Update approximate line references  
**Parameters**: None
**Returns**: Integer (milliseconds for game update interval)
**Algorithm**:

- Base calculation: speed = baseSpeed + snakeLength \* 2
- Level-based speed limits:
    - Level 5+: 120ms minimum
    - Level 10+: 140ms minimum
    - Level 15+: 160ms minimum
    - Level 20+: 180ms minimum
- Applies modifiers for active powerups (speed boost, time slow)
  **Note**: Uses Math.max(speed, maxSpeed) to ensure minimum speed limits are maintained

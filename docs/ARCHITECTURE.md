# Architecture Documentation

## System Overview

The Snake Game follows a **State-Driven Architecture** pattern with clear separation of concerns:

### Core Architecture Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│         (index.html + style.css)        │
├─────────────────────────────────────────┤
│            Game Engine Layer            │
│              (script.js)                │
│  ┌─────────────────────────────────────┐ │
│  │         Game State Manager          │ │
│  │         Rendering Engine            │ │
│  │         Input Handler               │ │
│  │         Collision Detection         │ │
│  │         Level Generator             │ │
│  └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│            Testing Layer                │
│           (script.test.js)              │
└─────────────────────────────────────────┘
```

## Game Loop Architecture

### Update Cycle (60 FPS)
```
1. Process Input → 2. Update State → 3. Check Collisions → 4. Render Frame
```

### State Management Pattern
- **Single Source of Truth**: All game state in `gameState` object
- **Immutable Updates**: State changes through controlled functions
- **Event-Driven**: Keyboard input triggers state transitions
- **Frame-Based**: Consistent 60 FPS update cycle

## Component Architecture

### 1. Game State Manager
**Component**: Game State Manager
**File**: script.js
```javascript
```javascript
const gameState = {
    // Snake properties
    snake: [{x: 10, y: 10}],
    dx: 0, dy: 0,

    // Game objects
    food: {x: 15, y: 15},
    maze: [],
    pellets: [],

    // Game progression
    score: 0,
    level: 1,
    password: "",

    // State flags
    gameOver: false,
    paused: false
}
```

### 2. Rendering Engine
**Functions**: `drawGame()`, `drawSnake()`, `drawMaze()`, `drawPellets()`
- **Canvas API**: 2D rendering context
- **Layered Rendering**: Background → Maze → Pellets → Snake → UI
- **Optimized Drawing**: Minimal redraw operations

### 3. Input Handler
**Function**: `handleDirectionChange(event)`
- **Event Type**: KeyboardEvent (Arrow keys)
- **Debouncing**: Prevents rapid direction changes
- **Validation**: Prevents 180-degree turns

### 4. Collision Detection
**Functions**: `checkCollision()`, `checkFoodCollision()`, `checkWallCollision()`
- **Grid-Based**: 20x20 tile system
- **Efficient Checking**: O(1) complexity per frame
- **Comprehensive**: Snake-to-wall, snake-to-self, snake-to-food

### 5. Level Generator
**Functions**: `generateMaze()`, `generatePellets()`, `getRandomPosition()`
- **Procedural Generation**: Deterministic based on level seed
- **Balanced Difficulty**: Increasing complexity per level
- **Valid Position Guarantee**: Collision-free placement

## Data Flow

### Input Flow
```
Keyboard Event → handleDirectionChange() → Update gameState.dx/dy → Update cycle
```

### Game Loop Flow
```
setInterval() → update() → [Collision Check] → [State Update] → drawGame() → Render
```

### Password System Flow
```
Level Complete → generatePassword() → Update gameState.password → Display to user
```

## Memory Management

### Object Lifecycle
- **Game State**: Persistent throughout session
- **Maze Data**: Regenerated per level
- **Pellets**: Regenerated per level
- **Snake**: Reset on game over

### Performance Optimization
- **Efficient Arrays**: Pre-allocated where possible
- **Minimal GC Pressure**: Reuse objects when feasible
- **Optimized Rendering**: Only redraw changed elements

## Error Handling

### Input Validation
- **Boundary Checking**: Prevent out-of-bounds access
- **Direction Validation**: Prevent invalid moves
- **State Consistency**: Ensure valid game state transitions

### Recovery Mechanisms
- **Game Over**: Clean reset to initial state
- **Level Progression**: Preserves score, resets level-specific data
- **Error Logging**: Console output for debugging

## 🏗️ System Architecture Patterns

### Design Patterns Used
- **Module Pattern**: Game functionality organized into logical modules (state, rendering, input, collision)
- **Observer Pattern**: Event-driven architecture for game state changes and UI updates
- **Factory Pattern**: Level and maze generation using factory functions
- **Strategy Pattern**: Configurable collision detection and rendering strategies

### Data Flow Architecture
- **Unidirectional Data Flow**: User input → Game state update → Rendering → Display
- **Immutable State Updates**: Game state changes create new state objects rather than mutating existing ones
- **Event-Driven Updates**: Canvas rendering triggered by state change events

### Performance Optimization Patterns
- **Spatial Partitioning**: Grid-based collision detection for O(1) lookups
- **Object Pooling**: Reusable game object instances to minimize garbage collection
- **Debounced Input**: Input handling with timing controls to prevent overflow

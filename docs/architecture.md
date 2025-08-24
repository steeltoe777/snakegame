# Architecture Overview - AI-Enhanced Guide

## 🏗️ System Architecture

### High-Level Structure
This document provides a comprehensive architectural overview designed for both human developers and AI coding assistants working on the Snake, Tron, Pac-Man Hybrid Game.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   index.html    │  │   style.css     │  │ script.js   │ │
│  │   Structure     │  │   Styling       │  │   Logic     │ │
│  │   (27 lines)    │  │   (80 lines)    │  │   (672)     │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │
│           │                   │                   │        │
│  ┌────────┴───────────────────┴───────────────────┴──────┐ │
│  │                  HTML5 Canvas                          │ │
│  │              400×400px Rendering                       │ │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐ │ │
│  │  │   Game Loop     │  │    Rendering Pipeline       │ │ │
│  │  │   (60 FPS)      │  │  drawSnake → drawPellets    │ │ │
│  │  │   update()      │  │  → drawMaze → drawTrail     │ │ │
│  │  └─────────────────┘  └─────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Core Components

### 1. Presentation Layer (index.html)
**File**: `index.html` (27 lines)
- **Purpose**: HTML structure and game container
- **Key Elements**:
  - Canvas element (400×400px)
  - Score display
  - Level indicator
  - Game over overlay
- **AI Note**: Minimal structure, all dynamic content handled by JavaScript

### 2. Styling Layer (style.css)
**File**: `style.css` (80 lines)
- **Purpose**: Visual design and layout
- **Design System**:
  - **Color Palette**: Tron-inspired neon colors
  - **Typography**: Monospace fonts for retro feel
  - **Layout**: Centered game area with responsive margins
- **AI Note**: CSS custom properties for easy theme modification

### 3. Game Logic Layer (script.js)
**File**: `script.js` (672 lines)
- **Purpose**: Complete game implementation
- **Architecture Pattern**: Single-responsibility functions

#### Module Structure
```javascript
// State Management (lines 50-100)
const gameState = { /* centralized state */ };

// Game Loop (lines 400-450)
function update() { /* main game loop */ }

// Rendering (lines 200-280)
function drawSnake() { /* snake rendering */ }
function drawPellets() { /* pellet rendering */ }
function drawMaze() { /* maze rendering */ }
function drawTrail() { /* trail rendering */ }

// Game Logic (lines 300-350)
function moveSnake() { /* movement logic */ }
function checkCollision() { /* collision detection */ }

// Generation (lines 350-420)
function generateMaze() { /* maze creation */ }
function generatePellets() { /* pellet placement */ }

// Input Handling (lines 550-580)
function handleKeyPress() { /* keyboard input */ }
```

## 🎯 Data Flow Architecture

### Event-Driven Flow
```
User Input → Event Handler → State Update → Render → Display
    ↓           ↓            ↓          ↓        ↓
Keyboard   keydown()    gameState    Canvas   Browser
Arrows     Direction    Modified     Draw     Display
```

### State Management Pattern
```javascript
// Centralized State Object
const gameState = {
    // Snake properties
    snake: [{x: 10, y: 10}],    // Head + body segments
    dx: 20, dy: 0,              // Direction vectors

    // Game progress
    score: 0,                   // Current score
    level: 1,                   // Current level

    // Game elements
    maze: [],                   // Wall positions
    pellets: [],               // Collectible items
    trail: [],                 // Obstacle trail

    // Game status
    gameRunning: false         // Game state flag
};
```

## 🔄 Game Loop Architecture

### Update Cycle (60 FPS)
```javascript
function update() {
    // 1. Process Input
    const direction = getCurrentDirection();

    // 2. Update Game State
    const newHead = calculateNewHead(direction);

    // 3. Check Collisions
    if (checkCollision(newHead)) {
        gameOver();
        return;
    }

    // 4. Update Positions
    moveSnake(newHead);

    // 5. Check Pellet Collection
    if (pelletCollected()) {
        increaseScore();
        if (allPelletsCollected()) {
            levelUp();
        }
    }

    // 6. Render Frame
    render();

    // 7. Schedule Next Frame
    setTimeout(update, currentSpeed);
}
```

## 🎮 Rendering Pipeline

### Canvas Rendering Order
1. **Clear Canvas** - Remove previous frame
2. **Draw Maze** - Static walls and boundaries
3. **Draw Pellets** - Collectible items
4. **Draw Trail** - Dynamic obstacles
5. **Draw Snake** - Player character
6. **Draw UI** - Score and level display

### Visual Specifications
```
Canvas: 400×400px
Grid: 20×20 cells (20px each)
Colors:
  - Snake: #00ff00 (green)
  - Pellets: #ffff00 (yellow)
  - Walls: #0000ff (blue)
  - Trail: #800080 (purple)
```

## 🧪 Testing Architecture

### Test Structure
**File**: `script.test.js` (501 lines)
- **Test Framework**: Jest with JSDOM
- **Test Categories**:
  - Unit tests (individual functions)
  - Integration tests (game flow)
  - Visual tests (rendering)

### Test Organization
```
script.test.js
├── Setup & Mocking (lines 1-100)
├── Game State Tests (lines 100-200)
├── Movement Tests (lines 200-300)
├── Collision Tests (lines 300-400)
├── Level Progression Tests (lines 400-500)
└── Edge Case Tests (lines 500-501)
```

## 🔍 Extension Architecture

### Plugin System Design
The architecture supports easy extension through:

#### 1. State Extension
```javascript
// Adding new game elements
gameState.newFeature = {
    enabled: true,
    value: 0
};
```

#### 2. Rendering Extension
```javascript
// Adding new visual elements
function drawNewFeature() {
    // Custom rendering logic
}
```

#### 3. Logic Extension
```javascript
// Adding new game mechanics
function handleNewFeature() {
    // Custom game logic
}
```

## 🚀 Performance Considerations

### Optimization Strategies
- **Efficient Collision Detection**: Grid-based calculations
- **Minimal DOM Manipulation**: Canvas-based rendering
- **Memory Management**: Automatic trail cleanup
- **State Pruning**: No historical state retention

### Performance Metrics
- **Target FPS**: 60 frames per second
- **Memory Usage**: <10MB for complete game
- **Load Time**: <100ms for initial render
- **Input Latency**: <16ms for responsive controls

## 🔧 Development Workflow

### For AI Agents
1. **Understand State**: Start with gameState object
2. **Follow Flow**: Trace update() function execution
3. **Test Changes**: Use existing test suite
4. **Visual Verification**: Run game in browser
5. **Documentation**: Update relevant docs

### Code Organization Principles
- **Single Responsibility**: Each function has one purpose
- **Descriptive Naming**: Clear, self-documenting names
- **Consistent Patterns**: Uniform structure throughout
- **Test Coverage**: All logic has corresponding tests

## 📊 Technical Specifications

### Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Dependencies
- **Runtime**: None (vanilla JavaScript)
- **Development**: Jest, ESLint, Prettier
- **Testing**: JSDOM for browser API mocking

### File Size Limits
- **Maximum per file**: 500 lines
- **Function size**: Prefer <50 lines
- **Test coverage**: >90% for game logic

---

*This architecture is designed for both human developers and AI coding assistants. For AI-specific guidance, see [AGENTIC.md](AGENTIC.md)*
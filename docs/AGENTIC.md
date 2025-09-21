# AGENTIC.md - AI Agent Development Guide

## Overview
This guide is specifically designed for AI coding assistants working on the Snake, Tron, Pac-Man Hybrid Game. It provides structured information to help you understand, modify, and extend the codebase efficiently.

## Quick Start for AI Agents

### 1. Project Context
- **Game Type**: Web-based Snake/Tron/Pac-Man hybrid
- **Tech Stack**: Vanilla JavaScript, HTML5 Canvas, CSS3
- **Architecture**: Single-page application with modular functions
- **Testing**: Jest with JSDOM for unit/integration tests

### 2. Key Entry Points

#### Game Initialization Flow
```
index.html → script.js → init() → gameLoop()
```

#### Core Objects and Their Locations
- **gameState**: Lines 50-100 in script.js - Central state management
- **Canvas Context**: Line 20 in script.js - 2D rendering context
- **Game Loop**: Lines 400-450 in script.js - Main update cycle
- **Event Handlers**: Lines 300-350 in script.js - Input handling

### 3. Code Structure Map

#### File Organization
```
/a0/projects/snakegame/
├── index.html          # Entry point (27 lines)
├── style.css          # Styling (80 lines)
├── script.js          # Core logic (672 lines)
├── script.test.js     # Tests (501 lines)
├── package.json       # Dependencies (25 lines)
├── LLMs.txt          # AI navigation (you are here)
└── docs/
    ├── AGENTIC.md     # This file
    ├── architecture.md # System overview
    └── design.md      # Design decisions
```

#### Function Categories
- **Game Logic**: update(), moveSnake(), checkCollision()
- **Rendering**: drawSnake(), drawPellets(), drawMaze()
- **State Management**: resetGame(), levelUp(), gameOver()
- **Generation**: generateMaze(), generatePellets()
- **Input**: keydown event handlers

### 4. AI-Friendly Code Patterns

#### State Management Pattern
```javascript
// Centralized state object - always modify through this
const gameState = {
    snake: [{x: 10, y: 10}],  // Array of {x, y} objects
    dx: 20,                   // Direction x
    dy: 0,                    // Direction y
    score: 0,                 // Current score
    level: 1,                 // Current level
    gameRunning: false,       // Game state
    maze: [],                 // 2D array of walls
    pellets: [],             // Array of pellet positions
    trail: []                // Array of trail segments
};
```

#### Function Documentation Template
```javascript
/**
 * Brief description of function purpose
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * @example
 * // Example usage
 * functionName(paramValue);
 */
```

### 5. Testing Strategy for AI Agents

#### Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **Game Logic Tests**: End-to-end game scenarios

#### Test File Structure
- **Lines 1-100**: Setup and mocking
- **Lines 100-300**: Unit tests for individual functions
- **Lines 300-500**: Integration tests for game flow

### 6. Modification Guidelines for AI Agents

#### When Adding Features
1. **Check existing tests** - Understand expected behavior
2. **Update tests first** - Write failing tests for new features
3. **Implement feature** - Make tests pass
4. **Run full test suite** - Ensure no regressions
5. **Update documentation** - Keep docs in sync

#### Code Style Requirements
- **Line Length**: Keep under 80 characters
- **Function Length**: Prefer functions under 50 lines
- **File Length**: Keep individual files under 500 lines
- **Naming**: Use descriptive camelCase for variables/functions
- **Comments**: Add JSDoc for all public functions

#### Common Patterns to Follow
```javascript
// Preferred: Modular functions
function checkCollision(head, obstacles) {
    return obstacles.some(obstacle => 
        head.x === obstacle.x && head.y === obstacle.y
    );
}

// Avoid: Monolithic functions
function handleEverything() {
    // Too much logic in one place
}
```

### 7. Canvas and Game Constants

#### Grid System
- **Canvas Size**: 400x400 pixels
- **Grid Size**: 20x20 pixels per cell
- **Grid Cells**: 20x20 grid (400 total cells)

#### Game Speed
- **Base Speed**: 150ms per move
- **Speed Increase**: 10ms reduction per level
- **Minimum Speed**: 50ms per move

### 8. Error Handling Patterns

#### Input Validation
```javascript
function isValidDirection(newDx, newDy) {
    // Prevent 180-degree turns
    return !(newDx === -gameState.dx && newDy === -gameState.dy);
}
```

#### Boundary Checking
```javascript
function isOutOfBounds(position) {
    return position.x < 0 || position.x >= 20 || 
           position.y < 0 || position.y >= 20;
}
```

### 9. Development Workflow for AI Agents

#### Step 1: Understand Current State
- Run tests: `npm test`
- Check linting: `npm run lint`
- Play the game: Open index.html in browser

#### Step 2: Plan Changes
- Write tests for new behavior first
- Identify which functions need modification
- Check file length limits (500 lines max)

#### Step 3: Implement Changes
- Make smallest possible changes
- Run tests after each change
- Update documentation immediately

#### Step 4: Validate Changes
- All tests must pass
- Linting must pass
- Game must be playable
- Documentation must be updated

### 10. AI-Specific Tips

#### Context Window Optimization
- Focus on relevant files only
- Use function names as context anchors
- Reference specific line numbers when discussing code

#### Understanding Game Logic
- Start with gameState object to understand current state
- Follow the update() function to understand game flow
- Check generateMaze() for level generation logic
- Review collision detection in checkCollision()

#### Common Extension Points
- **New game modes**: Modify gameState and update()
- **Power-ups**: Add to pellets array with special properties
- **Multiplayer**: Extend gameState to track multiple snakes
- **Sound**: Add audio context and sound effects

### 11. Quick Reference Commands

```bash
# Run all tests
npm test

# Check code style
npm run lint

# Format code
npm run format

# Launch game
xdg-open index.html

# Check test coverage
npm run test -- --coverage
```

### 12. Getting Help

If you need clarification on any part of the codebase:
1. Check this AGENTIC.md file first
2. Review the test files for expected behavior
3. Check LLMs.txt for navigation
4. Run the game to understand user experience

# Snake Game - Agentic Documentation

> **AI-Agent Optimized Documentation** - Factual, structured, and machine-readable

## 🎯 Project Overview

**Snake Game** is a modern web-based implementation featuring classic snake gameplay with advanced maze generation, password-based level progression, and responsive design.

### 📊 Project Facts
- **Language**: JavaScript (ES6+)
- **Platform**: Web Browser
- **Canvas**: HTML5 Canvas API
- **Testing**: Jest with jsdom
- **Linting**: ESLint + Prettier
- **Architecture**: Modular game state management

## 🏗️ Architecture & Design

### Core Components

| Component | File | Purpose | Lines |
|-----------|------|---------|-------|
| **Game Engine** | `script.js` | Main game logic | 673 |
| **UI Structure** | `index.html` | HTML layout | 28 |
| **Styling** | `style.css` | Visual design | 81 |
| **Testing** | `script.test.js` | Unit tests | 501 |

### Game State Architecture

```javascript
const gameState = {
    snake: [{x: 10, y: 10}],     // Snake segments
    dx: 0, dy: 0,               // Direction vectors
    food: {x: 15, y: 15},       // Food position
    score: 0,                   // Current score
    level: 1,                   // Current level
    gameOver: false,            // Game state flag
    tileCount: 20,              // Grid dimensions
    maze: [],                   // Maze obstacles
    pellets: [],                // Collectible items
    password: "",               // Level password
    // ... additional state properties
}
```

## 🎮 Game Features

### Core Mechanics
- **Snake Movement**: 4-directional movement with collision detection
- **Food Collection**: Random food placement, score increment
- **Growth System**: Snake grows by 1 segment per food item
- **Collision Detection**: Wall, self, and obstacle collision
- **Game Over**: Restart mechanism with score preservation

### Advanced Features
- **Maze Generation**: Procedural maze creation per level
- **Password System**: Level progression via 6-character passwords
- **Pellet Collection**: Additional collectible items for bonus points
- **Level Scaling**: Increasing difficulty with level progression
- **Responsive Design**: Adaptive canvas sizing

### Password System
- **Algorithm**: Deterministic password generation based on level seed
- **Format**: 6-character alphanumeric (A-Z, 0-9)
- **Purpose**: Level skipping and progression tracking
- **Display**: Real-time password updates during gameplay

## 🚀 Getting Started

### Prerequisites
- Modern web browser with HTML5 Canvas support
- Node.js (for development/testing)

### Installation
```bash
# Clone or navigate to project
cd /a0/projects/snakegame/

# Install dependencies (if needed)
npm install

# Run tests
npm test

# Run linting
npm run lint
```

### Running the Game
1. Open `index.html` in any modern web browser
2. Use arrow keys to control the snake
3. Collect food to grow and increase score
4. Avoid walls, obstacles, and self-collision
5. Use passwords to skip to higher levels

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Game logic, state management, utility functions
- **Integration Tests**: Game loop, rendering, user input
- **Edge Cases**: Boundary conditions, collision scenarios

### Test Commands
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 📁 File Structure

```
snakegame/
├── index.html          # Main HTML structure
├── script.js          # Core game logic
├── style.css          # Styling and layout
├── script.test.js     # Test suite
├── package.json       # Project configuration
├── jest.config.js     # Test configuration
├── jest.setup.js      # Test setup
├── .eslintrc.js       # Linting rules
├── .prettierrc.js     # Code formatting
└── node_modules/      # Dependencies
```

## 🎯 Development Guidelines

### Code Style
- **ESLint**: Enforces consistent code style
- **Prettier**: Automatic code formatting
- **Jest**: Testing framework with jsdom

### Key Functions (Agent Reference)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `startGame()` | Initialize new game | None | void |
| `update()` | Main game loop update | None | void |
| `drawGame()` | Render game state | None | void |
| `handleDirectionChange(e)` | Process user input | KeyboardEvent | void |
| `generateMaze()` | Create level obstacles | None | void[][] |
| `generatePellets()` | Place collectible items | None | void |
| `getRandomPosition()` | Get valid random position | None | {x, y} |
| `gameOver()` | Handle game end | None | void |
| `levelUp()` | Progress to next level | None | void |
| `resetGame()` | Reset game state | None | void |

### State Management
- **Immutable Updates**: State changes through controlled functions
- **Event-Driven**: Keyboard input handling
- **Frame-Based**: 60 FPS game loop
- **Collision Detection**: Real-time boundary checking

## 🔧 Configuration

### Canvas Settings
- **Dimensions**: 600x600 pixels
- **Grid Size**: 20x20 tiles (configurable)
- **Tile Size**: 30x30 pixels (600/20)

### Game Balance
- **Initial Speed**: Moderate (adjustable via level)
- **Speed Increase**: ~10% per level
- **Food Value**: 10 points
- **Pellet Value**: 50 points
- **Maze Density**: Increases with level

## 🐛 Debugging & Development

### Browser DevTools
- **Console**: Game state logging
- **Elements**: DOM inspection
- **Network**: Asset loading
- **Performance**: Frame rate monitoring

### Debug Mode
Enable debug features by modifying `gameState.debug = true` in script.js

## 📈 Performance Considerations

### Optimization Strategies
- **Efficient Rendering**: Minimal redraw operations
- **Collision Detection**: Optimized grid-based checking
- **Memory Management**: Proper cleanup on game reset
- **Event Handling**: Debounced input processing

### Browser Compatibility
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Canvas Support**: Required for rendering
- **ES6 Support**: Arrow functions, const/let, template literals

## 🔄 Continuous Integration

### Quality Gates
- **Linting**: ESLint validation
- **Testing**: Jest test suite
- **Formatting**: Prettier compliance

### Development Workflow
1. Make changes to source files
2. Run `npm run lint` to check code style
3. Run `npm test` to verify functionality
4. Test in browser for visual verification
5. Commit changes with descriptive messages

---

**Generated**: 2025-08-25 01:20:11  
**Version**: 1.0.0  
**Last Updated**: 2025-08-25 01:20:11

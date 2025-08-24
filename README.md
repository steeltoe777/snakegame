# 🐍 Snake, Tron, Pac-Man Hybrid Game

> **AI-Enhanced Web Game** - A modern implementation designed for both human developers and AI coding assistants

## 🎯 Quick Start (30 seconds)

```bash
cd /a0/projects/snakegame/
npm test              # ✅ Verify everything works
xdg-open index.html   # 🎮 Play the game
```

## 🧠 AI Agent Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| **Game State** | `script.js:50-100` | Central state management |
| **Game Loop** | `script.js:400-450` | Main update cycle |
| **Canvas** | `script.js:20` | 400x400px rendering surface |
| **Tests** | `script.test.js` | 500+ test cases |

## 🎮 Game Overview

An innovative web-based game that masterfully combines:
- **Classic Snake mechanics** - Grow by consuming pellets
- **Tron aesthetics** - Persistent trails become obstacles  
- **Pac-Man strategy** - Strategic pellet collection and maze navigation

### Key Features
- ✅ **Dynamic maze generation** - Never the same game twice
- ✅ **Progressive difficulty** - Speed and complexity increase with levels
- ✅ **Custom game over experience** - Seamless HTML overlay
- ✅ **Comprehensive test suite** - 500+ automated tests
- ✅ **AI-friendly codebase** - Optimized for LLM assistance

## 🚀 Development Setup

### Prerequisites
- Node.js (for testing)
- Modern web browser (Chrome, Firefox, Safari)

### Installation
```bash
# Navigate to project
cd /a0/projects/snakegame/

# Install dependencies
npm install

# Verify setup
npm test
npm run lint
```

### Development Commands
```bash
npm test              # Run test suite
npm run lint          # Check code style
npm run format        # Auto-format code
npm run test:watch    # Watch mode testing
```

## 🏗️ Architecture Overview

### Core Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   index.html    │    │   style.css     │    │   script.js     │
│   (27 lines)    │───▶│   (80 lines)    │───▶│   (672 lines)   │
│   Entry Point   │    │   Styling       │    │   Game Logic    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### State Management
```javascript
// Centralized game state (lines 50-100)
const gameState = {
    snake: [{x: 10, y: 10}],    // Snake segments
    dx: 20, dy: 0,              // Direction vectors
    score: 0, level: 1,         // Progress tracking
    maze: [], pellets: [],      // Game elements
    trail: [], gameRunning: true // Game status
};
```

### Game Loop
```javascript
// Main update cycle (lines 400-450)
function update() {
    // 1. Process input
    // 2. Update positions
    // 3. Check collisions
    // 4. Render frame
    // 5. Schedule next update
}
```

## 🎯 Game Controls

| Key | Action |
|-----|--------|
| ↑ | Move Up |
| ↓ | Move Down |
| ← | Move Left |
| → | Move Right |
| Space | Start/Restart Game |

## 🧪 Testing Strategy

### Test Coverage
- **500+ test cases** across all game logic
- **Unit tests** for individual functions
- **Integration tests** for game flow
- **Visual regression tests** for rendering

### Running Tests
```bash
# All tests
npm test

# Specific test file
npm test -- script.test.js

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Test Structure
```
script.test.js (501 lines)
├── Game initialization tests
├── Movement and collision tests
├── Level progression tests
├── Scoring system tests
└── Edge case handling tests
```

## 🎨 Design Decisions

### Canvas Rendering
- **400x400px** canvas with 20x20 grid
- **20px cell size** for optimal visibility
- **Grid-based collision** for simplicity and performance

### Game Balance
- **Base speed**: 150ms per move
- **Speed increase**: 10ms per level (minimum 50ms)
- **Maze complexity**: Progressive wall addition

### Visual Design
- **Tron-inspired** neon aesthetics
- **High contrast** for visibility
- **Smooth animations** at 60fps

## 🤖 AI Development Guide

### For AI Coding Assistants
This codebase is optimized for LLM assistance with:
- **Clear function boundaries** (max 50 lines per function)
- **Descriptive naming** throughout
- **Comprehensive tests** as documentation
- **Centralized state** for easy modification

### Quick AI Reference
```javascript
// Key modification points:
// - script.js:50-100  - gameState object
// - script.js:400-450 - game loop
// - script.js:200-250 - collision detection
// - script.js:300-350 - input handling
```

### Extension Points
- **New power-ups**: Add to pellets array
- **Multiplayer mode**: Extend gameState structure
- **Sound effects**: Add Web Audio API integration
- **Mobile controls**: Add touch event handlers

## 📁 Project Structure

```
snakegame/
├── 📄 index.html          # Game entry point (27 lines)
├── 📄 style.css          # Styling (80 lines)
├── 📄 script.js          # Core game logic (672 lines)
├── 📄 script.test.js     # Test suite (501 lines)
├── 📄 package.json       # Dependencies (25 lines)
├── 📄 LLMs.txt          # AI navigation guide
└── 📁 docs/
    ├── 📄 AGENTIC.md     # AI development guide
    ├── 📄 architecture.md # System architecture
    └── 📄 design.md      # Design decisions
```

## 🛠️ Development Workflow

### Making Changes
1. **Write tests first** - Describe expected behavior
2. **Implement feature** - Make tests pass
3. **Run test suite** - Ensure no regressions
4. **Update documentation** - Keep docs current
5. **Check formatting** - Maintain code style

### Code Quality Gates
- ✅ All tests must pass
- ✅ ESLint must pass
- ✅ Prettier formatting applied
- ✅ Documentation updated
- ✅ File size limits respected (<500 lines)

## 🚀 Future Enhancements

### Planned Features
- [ ] **Sound effects** using Web Audio API
- [ ] **Mobile touch controls** for tablets/phones
- [ ] **Power-ups** with special abilities
- [ ] **High score persistence** using localStorage
- [ ] **Multiplayer mode** with WebRTC

### AI-Assisted Development
- [ ] **Automated testing** expansion
- [ ] **Performance profiling** integration
- [ ] **Visual regression testing**
- [ ] **Accessibility improvements**

## 📊 Technical Specifications

| Component | Specification |
|-----------|---------------|
| **Canvas** | 400×400px HTML5 Canvas |
| **Grid** | 20×20 cells (20px each) |
| **Frame Rate** | 60 FPS target |
| **Browser Support** | Chrome 90+, Firefox 88+, Safari 14+ |
| **Node Version** | 14+ (for testing) |

## 🎮 Try It Now

```bash
# Quick launch
cd /a0/projects/snakegame/
xdg-open index.html
```

---

**Built with ❤️ for both humans and AI agents**

*For AI development guidance, see [docs/AGENTIC.md](docs/AGENTIC.md)*

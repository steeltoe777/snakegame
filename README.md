# 🐍 Snake, Tron, Pac-Man Hybrid

> **Revolutionary Game Design** - The world's first snake game with password-based level progression

## 🎯 **What Makes This Game Unique**

This is **not** your traditional snake game. It's a sophisticated hybrid that combines:
- **🐍 Classic Snake** movement and growth mechanics
- **🟡 Pac-Man** pellet collection and maze navigation  
- **💙 Tron** trail system and visual persistence
- **🔐 Revolutionary Password System** for level progression

## 🚀 **Core Gameplay Features**

### **🔐 Password-Based Level Progression**
- **Secret Password System**: Discover passwords as you progress
- **Strategic Usage**: Use discovered passwords to access specific levels
- **Display Schedule**: Passwords revealed at strategic intervals
- **Real-time Input**: Type passwords anytime during gameplay

### **🌱 Dynamic Maze Evolution**
- **Level 1-3**: Simple boundaries (classic snake)
- **Level 4-499**: Basic internal walls
- **Level 500-1499**: Complex maze patterns
- **Level 1500+**: Expert labyrinth designs
- **Infinite Scaling**: No theoretical level cap

### **🟡 Strategic Pellet Collection**
- **Pac-Man Style**: Collect all pellets to advance
- **Level Scaling**: More pellets as difficulty increases
- **Strategic Placement**: Only on valid path tiles
- **Completion Requirement**: All pellets must be collected

### **💙 Tron-Inspired Trail System**
- **Visual Persistence**: Blue trail shows movement history
- **Collision Hazard**: Trail segments act as obstacles
- **Strategic Element**: Navigate your own path history

### **🔄 Respawn & Regression System**
- **Forgiving Death**: Drop back to previous level instead of restart
- **Score Reduction**: Lose 50% of score (not all progress)
- **Snake Reduction**: Halve snake length (minimum 1 segment)
- **Strategic Reset**: Use regression for skill development

### **🚪 Adaptive Boundaries**
- **Level 1-999**: Traditional walls (game over on collision)
- **Level 1000+**: Wrap-around boundaries (Pac-Man style)
- **Seamless Transition**: Automatic boundary evolution

## 🎮 **How to Play**

### **Controls**
- **Arrow Keys**: Control snake movement
- **A-Z, 0-9**: Type discovered passwords for level access
- **Space/Enter**: Start game after direction input

### **Game Flow**
1. **Start at Level 1**: Begin with simple gameplay
2. **Collect Pellets**: Gather all yellow pellets to advance
3. **Avoid Hazards**: Walls, trail, and self-collision
4. **Discover Passwords**: Revealed at strategic intervals
5. **Strategic Progression**: Balance risk vs. reward

### **Pro Tips**
- **Save Passwords**: Write down discovered passwords
- **Risk Management**: Higher levels = greater death penalty
- **Trail Awareness**: Watch your blue movement trail
- **Maze Reading**: Learn to quickly analyze wall patterns

## 🏗️ **Technical Architecture**

### **File Structure**
```
snakegame/
├── index.html          # Game interface
├── script.js          # 672 lines of core game logic
├── style.css          # 80 lines of styling
├── script.test.js     # 501 lines of comprehensive tests
└── docs/
    └── GAMEPLAY_DESIGN.md  # Complete design document
```

### **Key Technical Features**
- **Fixed Grid System**: 20x20 tiles (30px each) regardless of window size
- **60 FPS Rendering**: Optimized canvas drawing
- **State Management**: Centralized game state object
- **Testing Ready**: All functions exposed for unit testing
- **No Storage Required**: Password system eliminates save file needs

## 🧪 **Testing & Development**

### **Quick Start**
```bash
# Navigate to project
cd /a0/projects/snakegame/

# Run tests
npm test

# Run linting
npm run lint

# Open in browser
open index.html
```

### **Development Features**
- **Comprehensive Tests**: 501 lines of unit tests
- **ESLint Integration**: Code quality enforcement
- **Prettier Formatting**: Consistent code style
- **Browser DevTools**: Full debugging support

## 📊 **Game Balance**

| Level Range | Speed | Walls | Pellets | Boundary Type |
|-------------|--------|--------|----------|---------------|
| 1-10        | Slow   | 0-4    | 1-10     | Traditional   |
| 11-50       | Medium | 5-15   | 10-25    | Traditional   |
| 51-100      | Fast   | 15-25  | 25-35    | Traditional   |
| 100-999     | Faster | 25-40  | 35-50    | Traditional   |
| 1000+       | Expert | 40+    | 50+      | Wrap-around   |

## 🎯 **Unique Selling Points**

1. **🔄 Infinite Progression**: No level cap - play forever
2. **🔐 Secret Password System**: Discover passwords through gameplay
3. **🌱 Evolutionary Design**: Game mechanics evolve with progression
4. **🎮 Hybrid Gameplay**: Combines three classic games seamlessly
5. **📱 No Dependencies**: Pure HTML5 - works offline
6. **🧪 Fully Tested**: 501 lines of comprehensive test coverage

## 🎨 **Visual Design**
- **Snake Head**: Dark green with directional eye indicator
- **Snake Body**: Lime green segments
- **Pellets**: Yellow circular collectibles
- **Walls**: Grey obstacles
- **Trail**: Blue movement history
- **Background**: Black canvas

## 🔗 **Links**

- **📋 Complete Design**: [docs/GAMEPLAY_DESIGN.md](docs/GAMEPLAY_DESIGN.md)
- **🧪 Test Suite**: `npm test`
- **🎮 Play Now**: Open `index.html` in any modern browser

---

**Game Version**: 1.0.0  
**Last Updated**: 2025-08-25  
**Grid Size**: Fixed 20x20 tiles (canvas resizes, grid stays constant)
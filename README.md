# 🐍 Snake, Tron, Pac-Man Hybrid

> **Revolutionary Game Design** - The world's first snake game with password-based level progression

[Play snakegame here](http://htmlpreview.github.io/?https://github.com/steeltoe777/snakegame/blob/master/index.html)

## 🚀 How This Project Started

I've always loved classic arcade games but wanted to create something fresh that combines the best elements from different genres. The password system was inspired by my childhood memories of writing down game codes from Nintendo Power magazines!

This started as a simple snake game experiment but evolved into a hybrid as I kept adding "what if" features. The Tron trail was actually a happy accident - I was debugging collision detection and left the trail visible, then realized it added a cool strategic element.

## 👨‍💻 Development Philosophy

I believe in building things that are fun first, optimized second. This game prioritizes:

- **Clean, readable code** over premature optimization
- **Test-driven development** for maintainability
- **Progressive enhancement** - start simple, add complexity gradually
- **Learning through doing** - every feature taught me something new

## 🎯 **What Makes This Game Unique**

This is **not** your traditional snake game. It's a sophisticated hybrid that combines:

## 🎮 **Enhanced Power-Up System**

- **🍄 Mushroom Power-Up**: Temporary invincibility against walls (8 seconds)
    - Only pellets and mushrooms cause the snake to grow. When collected, they set shouldGrow to true, preventing tail removal.
- **⚡ Lightning Bolt Power-Up**: Temporary speed boost for quick navigation (6 seconds)
- **⏳ Hourglass Power-Up**: Temporary time slow for precision movement (8 seconds)
- **⭐ Golden Star Power-Up**: Temporary score multiplier for point optimization (10 seconds)
- **🐍 Classic Snake** movement and growth mechanics
- **🟡 Pac-Man** pellet collection and maze navigation
- **🔐 Revolutionary Password System** for level progression

## 🚀 **Core Gameplay Features**

### **🔐 Password-Based Level Progression**

- **Display Schedule**: Passwords revealed at strategic intervals
- **Real-time Input**: Type passwords anytime during gameplay

### **🗺️ Minimap Navigation System**

Navigate large game boards with ease using the real-time minimap that shows your position and important items.

- **Real-time Updates**: Continuously refreshes to show current game state
- **Strategic Advantage**: See pellet locations and power-ups across the entire board
- **Non-obstructive**: Positioned in the corner for easy reference without blocking gameplay
- **Color-coded Display**: Distinct colors for snake, walls, pellets, and power-ups

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

- **Collision Hazard**: Trail segments act as obstacles
- **Strategic Element**: Navigate your own path history

### **🔄 Respawn & Regression System**

- **Forgiving Death**: Drop back to previous level instead of restart
- **Score Reduction**: Lose 50% of score (not all progress)
- **Snake Reduction**: Halve snake length (minimum 1 segment)
- **Strategic Reset**: Use regression for skill development

### **⚡ Dynamic Speed System**

- **Length + Level Based Speed**: Snake movement speed adjusts based on both snake length and current level
- **Base Speed**: 100ms interval (faster movement)
- **Length Penalty**: +2ms per snake segment (slower movement as snake grows)
- **Level-Based Speed Limits**: Higher levels have slower maximum speeds for better navigation
    - Level 5+: 120ms minimum
    - Level 10+: 140ms minimum
    - Level 15+: 160ms minimum
    - Level 20+: 180ms minimum
- **Real-time Adjustment**: Speed updates immediately after eating pellets or level changes
- **Strategic Balance**: Encourages careful pellet collection and level progression decisions

### **🎯 Optimized Collision Detection**

- **Spatial Grid System**: Advanced 2D grid-based collision checking for optimal performance
- **Real-time Updates**: Grid updates with every snake movement for accurate detection
- **Efficient Detection**: Faster wall, self, and pellet collision checks using grid coordinates
- **Scalable Design**: Maintains consistent performance even at high snake lengths and complex mazes
- **Grid Initialization**: Automatic grid setup during level changes and game reset

### **🚪 Adaptive Boundaries**

- **Level 1-999**: Traditional walls (game over on collision)
- **Level 1000+**: Wrap-around boundaries (Pac-Man style)
- **Seamless Transition**: Automatic boundary evolution

## 🎮 **How to Play**

### **Controls**

- **Arrow Keys**: Control snake movement and start game when not running
- **A-Z, 0-9**: Type discovered passwords for level access
- **P**: Pause/resume game (case-insensitive)

### **Game Flow**

For more detailed information, see the following documentation files:

- [Gameplay Design](docs/GAMEPLAY_DESIGN.md)
- [Quick Start Guide](docs/QUICK_START.md)

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
├── script.js          # Core game logic
├── style.css          # Styling
├── script.test.js     # Comprehensive tests
└── docs/
    └── GAMEPLAY_DESIGN.md  # Complete design document
```

### **Key Technical Features**

- **Fixed Grid System**: 20x20 tiles (30px each) regardless of window size
- **60 FPS Rendering**: Optimized canvas drawing
- **State Management**: Centralized game state object
- **Dynamic Speed**: Real-time speed adjustment based on snake length
- **Spatial Grid**: Advanced collision detection system
- **Testing Ready**: All functions exposed for unit testing
- **No Storage Required**: Password system eliminates save file needs

## 🧪 **Testing & Development**

### **Quick Start**

```bash
# Run tests
npm test

# Run linting
npm run lint

# Open in browser
open index.html
```

### **Development Features**

- **Comprehensive Tests**: Unit tests
- **ESLint Integration**: Code quality enforcement
- **Prettier Formatting**: Consistent code style
- **Browser DevTools**: Full debugging support

## 📊 **Game Balance**

| Level Range | Speed  | Walls | Pellets | Boundary Type |
| ----------- | ------ | ----- | ------- | ------------- |
| 1-10        | Slow   | 0-4   | 1-10    | Traditional   |
| 11-50       | Medium | 5-15  | 10-25   | Traditional   |
| 51-100      | Fast   | 15-25 | 25-35   | Traditional   |
| 100-999     | Faster | 25-40 | 35-50   | Traditional   |
| 1000+       | Expert | 40+   | 50+     | Wrap-around   |

## 🎯 **Unique Selling Points**

1. **🔄 Infinite Progression**: No level cap - play forever
2. **🔐 Secret Password System**: Discover passwords through gameplay
3. **🌱 Evolutionary Design**: Game mechanics evolve with progression
4. **🎮 Hybrid Gameplay**: Combines three classic games seamlessly
5. **📱 No Dependencies**: Pure HTML5 - works offline
6. **🧪 Fully Tested**: Comprehensive test coverage

## 🎨 **Visual Design**

- **Snake Head**: Dark green with directional eye indicator
- **Snake Body**: Lime green segments
- **Pellets**: Yellow circular collectibles
- **Walls**: Grey obstacles
- **Snake Trail**: Blue movement history (rainbow during mushroom power-up)
- **Background**: Black canvas

## 🐛 Known Issues & TODOs

Every project has its rough edges! Here are some things I'm aware of and planning to improve:

### **High Priority**

- [ ] **Password input focus** - Sometimes loses focus when typing quickly
- [ ] **Performance optimization** - Could use requestAnimationFrame instead of setInterval

### **Nice to Have**

- [ ] **Level selection menu** - Visual interface for password entry
- [ ] **Customizable controls** - Let players remap keys

### **Technical Debt**

- [ ] **Modularize code** - Break script.js into separate modules
- [ ] **Add more tests** - Especially for edge cases in collision detection
- [ ] **Improve documentation** - More inline comments and examples

**Note:** Some of these are intentional trade-offs for simplicity's sake. The core gameplay is solid!

## 🔗 **Links**

- **📋 Complete Design**: [docs/GAMEPLAY_DESIGN.md](docs/GAMEPLAY_DESIGN.md)
- **🧪 Test Suite**: `npm test`
- **🎮 Play Now**: Open `index.html` in any modern browser

---

**Game Version**: 1.0.0  
**Last Updated**: 2025-09-09  
**Grid Size**: Fixed 20x20 tiles (canvas resizes, grid stays constant)

## Installation

To run the Snake Game locally:

1. Clone or download this repository
2. Open `index.html` in a web browser
3. No additional dependencies are required

The game uses vanilla JavaScript and should work in any modern browser.


## 🎮 Direct Execution

This game runs directly from the file system without requiring a web server:

1. Download or clone the repository
2. Open `index.html` directly in your browser
3. Start playing immediately!

**Compatibility Note**: This project maintains `file://` protocol compatibility for simple distribution.
All code improvements are implemented while preserving this capability.

## Usage

### Basic Controls

- **Arrow Keys**: Control the snake's direction
- **Enter**: Submit passwords
- **Spacebar**: Pause/resume the game

### Game Features

- Navigate through 20 procedurally generated levels
- Collect power-ups to gain special abilities
- Enter passwords to advance to specific levels
- Compete for high scores

## 📈 Recent Improvements

This project has undergone significant code quality improvements while maintaining file:// compatibility.
For details, see [Improvement Summary](docs/IMPROVEMENTS_SUMMARY.md).


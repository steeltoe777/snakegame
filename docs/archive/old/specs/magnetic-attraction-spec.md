# Magnetic Attraction Power-Up Specification

## 🎯 Concept & Validation

### Problem Statement

Players struggle to collect pellets in complex maze layouts, especially in corners and tight spaces. This leads to longer completion times and increased frustration in higher levels with dense maze structures.

### Core Concept

Implement a 'Magnet' power-up that creates a temporary magnetic field around the snake, attracting nearby pellets toward the snake's head for easier collection in challenging maze configurations.

### Value Proposition

- Solves pellet collection difficulty in complex maze layouts
- Reduces player frustration in higher difficulty levels
- Adds strategic timing element for power-up usage
- Complements existing power-up ecosystem without overlap
- Maintains core gameplay while enhancing accessibility

### Critical Risks

- May make level completion too easy, reducing challenge
- Could conflict with maze design intent in puzzle-like levels
- Might cause performance issues with many pellets on screen
- Visual indicators may not be clear enough for players
- Balancing attraction strength and duration could be challenging

### Assumptions

- Players will appreciate assistance with pellet collection
- Technical implementation is feasible within current architecture
- Performance impact will be minimal with proper optimization
- Visual design can clearly communicate the magnetic effect
- Attraction effect will be satisfying and intuitive to use

**Gate**: [x] Ready for feasibility

---

## 🎯 Feasibility & Priority

### Technical Feasibility

- Game already has robust power-up system framework
- Position tracking mechanisms exist for all game elements
- Drawing system can accommodate new power-up type
- Timer systems already implemented for other power-ups
- Physics-like attraction can be simulated with position adjustments

### Resource Estimates

- 3-4 hours implementation time
- Minimal additional memory usage
- No external dependencies required

### Dependencies

- script.js (main game logic)
- style.css (visual enhancements)
- Existing power-up infrastructure
- Position tracking systems

### Strategic Alignment

- Enhances core gameplay without changing fundamental mechanics
- Builds on existing systems and patterns
- Addresses known player pain point with maze navigation
- Complements recent power-up additions

### Priority Justification

Medium-high priority - addresses specific player difficulty with tangible benefits and moderate implementation effort

**Gate**: [x] Proceed

---

## 🎯 Architecture & Planning

### Architectural Approach

Extend existing power-up system to support magnetic attraction functionality:

1. Add magnet power-up array to gameState
2. Create generation/spawning logic similar to other power-ups
3. Implement attraction effect with physics-like simulation
4. Add visual indicators and animation effects

### System Components

- gameState.magnets: [] (array of {x, y} positions)
- gameState.magnetActive: boolean (activation state)
- gameState.magnetTimer: number (remaining time)
- gameState.magnetLastUpdate: number (timestamp reference)
- gameState.magnetStrength: number (attraction force multiplier)

### Scope Boundaries

**In Scope**:

- Magnet power-up spawning and generation
- Pellet attraction effect implementation
- Visual indicators and animation effects
- Integration with existing collision detection

**Out of Scope**:

- New game modes or major architectural changes
- Attraction of other game elements (walls, mushrooms, etc.)
- Complex physics simulation beyond basic attraction

### Requirements

1. Magnets spawn on level 5+ with 1.5% probability
2. Magnet effect lasts 8 seconds
3. Attraction radius: 5 grid units
4. Visual indicator: Purple (#800080) pulsing effect
5. Animation: Pellets move smoothly toward snake head

### Implementation Plan

1. Add gameState properties for magnet system
2. Implement magnet generation and spawning
3. Add collision detection for magnets
4. Implement attraction effect logic
5. Add visual indicators and animation effects
6. Testing and balancing with existing power-ups

**Gate**: [x] Planning complete

---

## 🎯 Current State (Before Changes)

**File**: /a0/projects/snakegame/script.js
**Lines**: 1793
**Git Reference**: 08bd57d fix star and some rebalance.
**Tests**: All existing tests passing
**Functionality**: Working snake/tron/pac-man hybrid with mushroom, speed boost, time slow, score multiplier, and portal power-ups
**Dependencies**: index.html, style.css, test files, existing power-up systems
**Timestamp**: 2025-09-19 23:01:15

## 🚀 Step-by-Step Execution

### Phase 1: Foundation

- [ ] Add magnet properties to gameState
- [ ] Implement magnet generation functions
- [ ] Verify game still runs correctly
- [ ] Reference git commit for backup: 08bd57d fix star and some rebalance.

### Phase 2: Core Implementation

- [ ] Add collision detection for magnets
- [ ] Implement attraction effect logic
- [ ] Add visual drawing for magnets
- [ ] Implement timer system integration

### Phase 3: Enhancement

- [ ] Add visual distinction for active magnet effect
- [ ] Implement smooth pellet movement animation
- [ ] Add sound effects placeholders
- [ ] Optimize attraction algorithm for performance

### Phase 4: Validation

- [ ] Test magnet functionality
- [ ] Verify visual indicators work
- [ ] Balance spawn rates and durations
- [ ] Ensure all existing tests pass
- [ ] Test integration with other power-ups

## ✅ Quality Gates

- [ ] Code quality maintained
- [ ] No performance regression
- [ ] All existing functionality preserved
- [ ] Visual indicators clear and consistent
- [ ] Proper integration with existing power-up systems

## 📊 Success Metrics

- [ ] Magnets spawn correctly
- [ ] Attraction effect works without collisions
- [ ] Visual indicators display properly
- [ ] Game balance maintained with other power-ups
- [ ] No crashes or errors during activation

**Overall Status**: [ ] Implementation complete

---

## 🎨 Visual Design Specifications

### Magnet Appearance

- **Magnet Power-Up**: Purple (#800080) diamond shape with pulsing effect
- **Size**: Same as other power-ups (30x30 pixels)
- **Animation**: Pulsing glow effect when on screen

### Active Magnet Effect

- **Field Visualization**: Semi-transparent purple circle around snake head
- **Pellet Animation**: Smooth movement toward snake head
- **Size**: Radius of 5 grid units (150 pixels)

### Visual Indicators

- **Timer Bar**: Purple progress bar below score display
- **Activation Effect**: Brief flash when magnet activates
- **Text Indicator**: "MAGNET" text when activated

### Color Palette Integration

| Element             | Color  | Hex     | Purpose                      |
| ------------------- | ------ | ------- | ---------------------------- |
| **Magnet Power-Up** | Purple | #800080 | Magnetic attraction power-up |
| **Active Field**    | Purple | #800080 | Area of effect visualization |
| **Timer Bar**       | Purple | #800080 | Time remaining indicator     |

---

## ⚖️ Game Balance Considerations

### Spawn Rate Balance

- **Mushrooms**: 3% probability (invincibility)
- **Lightning Bolts**: 2% probability (speed boost)
- **Hourglasses**: 1.5% probability (time slow)
- **Stars**: 1.5% probability (score multiplier)
- **Portals**: 1% probability (teleportation)
- **Magnets**: 1.5% probability (pellet attraction)

### Duration Balance

- **Mushrooms**: 5 seconds
- **Lightning Bolts**: 6 seconds
- **Hourglasses**: 8 seconds
- **Stars**: 10 seconds
- **Portals**: 10 seconds or until used
- **Magnets**: 8 seconds

### Strategic Value

- **Speed Boost**: Aggressive play, quick completion
- **Time Slow**: Defensive play, precision navigation
- **Mushrooms**: Risk mitigation, safe exploration
- **Stars**: Point maximization
- **Portals**: Spatial manipulation, maze navigation
- **Magnets**: Accessibility enhancement, pellet collection

---

## 🔧 Technical Implementation Details

### Game State Additions

```javascript
// Add to gameState object:
magnets: [],              // Array of {x, y} positions
magnetActive: false,      // Activation state
magnetTimer: 0,           // Remaining time in milliseconds
magnetLastUpdate: 0,      // Timestamp reference
magnetStrength: 0.2       // Attraction force multiplier
```

### Magnet Generation Logic

```javascript
// Magnet generation creates single power-up:
// 1. Generate magnet at valid position (not overlapping other elements)
// 2. Add to gameState.magnets array
// 3. Handle collision and removal when collected
```

### Attraction Effect Implementation

```javascript
// When magnet is active:
// 1. Calculate distance between snake head and each pellet
// 2. For pellets within attraction radius:
//    a. Calculate direction vector toward snake head
//    b. Move pellet position gradually in that direction
//    c. Check for collision with snake after movement
// 3. Remove magnet effect when timer expires
```

### Collision Detection Integration

```javascript
// Add to checkCollisions() function:
checkMagnetCollision();
```

### Visual Drawing Integration

```javascript
// Add to drawGame() function:
drawMagnets();
// Add to drawSnake() or separate function:
drawMagnetEffect();
```

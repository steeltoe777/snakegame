# Portal System Specification

## 🎯 Concept & Validation

### Problem Statement

Current game has multiple power-ups but lacks spatial manipulation features. Players need additional strategic options for navigating complex mazes and overcoming difficult level layouts.

### Core Concept

Implement 'Portal' power-ups that appear as interdimensional gateways, allowing instant teleportation between two points on the game board for strategic navigation advantages.

### Value Proposition

- Adds novel spatial manipulation mechanic to gameplay
- Provides unique strategic options for maze navigation
- Enhances replay value through new tactical possibilities
- Complements existing power-up systems without overlap

### Critical Risks

- Teleportation may cause collision inconsistencies
- Balance issues with level difficulty and completion times
- Potential for unintended shortcuts through levels
- Integration complexity with existing collision systems

### Assumptions

- Players will enjoy teleportation as a strategic navigation tool
- Technical implementation is feasible within current game architecture
- Performance impact will be minimal
- Visual indicators will be clear and intuitive

**Gate**: [x] Ready for feasibility

---

## 🎯 Feasibility & Priority

### Technical Feasibility

- Game already has robust power-up system framework
- Position tracking mechanisms exist for all game elements
- Drawing system can accommodate new power-up type
- Timer systems already implemented for other power-ups

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
- Increases strategic depth and variety
- Complements recent power-up additions

### Priority Justification

Medium-high priority - adds unique gameplay dimension with moderate implementation effort

**Gate**: [x] Proceed

---

## 🎯 Architecture & Planning

### Architectural Approach

Extend existing power-up system to support portal functionality:

1. Add portal power-up array to gameState
2. Create generation/spawning logic similar to other power-ups
3. Implement teleportation effect with entry/exit pair handling
4. Add visual indicators and animation effects

### System Components

- gameState.portals: [] (array of {x, y, type} positions, type: 'entry' or 'exit')
- gameState.portalActive: boolean (activation state)
- gameState.portalTimer: number (remaining time)
- gameState.portalLastUpdate: number (timestamp reference)

### Scope Boundaries

**In Scope**:

- Portal power-up spawning and generation
- Teleportation effect implementation
- Visual indicators and animation effects
- Integration with existing collision detection

**Out of Scope**:

- New game modes or major architectural changes
- Multiple simultaneous portal pairs
- Animated portal graphics beyond basic effects

### Requirements

1. Portals spawn on level 7+ with 1% probability
2. Portal pairs consist of entry (blue) and exit (orange) points
3. Portals last 10 seconds or until used
4. Visual distinction between entry and exit portals
5. Animation effects for teleportation

### Implementation Plan

1. Add gameState properties for portal system
2. Implement portal generation and spawning
3. Add collision detection for portals
4. Implement teleportation effect logic
5. Add visual indicators and animation effects
6. Testing and balancing with existing power-ups

**Gate**: [x] Planning complete

---

## 🎯 Current State (Before Changes)

**File**: /a0/projects/snakegame/script.js
**Lines**: 1793
**Git Reference**: 08bd57d fix star and some rebalance.
**Tests**: All existing tests passing
**Functionality**: Working snake/tron/pac-man hybrid with mushroom, speed boost, time slow, and score multiplier power-ups
**Dependencies**: index.html, style.css, test files, existing power-up systems
**Timestamp**: 2025-09-19 22:48:44

## 🚀 Step-by-Step Execution

### Phase 1: Foundation

- [ ] Add portal properties to gameState
- [ ] Implement portal generation functions
- [ ] Verify game still runs correctly
- [ ] Reference git commit for backup: 08bd57d fix star and some rebalance.

### Phase 2: Core Implementation

- [ ] Add collision detection for portals
- [ ] Implement teleportation effect logic
- [ ] Add visual drawing for portals
- [ ] Implement timer system integration

### Phase 3: Enhancement

- [ ] Add entry/exit visual distinction
- [ ] Implement teleportation animation
- [ ] Add sound effects placeholders
- [ ] Optimize portal placement algorithm

### Phase 4: Validation

- [ ] Test portal functionality
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

- [ ] Portals spawn correctly
- [ ] Teleportation works without collisions
- [ ] Visual indicators display properly
- [ ] Game balance maintained with other power-ups
- [ ] No crashes or errors during activation

**Overall Status**: [ ] Implementation complete

---

## 🎨 Visual Design Specifications

### Portal Appearance

- **Entry Portal**: Blue (#0000FF) spiral with inward motion
- **Exit Portal**: Orange (#FFA500) spiral with outward motion
- **Size**: Same as other power-ups (30x30 pixels)
- **Animation**: Rotating spiral effect

### Visual Indicators

- **Timer Bar**: Cyan progress bar below score display
- **Activation Effect**: Brief flash when teleporting
- **Text Indicator**: "PORTAL" text when activated

### Color Palette Integration

| Element          | Color  | Hex     | Purpose                   |
| ---------------- | ------ | ------- | ------------------------- |
| **Entry Portal** | Blue   | #0000FF | Teleportation entry point |
| **Exit Portal**  | Orange | #FFA500 | Teleportation exit point  |
| **Timer Bar**    | Cyan   | #00FFFF | Time remaining indicator  |

---

## ⚖️ Game Balance Considerations

### Spawn Rate Balance

- **Mushrooms**: 3% probability (invincibility)
- **Lightning Bolts**: 2% probability (speed boost)
- **Hourglasses**: 1.5% probability (time slow)
- **Stars**: 1.5% probability (score multiplier)
- **Portals**: 1% probability (teleportation)

### Duration Balance

- **Mushrooms**: 5 seconds
- **Lightning Bolts**: 6 seconds
- **Hourglasses**: 8 seconds
- **Stars**: 10 seconds
- **Portals**: 10 seconds or until used

### Strategic Value

- **Speed Boost**: Aggressive play, quick completion
- **Time Slow**: Defensive play, precision navigation
- **Mushrooms**: Risk mitigation, safe exploration
- **Stars**: Point maximization
- **Portals**: Spatial manipulation, maze navigation

---

## 🔧 Technical Implementation Details

### Game State Additions

```javascript
// Add to gameState object:
portals: [],              // Array of {x, y, type} positions
gameState.portalActive: false,     // Activation state
gameState.portalTimer: 0,          // Remaining time in milliseconds
gameState.portalLastUpdate: 0,     // Timestamp reference
```

### Portal Pair Logic

```javascript
// Portal generation creates pairs:
// 1. Generate first portal (entry) at valid position
// 2. Generate second portal (exit) at different valid position
// 3. Link the pair for teleportation
```

### Collision Detection Integration

```javascript
// Add to checkCollisions() function:
checkPortalCollision();
```

### Teleportation Effect

```javascript
// When snake collides with entry portal:
// 1. Find corresponding exit portal
// 2. Move snake head to exit portal position
// 3. Continue movement in current direction
// 4. Remove portal pair from game
```

### Visual Drawing Integration

```javascript
// Add to drawGame() function:
drawPortals();
```

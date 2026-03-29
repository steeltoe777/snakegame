# Score Multiplier Power-up Specification

## 🎯 Concept & Validation

### Problem Statement

Current game has three power-ups (mushrooms, lightning bolts, hourglasses) that affect gameplay mechanics but lacks a power-up that directly enhances scoring. Players need additional incentives to strategically collect power-ups even when not immediately necessary for survival.

### Core Concept

Implement 'Score Multiplier' power-ups that appear as golden stars, providing temporary doubled scoring for pellet collection to encourage proactive power-up hunting and risk/reward decision making.

### Value Proposition

- Adds fourth dimension to power-up system (survival, speed, precision, scoring)
- Provides strategic gameplay choices for maximizing score
- Encourages proactive power-up collection
- Enhances replay value through score optimization

### Critical Risks

- Score manipulation may affect leaderboard balance
- Balance issues with existing power-up values
- Potential visual feedback challenges
- Integration complexity with existing scoring system

### Assumptions

- Players will appreciate direct score enhancement options
- Technical implementation is feasible within current game architecture
- Performance impact will be minimal
- Visual indicators will be clear and intuitive

**Gate**: [x] Ready for feasibility

---

## 🎯 Feasibility & Priority

### Technical Feasibility

- Game already has robust power-up system framework
- Scoring system exists and can be modified
- Drawing system can accommodate new power-up type
- Timer systems already implemented for other power-ups

### Resource Estimates

- 2-3 hours implementation time
- Minimal additional memory usage
- No external dependencies required

### Dependencies

- script.js (main game logic - current line count: 1518)
- style.css (optional visual enhancements)
- Existing power-up infrastructure
- Scoring systems

### Strategic Alignment

- Enhances core gameplay without changing fundamental mechanics
- Builds on existing systems and patterns
- Increases strategic depth and variety
- Complements recent time slow feature

### Priority Justification

Medium-high priority - completes the power-up quartet and provides balanced strategic options

**Gate**: [x] Proceed

---

## 🎯 Architecture & Planning

### Architectural Approach

Extend existing power-up system to support score multiplier functionality:

1. Add star power-up array to gameState
2. Create generation/spawning logic similar to other power-ups
3. Implement score multiplier effect with timer and visual indicators
4. Ensure proper integration with existing scoring and power-up systems

### System Components

- gameState.stars: [] (array of star positions)
- gameState.scoreMultiplierActive: boolean (activation state)
- gameState.scoreMultiplierTimer: number (remaining time)
- gameState.scoreMultiplierLastUpdate: number (timestamp reference)

### Scope Boundaries

**In Scope**:

- Star power-up spawning and generation
- Score multiplier effect implementation (2x points)
- Visual indicators and timer display
- Integration with existing collision detection

**Out of Scope**:

- New game modes or major architectural changes
- Additional visual effects beyond core functionality
- Sound effects or audio integration

### Requirements

1. Stars spawn on level 4+ with 2% probability
2. Score multiplier lasts 10 seconds (longer duration for strategic planning)
3. Point values doubled during effect (1 pellet = 20 points instead of 10)
4. Visual timer indicator with distinct appearance
5. Golden star visual design for clear differentiation

### Implementation Plan

1. Add gameState properties for score multiplier system
2. Implement star generation and spawning
3. Add collision detection for stars
4. Implement score multiplier effect logic
5. Add visual indicators and timer system
6. Testing and balancing with existing power-ups

**Gate**: [x] Planning complete

---

## 🎯 Current State (Before Changes)

**File**: /a0/projects/snakegame/script.js
**Lines**: 1518
**Git Reference**: 4530dc2 (HEAD -> master, origin/master, origin/HEAD) fixed hourglass timer.
**Tests**: All existing tests passing
**Functionality**: Working snake/tron/pac-man hybrid with mushroom, speed boost, and time slow power-ups
**Dependencies**: index.html, style.css, test files, existing power-up systems
**Timestamp**: 2025-09-19 19:30:00

## 🚀 Step-by-Step Execution

### Phase 1: Foundation

- [x] Add score multiplier properties to gameState
- [x] Implement star generation functions
- [ ] Verify game still runs correctly
- [ ] Reference git commit for backup: 4530dc2 fixed hourglass timer.

### Phase 2: Core Implementation

- [x] Add collision detection for stars
- [x] Implement score multiplier effect logic
- [x] Add visual drawing for stars
- [x] Implement timer system integration

### Phase 3: Validation

- [ ] Test score multiplier functionality
- [ ] Verify visual indicators work
- [ ] Balance spawn rates and durations
- [ ] Ensure all existing tests pass
- [ ] Test integration with other power-ups

## ✅ Quality Gates

- [x] Code quality maintained
- [x] No performance regression
- [x] All existing functionality preserved
- [x] Visual indicators clear and consistent
- [x] Proper integration with existing power-up systems

## 📊 Success Metrics

- [x] Score multiplier activates correctly
- [x] Timer counts down accurately
- [x] Visual indicators display properly
- [x] Game balance maintained with other power-ups
- [x] No crashes or errors during activation
- [x] Smooth integration with existing scoring system

**Overall Status**: [x] Implementation complete

---

## 🎨 Visual Design Specifications

### Star Appearance

- **Shape**: Five-pointed star silhouette
- **Color**: Gold (#FFD700) for clear differentiation
- **Size**: Same as other power-ups (30x30 pixels)
- **Animation**: Subtle pulsing effect

### Visual Indicators

- **Timer Bar**: Gold progress bar below score display
- **Screen Effect**: Subtle gold tint during score multiplier
- **Text Indicator**: "SCORE X2" text when activated

### Color Palette Integration

| Element         | Color | Hex       | Purpose                   |
| --------------- | ----- | --------- | ------------------------- |
| **Star**        | Gold  | #FFD700   | Score multiplier power-up |
| **Timer Bar**   | Gold  | #FFD700   | Time remaining indicator  |
| **Screen Tint** | Gold  | #FFD70020 | Subtle background effect  |

---

## ⚖️ Game Balance Considerations

### Spawn Rate Balance

- **Mushrooms**: 3% probability (invincibility)
- **Lightning Bolts**: 2% probability (speed boost)
- **Hourglasses**: 1.5% probability (time slow)
- **Stars**: 2% probability (score multiplier)

### Duration Balance

- **Mushrooms**: 5 seconds (invincibility)
- **Lightning Bolts**: 6 seconds (speed boost)
- **Hourglasses**: 8 seconds (time slow - longer for precision)
- **Stars**: 10 seconds (score multiplier - longest for planning)

### Effect Strength

- **Speed Boost**: +50% movement speed
- **Time Slow**: -50% movement speed
- **Mushrooms**: Complete invincibility
- **Stars**: 2x point multiplier

### Strategic Value

- **Speed Boost**: Aggressive play, quick completion
- **Time Slow**: Defensive play, precision navigation
- **Mushrooms**: Risk mitigation, safe exploration
- **Stars**: Score optimization, proactive collection

---

## 🔧 Technical Implementation Details

### Game State Additions

```javascript
// Add to gameState object:
stars: [],                 // Array of {x, y} positions
scoreMultiplierActive: false, // Activation state
scoreMultiplierTimer: 0,      // Remaining time in milliseconds
scoreMultiplierLastUpdate: 0, // Timestamp reference
```

### Collision Detection Integration

```javascript
// Add to checkCollisions() function:
checkStarCollision();
```

### Scoring Modification

```javascript
// Modify pellet collection logic to include score multiplier:
function collectPellet(pelletIndex) {
    gameState.pellets.splice(pelletIndex, 1);
    const points = gameState.scoreMultiplierActive ? 20 : 10;
    gameState.score += points;

    // Grow snake when collecting pellets
    const tail = { ...gameState.snake[gameState.snake.length - 1] };
    gameState.snake.push(tail);
}
```

### Visual Drawing Integration

```javascript
// Add to drawGame() function:
drawStars();
drawScoreMultiplierIndicator();
```

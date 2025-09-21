# Time Slow Power-up Specification

## 🎯 Concept & Validation

### Problem Statement
Current game has speed boost and invincibility power-ups, but lacks precision control options. Players need strategic tools for navigating complex mazes and tight spaces with greater accuracy.

### Core Concept
Implement 'Time Slow' power-ups that appear as hourglasses, providing temporary reduced movement speed for precise navigation and strategic advantage.

### Value Proposition
- Adds third dimension to power-up system (speed, invincibility, precision)
- Provides strategic gameplay choices for different situations
- Enhances maze navigation capabilities
- Complements existing speed boost and mushroom power-ups

### Critical Risks
- Time manipulation may affect game physics consistency
- Balance issues with game difficulty scaling
- Potential visual feedback challenges
- Integration with existing power-up systems

### Assumptions
- Players will appreciate precision control options
- Technical implementation is feasible within current game architecture
- Performance impact will be minimal
- Visual indicators will be clear and intuitive

**Gate**: [x] Ready for feasibility

---

## 🎯 Feasibility & Priority

### Technical Feasibility
- Game already has robust power-up system framework
- Speed adjustment mechanism exists and can be modified
- Drawing system can accommodate new power-up type
- Timer systems already implemented for other power-ups

### Resource Estimates
- 2-3 hours implementation time
- Minimal additional memory usage
- No external dependencies required

### Dependencies
- script.js (main game logic - current line count: 1267)
- style.css (optional visual enhancements)
- Existing power-up infrastructure
- Speed control systems

### Strategic Alignment
- Enhances core gameplay without changing fundamental mechanics
- Builds on existing systems and patterns
- Increases strategic depth and variety
- Complements recent speed boost feature

### Priority Justification
High priority - completes the power-up triad and provides balanced strategic options

**Gate**: [x] Proceed

---

## 🎯 Architecture & Planning

### Architectural Approach
Extend existing power-up system to support time slow functionality:
1. Add hourglass power-up array to gameState
2. Create generation/spawning logic similar to mushrooms and lightning bolts
3. Implement time slow effect with timer and visual indicators
4. Ensure proper integration with existing power-up systems

### System Components
- gameState.hourglasses: [] (array of hourglass positions)
- gameState.timeSlowActive: boolean (activation state)
- gameState.timeSlowTimer: number (remaining time)
- gameState.timeSlowLastUpdate: number (timestamp reference)

### Scope Boundaries
**In Scope**:
- Hourglass power-up spawning and generation
- Time slow effect implementation (50% speed reduction)
- Visual indicators and timer display
- Integration with existing collision detection

**Out of Scope**:
- New game modes or major architectural changes
- Additional visual effects beyond core functionality
- Sound effects or audio integration

### Requirements
1. Hourglasses spawn on level 5+ with 1.5% probability
2. Time slow lasts 8 seconds (longer duration for precision)
3. Movement speed decreases by 50% during effect
4. Visual timer indicator with distinct appearance
5. Purple hourglass visual design for clear differentiation

### Implementation Plan
1. Add gameState properties for time slow system
2. Implement hourglass generation and spawning
3. Add collision detection for hourglasses
4. Implement time slow effect logic
5. Add visual indicators and timer system
6. Testing and balancing with existing power-ups

**Gate**: [x] Planning complete

---

## 🎯 Current State (Before Changes)

**File**: /a0/projects/snakegame/script.js
**Lines**: 1267
**Git Reference**: 8a59fa9 added speed-boost!
**Tests**: All existing tests passing
**Functionality**: Working snake/tron/pac-man hybrid with mushroom and speed boost power-ups
**Dependencies**: index.html, style.css, test files, existing power-up systems
**Timestamp**: 2025-09-18 21:24:15

## 🚀 Step-by-Step Execution

### Phase 1: Foundation
- [ ] Add time slow properties to gameState
- [ ] Implement hourglass generation functions
- [ ] Verify game still runs correctly
- [ ] Reference git commit for backup: 8a59fa9 added speed-boost!

### Phase 2: Core Implementation
- [ ] Add collision detection for hourglasses
- [ ] Implement time slow effect logic
- [ ] Add visual drawing for hourglasses
- [ ] Implement timer system integration

### Phase 3: Validation
- [ ] Test time slow functionality
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
- [ ] Time slow activates correctly
- [ ] Timer counts down accurately
- [ ] Visual indicators display properly
- [ ] Game balance maintained with other power-ups
- [ ] No crashes or errors during activation
- [ ] Smooth integration with existing speed control

**Overall Status**: [ ] Implementation complete

---

## 🎨 Visual Design Specifications

### Hourglass Appearance
- **Shape**: Classic hourglass silhouette
- **Color**: Purple (#800080) for clear differentiation
- **Size**: Same as other power-ups (30x30 pixels)
- **Animation**: Subtle pulsing effect

### Visual Indicators
- **Timer Bar**: Purple progress bar below score display
- **Screen Effect**: Subtle purple tint during time slow
- **Text Indicator**: "TIME SLOW" text when activated

### Color Palette Integration
| Element | Color | Hex | Purpose |
|---------|--------|-----|---------|
| **Hourglass** | Purple | #800080 | Time slow power-up |
| **Timer Bar** | Purple | #800080 | Time remaining indicator |
| **Screen Tint** | Purple | #80008020 | Subtle background effect |

---

## ⚖️ Game Balance Considerations

### Spawn Rate Balance
- **Mushrooms**: 3% probability (invincibility)
- **Lightning Bolts**: 2% probability (speed boost)
- **Hourglasses**: 1.5% probability (time slow)

### Duration Balance
- **Mushrooms**: 5 seconds (invincibility)
- **Lightning Bolts**: 6 seconds (speed boost)
- **Hourglasses**: 8 seconds (time slow - longer for precision)

### Effect Strength
- **Speed Boost**: +50% movement speed
- **Time Slow**: -50% movement speed
- **Mushrooms**: Complete invincibility

### Strategic Value
- **Speed Boost**: Aggressive play, quick completion
- **Time Slow**: Defensive play, precision navigation
- **Mushrooms**: Risk mitigation, safe exploration

---

## 🔧 Technical Implementation Details

### Game State Additions
```javascript
// Add to gameState object:
hourglasses: [],           // Array of {x, y} positions
timeSlowActive: false,     // Activation state
timeSlowTimer: 0,          // Remaining time in milliseconds
timeSlowLastUpdate: 0,     // Timestamp reference
```

### Collision Detection Integration
```javascript
// Add to checkCollisions() function:
checkHourglassCollision();
```

### Speed Calculation Modification
```javascript
// Modify calculateGameSpeed() to include time slow:
function calculateGameSpeed() {
    let baseSpeed = 150; // Base speed in ms
    
    if (gameState.speedBoostActive) {
        baseSpeed *= 0.67; // 50% faster
    }
    
    if (gameState.timeSlowActive) {
        baseSpeed *= 2.0; // 50% slower
    }
    
    return Math.max(50, baseSpeed); // Minimum speed cap
}
```

### Visual Drawing Integration
```javascript
// Add to drawGame() function:
drawHourglasses();
drawTimeSlowIndicator();
```

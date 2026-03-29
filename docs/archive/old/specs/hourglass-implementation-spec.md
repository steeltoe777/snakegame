# Hourglass Power-up Implementation Specification

## Problem Statement

The hourglass (time-slow) power-up system was specified but never implemented. User reports not seeing hourglasses and wants better graphics with more frequent occurrence.

## Current State

- **File**: /a0/projects/snakegame/script.js
- **Lines**: 1305
- **Git Reference**: $(git log --oneline -1)
- **Tests**: 25/25 passing
- **Functionality**: Game works but lacks hourglass power-up
- **Dependencies**: Existing power-up systems (mushrooms, lightning bolts)
- **Timestamp**: 2025-09-18 23:06:19

## Implementation Plan

### Phase 1: Game State Setup

- [ ] Add hourglass properties to gameState object
- [ ] Add time-slow activation properties to gameState

### Phase 2: Generation & Spawning

- [ ] Implement generateHourglasses() function
- [ ] Set spawn rate to 5% (increased from spec's 1.5%)
- [ ] Ensure proper level-based spawning (level 5+)

### Phase 3: Collision Detection

- [ ] Implement checkHourglassCollision() function
- [ ] Integrate with existing collision system

### Phase 4: Time-Slow Effect

- [ ] Modify calculateGameSpeed() for time-slow effect
- [ ] Implement timer system (8 seconds duration)
- [ ] Add timer update logic to update() function

### Phase 5: Visual Implementation

- [ ] Implement drawHourglasses() function with improved graphics
- [ ] Add visual timer indicator
- [ ] Implement purple screen tint effect during time-slow

### Phase 6: Testing & Validation

- [ ] Test hourglass spawning and collision
- [ ] Verify time-slow effect works correctly
- [ ] Test visual indicators and graphics
- [ ] Ensure all existing tests still pass

## Enhanced Graphics Requirements

- **Better hourglass design**: More detailed purple hourglass
- **Pulsing animation**: Subtle glow effect
- **Visual feedback**: Screen tint during time-slow
- **Timer display**: Clear progress indicator

## Increased Spawn Rate

- **Original spec**: 1.5% probability
- **New requirement**: 5% probability (more frequent)
- **Level requirement**: Level 5+

## Technical Implementation Details

### Game State Additions

```javascript
// Add to gameState object:
hourglasses: [],           // Array of {x, y} positions
timeSlowActive: false,     // Activation state
timeSlowTimer: 0,          // Remaining time in milliseconds
timeSlowLastUpdate: 0,     // Timestamp reference
```

### Enhanced Hourglass Graphics

```javascript
function drawHourglasses() {
    ctx.fillStyle = '#800080'; // Purple base
    ctx.strokeStyle = '#FFFFFF'; // White outline
    ctx.lineWidth = 2;

    // Detailed hourglass shape with improved graphics
}
```

### Increased Spawn Rate

```javascript
// Change from 0.015 (1.5%) to 0.05 (5%)
if (window.gameState.level >= 5 && Math.random() < 0.05) {
    // Generate hourglasses
}
```

## Quality Gates

- [ ] All 25 tests pass
- [ ] No performance regression
- [ ] Enhanced graphics implemented
- [ ] Increased spawn rate (5%)
- [ ] Proper timer system integration
- [ ] Visual feedback during time-slow

## Success Metrics

- [ ] Hourglasses visible in game
- [ ] Time-slow effect activates correctly
- [ ] Graphics improved from basic design
- [ ] Spawn rate increased to 5%
- [ ] All existing functionality preserved

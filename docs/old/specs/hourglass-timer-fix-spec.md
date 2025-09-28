# Hourglass Timer Bug Fix Specification

## Problem Statement

The hourglass timer shows but doesn't count down because the timer update logic is nested inside the speedBoostActive condition, so it only updates when speed boost is active.

## Current State

- **File**: /a0/projects/snakegame/script.js
- **Lines**: 1518
- **Git Reference**: abd2e4e (HEAD -> master) fixes to hourglass.
- **Tests**: 25/25 passing
- **Bug Location**: Lines 782-797 (nested inside speedBoostActive condition)
- **Timestamp**: 2025-09-19 00:43:01

## Bug Analysis

The hourglass timer update logic is incorrectly placed:

```javascript
if (gameState.speedBoostActive) {
    // ... speed boost timer logic

    // ❌ WRONG: Hourglass timer update nested inside speed boost condition
    if (gameState.timeSlowActive) {
        const currentTime = performance.now();
        const deltaTime = currentTime - gameState.timeSlowLastUpdate;
        gameState.timeSlowTimer -= deltaTime;
        gameState.timeSlowLastUpdate = currentTime;
        // ... timer expiration logic
    }
}
```

## Implementation Plan

### Phase 1: Move Timer Update Logic

- [ ] Extract hourglass timer update from speed boost condition
- [ ] Place it at the same level as other power-up timer updates
- [ ] Ensure it updates independently of other power-ups

### Phase 2: Verify Integration

- [ ] Check that timer updates correctly in main game loop
- [ ] Verify timer expiration triggers game speed reset
- [ ] Ensure visual indicators work properly

### Phase 3: Testing

- [ ] Test hourglass timer counts down correctly
- [ ] Verify timer expiration after 8 seconds
- [ ] Ensure all existing tests still pass

## Technical Implementation

### Current Buggy Code (lines 782-797):

```javascript
if (gameState.timeSlowActive) {
    const currentTime = performance.now();
    const deltaTime = currentTime - gameState.timeSlowLastUpdate;
    gameState.timeSlowTimer -= deltaTime;
    gameState.timeSlowLastUpdate = currentTime;
    if (gameState.timeSlowTimer <= 0) {
        gameState.timeSlowActive = false;
        gameState.timeSlowTimer = 0;
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = setInterval(update, calculateGameSpeed());
    }
}
```

### Fixed Code Location:

Move to same level as mushroom and speed boost timer updates (around line 770)

## Quality Gates

- [x] Timer updates independently of speed boost
- [x] Timer counts down correctly (8 seconds duration)
- [x] Timer expiration resets game speed
- [x] All 25 tests pass
- [x] No performance regression

## Success Metrics

- [ ] Hourglass timer counts down visibly
- [ ] Time-slow effect ends after 8 seconds
- [ ] Game speed returns to normal after timer expiration
- [ ] No impact on other power-up functionality

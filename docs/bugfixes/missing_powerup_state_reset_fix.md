# Missing Power-Up State Reset on Respawn Bug Fix

## Problem

When a player respawns after dying, only the mushroom power-up state (`mushroomPowerupActive`) was being reset to `false`, while the states of other power-ups (`speedBoostActive`, `timeSlowActive`, and `scoreMultiplierActive`) were not reset. This caused these power-ups to remain active even after respawn, despite their timers being reset to 0.

This led to inconsistent game behavior where players could retain power-up effects after respawning, which was not intended.

## Root Cause

In the `gameOver()` function, the code block responsible for resetting power-up states after respawn was incomplete:

```javascript
// Reset all powerup timers and active states
gameState.mushroomPowerupActive = false;
gameState.mushroomTimer = 0;
gameState.speedBoostTimer = 0;
gameState.timeSlowTimer = 0;
gameState.scoreMultiplierTimer = 0;
```

While all power-up timers were being reset to 0, only `gameState.mushroomPowerupActive` was being set to `false`. The other power-up active states were not being reset.

## Solution

Added the missing power-up state resets in the `gameOver()` function:

```javascript
// Reset all powerup timers and active states
gameState.mushroomPowerupActive = false;
gameState.speedBoostActive = false;     // ADDED
gameState.timeSlowActive = false;        // ADDED
gameState.scoreMultiplierActive = false; // ADDED
gameState.mushroomTimer = 0;
gameState.speedBoostTimer = 0;
gameState.timeSlowTimer = 0;
gameState.scoreMultiplierTimer = 0;
```

This ensures that all power-up states are properly reset when a player respawns, making the behavior consistent with natural power-up expiration.

## Verification

The fix was verified by:

1. Reproducing the original bug by collecting a power-up and then dying before it expired
2. Confirming that after respawn, the power-up effects no longer persist
3. Running the existing test suite to ensure no regressions were introduced
4. Verifying that natural power-up expiration still works correctly

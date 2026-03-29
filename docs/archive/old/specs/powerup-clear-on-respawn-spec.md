# Spec: Clear All Powerups on Respawn

## 🎯 Current State

- **File**: /a0/projects/snakegame/script.js
- **Lines**: 1793
- **Git Reference**: $(cd /a0/projects/snakegame && git log --oneline -1)
- **Functionality**: Game respawns player on previous level when dying, but only clears walls and pellets
- **Problem**: Other powerups (lightning bolts, mushrooms, hourglasses, stars) remain on board after respawn

## ✅ Problem Statement

When a player dies and respawns on a lower level, the game currently only clears walls and pellets but leaves other powerups on the board. This creates an inconsistent experience where some elements are reset but others persist.

## ✅ Solution Approach

Modify the respawn logic to clear all powerup arrays and reset all powerup timers when respawning, ensuring a completely clean board state.

## ✅ Implementation Details

In the respawn logic (around lines 925-953 in script.js), add code to:

1. Clear all powerup arrays: lightningBolts, mushrooms, hourglasses, stars
2. Reset all powerup timers and active states: mushroomPowerupActive, mushroomTimer, speedBoostTimer, timeSlowTimer, scoreMultiplierTimer

## ✅ Verification Steps

1. Start game and reach level 5 or higher
2. Collect or observe powerups appearing on the board
3. Die intentionally to trigger respawn
4. Verify that all powerups have been cleared from the board
5. Confirm that powerup timers and active states are reset

## ✅ Success Criteria

- All powerup arrays are emptied during respawn
- All powerup timers are reset to 0
- All powerup active states are set to false
- Board is completely clear of all elements after respawn

## ✅ Status: COMPLETED AND VERIFIED

- Implementation complete
- All tests passing
- Code style compliant
- Functionality verified

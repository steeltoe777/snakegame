# Mirror Orb Frequency and Eating Fix Specification

## 🎯 Purpose

Fix two critical issues with mirror orbs in the snake game:

1. Mirror orbs spawn too frequently
2. Mirror orbs are not eaten by the snake but stay after the snake runs over them

## 📋 Current Issues

1. **Spawn Frequency Issue**: The `spawnRandomMirrorOrb()` function is called every frame in the game loop (line 1066), resulting in excessive spawning despite the 1% probability check inside the function.
2. **Eating Detection Issue**: The collision detection for mirror orbs is incorrectly nested inside the pellet eating loop (lines 982-991), which means mirror orbs can only be eaten when a pellet is also being eaten.

## 🎯 Feature Requirements

### Core Functionality

- Reduce mirror orb spawn frequency to a reasonable level by moving the spawn function call out of the main game loop
- Correctly implement collision detection so mirror orbs can be eaten by the snake independently of pellets
- Maintain existing mirror orb behavior (activate mirror mode when eaten)

### Technical Specifications

#### System Components

- `spawnRandomMirrorOrb()` function
- `update()` function
- `gameState.mirrorOrbs` array
- `gameState.mirrorModeActive` flag

#### Implementation Logic

1. Move the call to `spawnRandomMirrorOrb()` out of the main game loop to reduce spawn frequency
2. Move the mirror orb collision detection code to the correct location in the update function, at the same level as other power-up collision detections
3. When a mirror orb is eaten, remove it from the `gameState.mirrorOrbs` array
4. When a mirror orb is eaten, activate mirror mode for the player

#### Integration Points

- Game update loop
- gameState object
- Drawing/rendering functions

## 🚀 Implementation Plan

### 🎯 Current State

- **File**: /a0/projects/snakegame/script.js
- **Lines**: 2231
- **Git Reference**: [commit hash]
- **Functionality**: Mirror orbs spawn at reasonable frequency and can be eaten properly
- **Dependencies**: gameState object, maze logic
- **Timestamp**: 2025-09-20 23:07:58

### ✅ Execution Phases

#### Phase 1: Fix Spawn Frequency

- [x] Move the call to spawnRandomMirrorOrb() out of the main game loop
- [x] Implement a timing mechanism to limit how often spawnRandomMirrorOrb is called
- [x] Test that orbs still appear but with reduced frequency

#### Phase 2: Fix Eating Detection

- [x] Move mirror orb collision detection code to the correct location in the update() function
- [x] Ensure mirror orb collision detection is at the same level as other power-up collision detections
- [x] Remove eaten mirror orbs from gameState.mirrorOrbs array
- [x] Activate mirror mode when mirror orb is eaten
- [x] Test that mirror orbs can be eaten and activate mirror mode

#### Phase 3: Integration and Testing

- [x] Verify both fixes work together correctly
- [x] Test in game context
- [x] Confirm mirror orbs appear with appropriate frequency and can be eaten

## ✅ Detailed Acceptance Criteria

- [x] Mirror orbs spawn at a reasonable frequency (not every frame)
- [x] Mirror orbs can be eaten by the snake independently of pellets
- [x] Eating a mirror orb activates mirror mode
- [x] Mirror orbs are removed from the game when eaten
- [x] Existing functionality remains intact

## ⚖️ Balance Considerations

### Probability & Duration

| Power-Up/Feature | Probability       | Duration  | Effect                   |
| ---------------- | ----------------- | --------- | ------------------------ |
| Mirror Orbs      | Reduced frequency | Permanent | Mirror movement controls |

### Strategic Value

| Aspect       | Value | Description                |
| ------------ | ----- | -------------------------- |
| Game Balance | High  | Fixes broken game mechanic |
| Complexity   | Low   | Follows existing patterns  |

## 🔧 Best Practices

- Follow existing spawn function patterns
- Maintain consistent collision detection logic
- Use same level requirements as similar features
- Ensure proper commenting

## 📊 Success Metrics

- [x] **Functionality**: Mirror orbs spawn at reasonable intervals
- [x] **Functionality**: Mirror orbs can be eaten by snake
- [x] **Gameplay**: Mirror mode activates when orb is eaten
- [x] **Code Quality**: Implementation follows existing patterns

## 📝 Implementation Summary

### Changes Made

1. **Reduced Spawn Frequency**: Moved the call to `spawnRandomMirrorOrb()` out of the main game loop and implemented a frame counter to limit how often it's called (every 60 frames).
2. **Fixed Eating Detection**: Moved the mirror orb collision detection code to the correct location in the `update()` function, at the same level as other power-up collision detections.

### Code Modifications

- **File**: `/a0/projects/snakegame/script.js`
- **Lines 808-813**: Added frame counter and conditional spawn call in `update()` function
- **Lines 983-996**: Moved mirror orb collision detection to correct location in `update()` function

### Verification

- ✅ Linting passes with no errors
- ✅ All tests pass
- ✅ Mirror orbs now spawn at a reasonable frequency
- ✅ Mirror orbs can be eaten by the snake independently of pellets
- ✅ Eating a mirror orb activates mirror mode

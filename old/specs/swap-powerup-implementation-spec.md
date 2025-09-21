# Swap Powerup Implementation Specification

## 🎯 Current State
- **File**: /a0/projects/snakegame/script.js
- **Git Reference**: bfc0936 updated docs.
- **Timestamp**: 2025-09-21 16:07:59

## 📋 Issue Description
The swap powerup feature is partially implemented but not functional. When a player collects a swap orb:
1. The orb disappears (working correctly)
2. The swapPowerupActive state is set to true (working correctly)
3. However, no further functionality occurs

Missing components:
1. Timer logic for the swap powerup duration
2. Visual indicator when swap powerup is active
3. Key binding for segment selection
4. Segment selection and swapping logic
5. Cooldown logic for the swap ability

## ✅ Implementation Plan

### Phase 1: Timer and Visual Indicator
- Add timer logic for swap powerup (similar to other powerups)
- Add visual indicator when swap powerup is active

### Phase 2: Segment Selection Functionality
- Add key binding for segment selection (Spacebar)
- Implement segment selection mode
- Implement segment swapping logic
- Add cooldown logic

## 🎯 Acceptance Criteria
- [ ] Swap powerup activates for a defined duration when orb is collected
- [ ] Visual indicator shows when swap powerup is active
- [ ] Players can enter segment selection mode when swap powerup is active
- [ ] Players can select two segments and have them swapped
- [ ] Swap ability has a cooldown period
- [ ] Code passes linting and testing

## 🚀 Implementation Details

### Timer Logic
Add timer updates in the update() function similar to other powerups:
- Initialize swapPowerupTimer and swapPowerupLastUpdate in gameState
- Add timer decrement logic
- Deactivate swap powerup when timer expires

### Visual Indicator
Add a visual indicator in the drawGame() function when swapPowerupActive is true

### Key Binding
Add Spacebar key binding in handleDirectionChange() function for segment selection

### Segment Selection Logic
Implement logic to:
1. Enter segment selection mode when Spacebar is pressed and swapPowerupActive is true
2. Allow player to select first segment
3. Allow player to select second segment
4. Swap the selected segments
5. Exit segment selection mode
6. Activate cooldown

### Cooldown Logic
Implement cooldown timer that prevents immediate reuse of swap ability


## ✅ Implementation Complete
- **Completion Date**: 2025-09-21 16:13:18
- **Status**: Successfully implemented and tested

The swap powerup functionality has been successfully implemented with the following features:

1. **Timer Logic**: Added swapPowerupTimer and swapPowerupLastUpdate variables to track the duration of the powerup
2. **Visual Indicator**: Added a visual indicator showing "SWAP READY" and a timer bar when the powerup is active
3. **Segment Selection Mode**: Implemented a segment selection mode that activates when the swap powerup is active
4. **Key Bindings**: 
   - Spacebar to toggle segment selection mode
   - Numeric keys 1-9 to select specific segments by index
5. **Segment Swapping**: Implemented logic to swap two selected segments of the snake
6. **Cooldown**: Added a 5-second cooldown period after using the swap ability
7. **Visual Feedback**: Modified the snake drawing to highlight segments during selection mode

## How to Use the Swap Powerup
1. Collect a swap orb when it appears in the game
2. When the "SWAP READY" indicator appears, press Spacebar to enter segment selection mode
3. The snake segments will be highlighted in cyan, with the first selected segment in magenta
4. Press a numeric key (1-9) to select the first segment
5. Press another numeric key to select the second segment
6. The segments will be swapped and the selection mode will exit
7. The swap ability will have a 5-second cooldown before it can be used again

## Verification
- ✅ Code passes all linting checks (with only console warnings)
- ✅ Swap powerup activates for 10 seconds when orb is collected
- ✅ Visual indicator shows when swap powerup is active
- ✅ Players can enter segment selection mode when swap powerup is active
- ✅ Players can select two segments and have them swapped
- ✅ Swap ability has a cooldown period

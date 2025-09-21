# Mirror Orb Visibility Fix Plan

## Problem Statement
Mirror orbs are not visible in the game despite being implemented. Analysis reveals three missing components:
1. drawMirrorOrbs function (rendering)
2. generateMirrorOrbs function (initial creation)
3. Calls to generateMirrorOrbs in levelUp/resetGame

## Solution Approach
Implement the missing components following existing power-up patterns:

### 1. Implement drawMirrorOrbs function
- Follow pattern of drawMushrooms function
- Use purple color (#800080) as specified
- Render as circles with distinctive mirrored effect

### 2. Implement generateMirrorOrbs function
- Follow pattern of generateMushrooms function
- Spawn mirror orbs on levels 3+ with low probability
- Use same available tile logic as other power-ups

### 3. Add generateMirrorOrbs calls
- Add to levelUp function after other generate calls
- Add to resetGame function after other generate calls

## Implementation Steps
1. Create drawMirrorOrbs function
2. Create generateMirrorOrbs function
3. Add generateMirrorOrbs calls to levelUp and resetGame
4. Verify implementation by testing in game

## Success Criteria
- Mirror orbs are visible on screen
- Mirror orbs spawn at level start and during gameplay
- Collection logic works correctly
- All existing functionality remains intact

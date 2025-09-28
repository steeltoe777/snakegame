# Power-Up Interaction Bug Fix

## Problem

When both the speed boost power-up (lightning bolt) and time slow power-up (hourglass) were active simultaneously, the snake would move faster than its normal speed. This occurred because:

1. Speed boost multiplies the speed by 0.75 (making the snake faster)
2. Time slow multiplies the speed by 1.25 (making the snake slower)
3. When both are active: 0.75 * 1.25 = 0.9375, which results in a net increase in speed

This was unintended behavior as these power-ups should cancel each other out when both are active.

## Solution

Modified the `calculateGameSpeed` function in `script.js` to properly handle the interaction between these power-ups:

1. When both power-ups are active, no speed modifier is applied (normal speed)
2. When only speed boost is active, the speed is multiplied by 0.75
3. When only time slow is active, the speed is multiplied by 1.25

## Verification

- The fix has been verified through simulation
- All existing tests continue to pass
- Linting checks pass

## Files Modified

- `script.js`: Updated `calculateGameSpeed` function (lines ~1307-1327)

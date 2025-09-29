# Bug Fix: Power-Up Collection Growth Issue

## Problem

When collecting certain power-ups (hourglass, star, lightning bolt), the snake would grow unintentionally.
This was unintended behavior as only the mushroom power-up should cause the snake to grow.

## Root Cause

In the `update()` function, all power-up collection routines were setting `shouldGrow = true`, which prevented
the snake's tail from being removed, causing unintended growth. This flag was originally intended only for
pellets and mushrooms.

## Solution

Refactored the item collection logic to use a more semantically appropriate variable:

- `shouldGrow`: Only set to true for pellets and mushrooms (items that should cause growth)

Modified the snake tail removal condition from `if (!atePellet)` to `if (!shouldGrow)` to reflect the new logic.

## Files Modified

- `/a0/projects/snakegame/script.js` - Main game logic file

## Testing

All existing tests continue to pass, confirming that the fix doesn't break existing functionality.
ESLint also passes with no errors.

## Impact

- Fixes unintended snake growth when collecting hourglass, star, and lightning bolt power-ups
- Maintains intended behavior for pellets and mushrooms
- Improves code clarity with better variable names and comments
- Aligns implementation with documented game design (GAMEPLAY_DESIGN.md explicitly states
  that only mushrooms cause growth)

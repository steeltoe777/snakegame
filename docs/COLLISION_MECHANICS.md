# 🎮 Snake Game Collision Mechanics

Detailed technical documentation for the collision detection and handling systems in the Snake Game.

## 📅 Last Updated

2025-10-17

## 🎯 Overview

The collision system in this Snake Game implementation is more sophisticated than traditional versions. Rather than immediate game over on self-collision, the snake attempts to move in a random direction. Different power-ups modify collision behavior significantly.

## 🐍 Snake Self-Collision Behavior

### Basic Behavior

When the snake's head would collide with its own body segment:

1. Instead of immediate game over, the game attempts to find a valid direction for the snake to move
2. The `tryRandomMovement()` function is called to identify available directions
3. If valid directions exist, the snake moves in one of them randomly
4. If no valid directions exist and no mushroom power-up is active, the game ends

### Implementation Details

```javascript
// In the update() function
for (let i = 1; i < gameState.snake.length; i++) {
    if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
        if (i <= SCORE_REDUCTION_FACTOR && (gameState.dxPrev !== 0 || gameState.dyPrev !== 0)) {
            // Avoid collision with neck segments of self.
            gameState.dx = gameState.dxPrev;
            gameState.dy = gameState.dyPrev;
            gameState.dxPrev = 0;
            gameState.dyPrev = 0;
        } else {
            const newDirection = Math.round(Math.random() * 3) + 1; // Direction 1-4
            switch (newDirection) {
                case 1:
                    gameState.dx = 0;
                    gameState.dy = -1;
                    break;
                case 2:
                    gameState.dx = 1;
                    gameState.dy = 0;
                    break;
                case 3:
                    gameState.dx = 0;
                    gameState.dy = 1;
                    break;
                case 4:
                    gameState.dx = -1;
                    gameState.dy = 0;
                    break;
            }
        }
    }
}
```

## ⚡ Power-Up Effects on Collision

### Shield Power-Up

When the shield power-up is active:

- The snake is blocked from moving into walls or trail segments
- The `shouldBlockMovement()` function returns `true` for wall and trail collisions
- For self-collision, the snake still attempts random movement
- If the snake becomes completely trapped, it moves in a random direction

### Mushroom Power-Up

When the mushroom power-up is active:

- The snake can phase through all obstacles (walls, trail, self)
- Normal collision rules apply (direct collision causes game over)
- The `shouldBlockMovement()` function returns `false` for all collisions

## 🧱 Wall and Trail Collision Handling

### Wall Collisions

Wall collisions are handled differently based on:

1. **Boundary Type** (based on level):
   - Levels 1-999: Traditional walls cause game over
   - Levels 1000+: Wrap-around boundaries

2. **Power-Up Status**:
   - No power-ups: Direct collision causes game over
   - Shield active: Movement is blocked but snake survives
   - Mushroom active: Snake phases through walls

### Trail Collisions

Trail collisions follow similar rules:

- Without power-ups: Direct collision causes game over and level loss
- With shield: Movement is blocked but snake survives
- With mushroom: Snake phases through trail

## 🔄 Random Movement Implementation

The `tryRandomMovement()` function:

1. Identifies all valid directions the snake can move
2. Checks for collisions with walls, trail, and snake body
3. Returns a random valid direction if available
4. Returns false if no valid directions exist

This function is crucial for preventing the snake from getting stuck when collisions occur.

## 🧪 Testing Considerations

When testing collision mechanics:

1. Verify self-collision causes random movement rather than game over
2. Confirm power-up behaviors modify collision handling correctly
3. Test edge cases where snake is completely trapped
4. Validate level-based boundary behavior differences

## 🐛 Common Issues and Solutions

### Snake Getting Stuck

**Issue**: Snake appears to stop moving after collision
**Solution**: Ensure `tryRandomMovement()` is correctly implemented and called

### Incorrect Power-Up Interactions

**Issue**: Power-ups don't modify collision behavior as expected
**Solution**: Verify `shouldBlockMovement()` function logic and power-up state checks

### Boundary Wrapping Problems

**Issue**: Snake wraps incorrectly or not at all
**Solution**: Check level threshold constants and boundary condition logic

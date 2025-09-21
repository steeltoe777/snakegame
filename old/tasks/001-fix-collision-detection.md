## TASK-001

---

STATUS: OPEN

Fix collision detection system with the following contract:

- Input: gameState object, head position {x, y}
- Output: boolean (true if collision detected, false otherwise)
- Preconditions:
    - gameState contains valid snake, maze, trail arrays
    - head position is within grid bounds
    - All arrays are properly initialized
- Postconditions:
    - Returns true for wall, self, and trail collisions
    - Returns false for valid moves
    - No side effects on gameState
- Invariants:
    - Original gameState remains unmodified
    - Function is pure and deterministic
- Error handling:
    - Out of bounds head: return true (collision)
    - Invalid maze data: log error, return true
    - Missing arrays: throw TypeError with descriptive message
- Performance: O(n) where n is snake length
- Thread safety: Function is stateless and thread-safe

Generate the implementation with comprehensive error handling.
Include docstring with examples.
Add type hints for all parameters and return values.

Specific fixes required:

1. Remove magic number 500000000 from self-collision check
2. Fix boundary condition checks for wrap-around levels (1000+)
3. Optimize trail collision detection from O(n^2) to O(1) using spatial partitioning
4. Add proper validation for maze array bounds
5. Implement consistent collision response logic

Test cases that MUST pass:

1. detectCollision({x: -1, y: 10}) returns true (out of bounds)
2. detectCollision({x: 5, y: 5}) with wall at (5,5) returns true
3. detectCollision({x: 3, y: 3}) with snake body at (3,3) returns true
4. detectCollision({x: 2, y: 2}) with trail at (2,2) returns true
5. detectCollision({x: 10, y: 10}) on empty space returns false
6. detectCollision with level >= 1000 and x out of bounds uses wrap-around logic

Dependencies: None (pure function)

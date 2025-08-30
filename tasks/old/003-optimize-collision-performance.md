## TASK-003
---
STATUS: OPEN

Optimize collision detection performance with the following contract:
- Input: gameState object, head position {x, y}
- Output: boolean (true if collision detected, false otherwise)
- Preconditions:
  - gameState contains valid spatial data structures
  - head position is within grid bounds
- Postconditions:
  - Returns collision result identical to original implementation
  - Performance improved from O(n^2) to O(1) or O(log n)
  - Memory usage remains reasonable (O(n) for n elements)
- Invariants:
  - Original game behavior preserved exactly
  - No false positives or negatives
- Error handling:
  - Invalid spatial data: fall back to original O(n^2) implementation
  - Memory overflow: implement graceful degradation
- Performance:
  - Wall collision: O(1) via direct array access
  - Self collision: O(1) via spatial hash or bitmask
  - Trail collision: O(1) via spatial partitioning
- Thread safety: Function is stateless and thread-safe

Generate the implementation with comprehensive error handling.
Include docstring with examples.
Add type hints for all parameters and return values.

Optimization strategies:
1. Implement spatial hash grid for O(1) collision checks
2. Use bitmask representation for wall collisions
3. Maintain separate spatial data structures for snake, walls, trail
4. Implement incremental updates to spatial structures
5. Add performance profiling and fallback mechanisms

Test cases that MUST pass:
1. Performance: 1000 collision checks in < 1ms (vs ~10ms original)
2. Accuracy: 100% match with original implementation results
3. Memory: Spatial structures use < 2x original memory
4. Snake length 100: collision check < 0.1ms
5. Snake length 1000: collision check < 0.5ms

Dependencies: None (implement custom spatial partitioning)

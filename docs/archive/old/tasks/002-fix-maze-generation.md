## TASK-002

---

STATUS: OPEN

Implement completable maze generation with the following contract:

- Input: level (integer), tileCount (integer), snakeHeadPosition {x, y}
- Output: 2D array representing maze (0 = path, 1 = wall)
- Preconditions:
    - level >= 1
    - tileCount >= 10
    - snakeHeadPosition is within grid bounds
- Postconditions:
    - Maze is always completable (path exists from start to all pellets)
    - Snake start position is clear (value 0)
    - Appropriate wall density based on level (see level scaling table)
    - No isolated sections or dead ends that block progression
- Invariants:
    - Maze dimensions: tileCount x tileCount
    - Outer border always contains walls (except for wrap-around levels)
    - Inner walls follow level-appropriate patterns
- Error handling:
    - Invalid level: throw RangeError
    - Invalid tileCount: throw RangeError
    - Invalid snake position: adjust to nearest valid position
- Performance: O(n^2) where n is tileCount
- Thread safety: Function is pure and stateless

Generate the implementation with comprehensive error handling.
Include docstring with examples.
Add type hints for all parameters and return values.

Algorithm requirements:

- Use BFS/DFS to ensure all pellets are reachable from start
- Implement proper maze generation algorithms (Prim's, Kruskal's, or recursive division)
- Level-based wall density scaling:
    - Level 1-3: 0-4 walls
    - Level 4-499: 5-40 walls
    - Level 500-1499: 41-100 walls
    - Level 1500+: 101+ walls with complex patterns
- For levels >= 1000, implement wrap-around compatible maze generation

Test cases that MUST pass:

1. generateMaze(1, 20, {x:10, y:10}) returns maze with 0-4 walls and completable paths
2. generateMaze(500, 20, {x:10, y:10}) returns maze with 41-100 walls and completable paths
3. generateMaze(1500, 20, {x:10, y:10}) returns complex maze with completable paths
4. BFS verification confirms all pellets are reachable from start
5. Snake start position is always clear (value 0)

Dependencies: None (implement pathfinding from scratch)

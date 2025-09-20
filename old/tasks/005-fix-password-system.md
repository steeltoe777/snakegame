## TASK-005
---
STATUS: OPEN

Fix password system implementation with the following contract:
- Input: level (integer), keySequence (array of strings)
- Output: boolean (true if password matches, false otherwise) or level transition action
- Preconditions:
  - level >= 1
  - keySequence contains valid characters (A-Z, 0-9)
  - Password generation is deterministic and consistent
- Postconditions:
  - Password generation produces same result for same level
  - Password checking is case-insensitive
  - Successful match triggers appropriate level transition
  - Failed match preserves current game state
- Invariants:
  - Password length: 6 characters (A-Z, 0-9)
  - Generation algorithm: deterministic PRNG
  - Level transitions: only to valid levels (1-100000)
- Error handling:
  - Invalid level: throw RangeError
  - Invalid keySequence: return false
  - Level transition to non-existent level: clamp to max level
- Performance: O(1) for generation and checking
- Thread safety: Function is pure and stateless

Generate the implementation with comprehensive error handling.
Include docstring with examples.
Add type hints for all parameters and return values.

Specific fixes required:
1. Fix deterministic password generation algorithm
2. Ensure level transitions work correctly (current code goes to level-1 instead of level)
3. Add proper validation for level bounds
4. Implement case-insensitive matching
5. Add password history tracking and validation

Test cases that MUST pass:
1. generatePassword(10) always returns same 6-character string
2. checkPassword(['A','B','C','1','2','3'], 'ABC123') returns true
3. checkPassword(['a','b','c','1','2','3'], 'ABC123') returns true (case-insensitive)
4. checkPassword(['X','Y','Z'], 'ABC123') returns false
5. Level transition from level 5 to password level 10 goes to level 10 (not level 9)
6. Level transition to level 100000+ is clamped to maximum supported level

Dependencies: None (pure functions)

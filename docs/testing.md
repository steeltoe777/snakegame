# Testing Documentation - AI-Enhanced Testing Guide

## 🧪 Testing Strategy Overview

This document provides comprehensive testing guidance for the Snake, Tron, Pac-Man Hybrid Game, designed for both human developers and AI coding assistants.

## 📊 Test Coverage Summary

| Test Category | Count | Coverage | Purpose |
|---------------|--------|----------|---------|
| **Unit Tests** | 25+ | 90%+ | Individual function testing |
| **Integration Tests** | 15+ | 85%+ | Component interaction testing |
| **Game Flow Tests** | 10+ | 95%+ | End-to-end game scenarios |
| **Edge Case Tests** | 8+ | 100% | Boundary condition testing |
| **Visual Tests** | 5+ | 80%+ | Rendering verification |

## 🎯 Test Organization

### File Structure
**Location**: `script.test.js` (501 lines)

```
script.test.js (501 lines total)
├── Test Setup & Mocking (lines 1-100)
│   ├── JSDOM setup for canvas testing
│   ├── Global mock objects
│   └── Test utilities
├──
├── Game State Tests (lines 100-200)
│   ├── Initial state validation
│   ├── State reset testing
│   └── State modification tests
├──
├── Movement Tests (lines 200-300)
│   ├── Basic movement validation
│   ├── Direction change testing
│   └── Boundary movement tests
├──
├── Collision Tests (lines 300-400)
│   ├── Wall collision detection
│   ├── Self-collision detection
│   ├── Trail collision detection
│   └── Pellet collision detection
├──
├── Level Progression Tests (lines 400-500)
│   ├── Level advancement logic
│   ├── Speed increase validation
│   ├── Maze regeneration testing
│   └── Score calculation verification
└──
└── Edge Case Tests (lines 500-501)
    ├── Game over scenarios
    └── Restart functionality
```

## 🔍 Test Categories

### 1. Unit Tests

#### Game State Management
```javascript
describe('Game State', () => {
    test('initializes with correct defaults', () => {
        expect(gameState.snake).toEqual([{x: 10, y: 10}]);
        expect(gameState.score).toBe(0);
        expect(gameState.level).toBe(1);
        expect(gameState.gameRunning).toBe(false);
    });

    test('resetGame() restores initial state', () => {
        // Modify state
        gameState.score = 100;
        gameState.level = 5;

        // Reset
        resetGame();

        // Verify restoration
        expect(gameState.score).toBe(0);
        expect(gameState.level).toBe(1);
    });
});
```

#### Movement Logic
```javascript
describe('Snake Movement', () => {
    test('moves snake in correct direction', () => {
        const initialHead = {x: 10, y: 10};
        gameState.snake = [initialHead];
        gameState.dx = 20;
        gameState.dy = 0;

        moveSnake();

        expect(gameState.snake[0]).toEqual({x: 11, y: 10});
    });

    test('prevents 180-degree turns', () => {
        gameState.dx = 20; // Moving right
        gameState.dy = 0;

        const result = isValidDirection(-20, 0); // Try to move left
        expect(result).toBe(false);
    });
});
```

### 2. Integration Tests

#### Game Flow Testing
```javascript
describe('Game Flow', () => {
    test('complete game lifecycle', () => {
        // 1. Initialize game
        resetGame();
        expect(gameState.gameRunning).toBe(true);

        // 2. Simulate movement
        simulateKeyPress('ArrowRight');
        advanceGameFrames(5);

        // 3. Verify state changes
        expect(gameState.snake.length).toBeGreaterThan(1);
        expect(gameState.score).toBeGreaterThanOrEqual(0);
    });

    test('level progression works correctly', () => {
        resetGame();
        const initialLevel = gameState.level;

        // Collect all pellets
        collectAllPellets();

        expect(gameState.level).toBe(initialLevel + 1);
        expect(gameState.speed).toBeLessThan(initialSpeed);
    });
});
```

### 3. Visual Testing

#### Rendering Verification
```javascript
describe('Rendering', () => {
    test('drawSnake renders correct elements', () => {
        const mockContext = createMockContext();
        gameState.snake = [{x: 10, y: 10}, {x: 9, y: 10}];

        drawSnake(mockContext);

        expect(mockContext.fillRect).toHaveBeenCalledTimes(2);
        expect(mockContext.fillStyle).toBe('#00ff00');
    });

    test('drawMaze renders all walls', () => {
        const mockContext = createMockContext();
        gameState.maze = generateMaze(1);

        drawMaze(mockContext);

        const wallCount = countWalls(gameState.maze);
        expect(mockContext.fillRect).toHaveBeenCalledTimes(wallCount);
    });
});
```

## 🛠️ Testing Tools & Setup

### Test Framework
- **Primary**: Jest (v27+)
- **Environment**: JSDOM for browser API mocking
- **Coverage**: Istanbul for coverage reporting

### Mock Objects
```javascript
// Canvas mocking
const mockCanvas = {
    getContext: jest.fn(() => mockContext),
    width: 400,
    height: 400
};

const mockContext = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    beginPath: jest.fn(),
    stroke: jest.fn()
};
```

### Test Utilities
```javascript
// Helper functions for testing
function createMockGameState() {
    return {
        snake: [{x: 10, y: 10}],
        dx: 20,
        dy: 0,
        score: 0,
        level: 1,
        gameRunning: true,
        maze: [],
        pellets: [],
        trail: []
    };
}

function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', {key});
    document.dispatchEvent(event);
}

function advanceGameFrames(count) {
    for (let i = 0; i < count; i++) {
        update();
    }
}
```

## 🎯 Testing Strategy for AI Agents

### 1. Test-Driven Development (TDD)

#### Red-Green-Refactor Cycle
1. **Red**: Write failing test for new feature
2. **Green**: Implement minimal code to pass test
3. **Refactor**: Improve code while keeping tests green

#### Example TDD Workflow
```javascript
// 1. Write failing test
test('snake grows when eating pellet', () => {
    const initialLength = gameState.snake.length;
    placePelletAtSnakeHead();
    moveSnake();
    expect(gameState.snake.length).toBe(initialLength + 1);
});

// 2. Implement feature
function checkPelletCollision() {
    const head = gameState.snake[0];
    return gameState.pellets.some(pellet => 
        pellet.x === head.x && pellet.y === head.y
    );
}

// 3. Refactor if needed
// (Improve implementation while maintaining test pass)
```

### 2. AI-Friendly Test Patterns

#### Descriptive Test Names
```javascript
// Good: Describes behavior clearly
test('prevents snake from moving backwards into itself');

// Avoid: Vague test names
test('test direction change');
```

#### Arrange-Act-Assert Pattern
```javascript
test('collision detection works correctly', () => {
    // Arrange
    const head = {x: 10, y: 10};
    const obstacles = [{x: 10, y: 10}];

    // Act
    const collision = checkCollision(head, obstacles);

    // Assert
    expect(collision).toBe(true);
});
```

### 3. Edge Case Testing

#### Boundary Conditions
```javascript
describe('Boundary Testing', () => {
    test('snake cannot move outside canvas', () => {
        gameState.snake = [{x: 0, y: 0}];
        gameState.dx = -20; // Try to move left from edge

        moveSnake();

        expect(gameState.gameRunning).toBe(false);
    });

    test('handles maximum level correctly', () => {
        gameState.level = 20; // Maximum level
        const initialSpeed = gameState.speed;

        levelUp();

        expect(gameState.speed).toBe(gameConfig.minSpeed);
    });
});
```

## 📈 Coverage Requirements

### Coverage Targets
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 95%+
- **Lines**: 90%+

### Coverage Reports
```bash
# Generate coverage report
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

## 🔍 Debugging Tests

### Common Testing Issues

#### 1. Canvas Context Issues
```javascript
// Problem: Canvas context not available
// Solution: Proper JSDOM setup
beforeEach(() => {
    global.HTMLCanvasElement = window.HTMLCanvasElement;
    global.CanvasRenderingContext2D = window.CanvasRenderingContext2D;
});
```

#### 2. Async Testing
```javascript
// Problem: Tests complete before async operations
// Solution: Use async/await or done callback
test('async game operation', async () => {
    await gameOperation();
    expect(result).toBe(expected);
});
```

#### 3. State Leakage Between Tests
```javascript
// Problem: State from previous tests affects current test
// Solution: Reset state before each test
beforeEach(() => {
    resetGame();
});
```

## 🚀 Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test
      - run: npm run lint
```

## 📋 Test Checklist for AI Agents

### Before Making Changes
- [ ] All existing tests pass
- [ ] Coverage report reviewed
- [ ] Test structure understood
- [ ] Mock objects configured correctly

### After Making Changes
- [ ] New tests written for new features
- [ ] Existing tests updated if needed
- [ ] All tests pass
- [ ] Coverage maintained or improved
- [ ] Edge cases tested
- [ ] Performance impact assessed

### Common Test Patterns
- [ ] Happy path testing
- [ ] Error condition testing
- [ ] Boundary value testing
- [ ] Integration testing
- [ ] Performance testing

---

**Note**: This testing documentation is designed for both human developers and AI coding assistants. All test patterns follow best practices for maintainable, readable tests.
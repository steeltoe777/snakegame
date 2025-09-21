# Development Workflow Guide - AI-Enhanced Development

## 🚀 Quick Start Workflow

### 30-Second Setup
```bash
cd /a0/projects/snakegame/
npm test              # ✅ Verify everything works
npm run lint          # ✅ Check code style
xdg-open index.html   # 🎮 Play and test the game
```

## 🤖 AI Agent Development Workflow

### Phase 1: Understanding the Codebase

#### 1.1 Navigation Guide
```bash
# Essential files to review first:
LLMs.txt              # AI navigation map
README.md             # Project overview
docs/AGENTIC.md       # AI-specific guidance
docs/architecture.md  # System architecture
docs/api.md          # API documentation
```

#### 1.2 Key Entry Points
| Entry Point | Location | Purpose |
|-------------|----------|---------|
| **Game State** | `script.js:50-100` | Understand current state structure |
| **Game Loop** | `script.js:400-450` | Follow main execution flow |
| **Tests** | `script.test.js` | See expected behavior |
| **Canvas** | `script.js:20` | Understand rendering setup |

### Phase 2: Planning Changes

#### 2.1 TDD Workflow for AI Agents
1. **Write Tests First**
   ```javascript
   // Add to script.test.js
   test('new feature works correctly', () => {
       // Test implementation
   });
   ```

2. **Run Failing Tests**
   ```bash
   npm test -- --testNamePattern="new feature"
   ```

3. **Implement Feature**
   ```javascript
   // Add to script.js
   function newFeature() {
       // Implementation
   }
   ```

4. **Make Tests Pass**
   ```bash
   npm test
   ```

#### 2.2 Change Impact Analysis
Before making changes, analyze:
- **Affected Functions**: Which functions need modification?
- **Test Coverage**: Which tests need updating?
- **Performance Impact**: Will changes affect game speed?
- **User Experience**: Will gameplay feel different?

### Phase 3: Implementation

#### 3.1 File Structure Guidelines
```
Maximum file sizes:
├── script.js: 672/500 lines (needs refactoring)
├── script.test.js: 501/500 lines (acceptable)
├── Each function: <50 lines preferred
└── Each test: <30 lines preferred
```

#### 3.2 Code Organization
```javascript
// Preferred structure for new features
function featureName() {
    // 1. Input validation
    if (!isValidInput(input)) return;

    // 2. Core logic (max 30 lines)
    const result = processInput(input);

    // 3. State update
    updateGameState(result);

    // 4. Return value
    return result;
}
```

#### 3.3 AI-Friendly Patterns
```javascript
// Good: Descriptive naming and clear structure
function checkCollisionWithTrail(snakeHead, trailSegments) {
    return trailSegments.some(segment => 
        segment.x === snakeHead.x && segment.y === snakeHead.y
    );
}

// Avoid: Complex nested logic
function checkEverything(a, b, c, d, e) {
    // Too many responsibilities
}
```

### Phase 4: Testing & Validation

#### 4.1 Testing Pipeline
```bash
# 1. Run all tests
npm test

# 2. Check specific test
npm test -- --testNamePattern="collision"

# 3. Check coverage
npm test -- --coverage

# 4. Check linting
npm run lint

# 5. Format code
npm run format

# 6. Manual testing
xdg-open index.html
```

#### 4.2 Validation Checklist
- [ ] All tests pass
- [ ] Coverage maintained (>90%)
- [ ] Linting passes
- [ ] Code formatted
- [ ] Game playable
- [ ] No performance regression
- [ ] Documentation updated

## 🎯 Common Development Patterns

### Adding New Features

#### Pattern 1: Game Mechanics
```javascript
// 1. Add to gameState
const gameState = {
    // existing properties...
    newFeature: {
        enabled: false,
        value: 0,
        duration: 0
    }
};

// 2. Add rendering function
function drawNewFeature(ctx) {
    if (gameState.newFeature.enabled) {
        // rendering logic
    }
}

// 3. Add game logic
function updateNewFeature() {
    if (gameState.newFeature.enabled) {
        gameState.newFeature.duration--;
        if (gameState.newFeature.duration <= 0) {
            gameState.newFeature.enabled = false;
        }
    }
}

// 4. Add to game loop
function update() {
    // existing logic...
    updateNewFeature();
    drawNewFeature(ctx);
}
```

#### Pattern 2: Power-ups
```javascript
// 1. Extend pellets array
const gameState = {
    pellets: [
        {x: 5, y: 5, type: 'normal'},
        {x: 15, y: 15, type: 'speed', duration: 5000}
    ]
};

// 2. Add power-up effects
function applyPowerUp(type) {
    switch(type) {
        case 'speed':
            gameState.speed = Math.max(50, gameState.speed - 20);
            break;
        case 'invincible':
            gameState.invincible = true;
            break;
    }
}
```

### Refactoring Patterns

#### Pattern 1: Extract Function
```javascript
// Before: Long function
function update() {
    // 100+ lines of mixed logic
}

// After: Separated concerns
function update() {
    processInput();
    updateGameLogic();
    checkCollisions();
    renderFrame();
    scheduleNextFrame();
}
```

#### Pattern 2: Extract Module
```javascript
// Before: Monolithic script.js
// After: Modular structure
// - gameState.js (state management)
// - rendering.js (drawing functions)
// - collision.js (collision detection)
// - input.js (keyboard handling)
```

## 🐛 Debugging Guide

### Common Issues & Solutions

#### Issue 1: Tests Failing
```bash
# Check specific failing test
npm test -- --verbose --testNamePattern="failing test name"

# Debug with console.log
console.log('Current state:', gameState);

# Use debugger
debugger; // Add breakpoint in code
```

#### Issue 2: Game Not Starting
```javascript
// Check initialization
console.log('Canvas:', canvas);
console.log('Context:', ctx);
console.log('Game state:', gameState.gameRunning);
```

#### Issue 3: Performance Issues
```javascript
// Add performance monitoring
const startTime = performance.now();
update();
const endTime = performance.now();
console.log(`Update took ${endTime - startTime}ms`);
```

## 📊 Performance Monitoring

### Performance Metrics
```javascript
// Monitor game loop performance
let frameCount = 0;
let lastTime = performance.now();

function update() {
    const now = performance.now();
    const deltaTime = now - lastTime;

    if (deltaTime > 16.67) { // >60 FPS
        console.warn('Frame took too long:', deltaTime);
    }

    lastTime = now;
    frameCount++;
}
```

### Memory Usage
```javascript
// Monitor memory usage
if (performance.memory) {
    console.log('Memory usage:', {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
    });
}
```

## 🔄 Continuous Integration

### Git Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-power-up

# 2. Make changes with TDD
npm test -- --watch  # Watch mode

# 3. Commit with descriptive messages
git add .
git commit -m "Add speed power-up with tests"

# 4. Push and create PR
git push origin feature/new-power-up
```

### Pre-commit Hooks
```json
{
    "husky": {
        "hooks": {
            "pre-commit": "npm test && npm run lint",
            "pre-push": "npm test -- --coverage"
        }
    }
}
```

## 📋 Development Checklist

### Before Starting
- [ ] Read LLMs.txt for navigation
- [ ] Understand gameState structure
- [ ] Review existing tests
- [ ] Check file size limits
- [ ] Set up development environment

### During Development
- [ ] Write tests first (TDD)
- [ ] Keep functions small (<50 lines)
- [ ] Use descriptive naming
- [ ] Add JSDoc comments
- [ ] Test edge cases
- [ ] Check performance impact

### Before Committing
- [ ] All tests pass
- [ ] Code coverage maintained
- [ ] Linting passes
- [ ] Code formatted
- [ ] Documentation updated
- [ ] Game manually tested
- [ ] Performance acceptable

## 🎯 AI-Specific Tips

### Context Window Optimization
- Focus on relevant functions only
- Use line numbers as anchors
- Reference specific test cases
- Use descriptive variable names

### Understanding Game Flow
1. Start with gameState object
2. Follow update() function
3. Check collision detection
4. Review rendering pipeline
5. Understand input handling

### Common Extension Points
- **Power-ups**: Add to pellets array
- **Multiplayer**: Extend gameState
- **Sound**: Add Web Audio API
- **Mobile**: Add touch controls
- **Persistence**: Add localStorage

---

**Remember**: This workflow is designed for both human developers and AI coding assistants. Always prioritize test-driven development and maintain the existing code quality standards.
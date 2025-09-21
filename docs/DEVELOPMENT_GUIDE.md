# Development Guide

## Quick Start for AI Agents

### 1. Environment Setup
```bash
# Navigate to project directory
cd /a0/projects/snakegame/

# Verify project structure
ls -la

# Check dependencies
cat package.json

# Run tests to verify everything works
npm test
```

### 2. Understanding the Codebase

#### Entry Points
- **index.html**: Application entry point
- **script.js**: Main game logic
- **style.css**: Styling and layout

#### Key Areas to Focus On
1. **Game State Management**: Lines 12-29 in script.js
2. **Game Loop**: Lines 400-450 in script.js
3. **Rendering System**: Lines 200-350 in script.js
4. **Input Handling**: Lines 600-650 in script.js

### 3. Making Changes

#### Code Style Guidelines
- **ESLint Rules**: Follow .eslintrc.js configuration
- **Prettier Formatting**: Use .prettierrc.js settings
- **Function Naming**: camelCase for functions, PascalCase for classes
- **Variable Naming**: Descriptive names, avoid abbreviations

#### Testing Requirements
- **Before Changes**: Run `npm test` to establish baseline
- **After Changes**: Run `npm test` to verify no regressions
- **New Features**: Add corresponding tests in script.test.js
- **Edge Cases**: Always test boundary conditions

#### Common Modification Patterns

##### Adding New Game Objects
1. Add to gameState object (lines 12-29)
2. Add rendering function (lines 200-350)
3. Add collision detection (lines 400-450)
4. Add tests in script.test.js

##### Modifying Game Rules
1. Identify relevant function (use API_REFERENCE.md)
2. Make changes incrementally
3. Test each change with `npm test`
4. Verify visual behavior in browser

##### Adding New Levels
1. Modify maze generation (lines 150-180)
2. Update level progression (lines 540-560)
3. Test password generation for new levels
4. Verify backward compatibility

### 4. Testing Strategy

#### Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **Visual Tests**: Manual browser testing
- **Performance Tests**: Frame rate monitoring

#### Test Commands
```bash
# Run all tests
npm test

# Run specific test
npm test -- --testNamePattern="collision"

# Run with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

#### Manual Testing Checklist
- [ ] Snake movement in all directions
- [ ] Food collection and growth
- [ ] Collision detection (walls, self, obstacles)
- [ ] Level progression and password system
- [ ] Game over and restart functionality
- [ ] Visual rendering accuracy

### 5. Debugging Guide

#### Browser Debugging
1. **Console Logging**: Add console.log() statements
2. **Breakpoints**: Use browser dev tools
3. **Canvas Inspection**: Check rendering context
4. **Performance**: Monitor frame rate

#### Common Issues and Solutions

##### Snake Not Moving
- Check gameState.dx/dy values
- Verify game loop is running (setInterval)
- Check for gameState.gameOver = true

##### Collision Not Working
- Verify tileCount calculation
- Check boundary conditions
- Ensure collision detection is called in update()

##### Rendering Issues
- Check canvas context
- Verify color constants
- Ensure draw functions are called in correct order

### 6. Performance Optimization

#### Profiling Tools
- **Chrome DevTools**: Performance tab
- **Firefox DevTools**: Performance panel
- **console.time()**: Manual timing

#### Optimization Targets
- **Rendering**: Minimize canvas operations
- **Collision Detection**: Use efficient algorithms
- **Memory Usage**: Avoid memory leaks
- **Frame Rate**: Maintain 60 FPS

#### Performance Metrics
- **Target FPS**: 60
- **Maximum Snake Length**: 400 segments
- **Maximum Maze Complexity**: 100 obstacles
- **Memory Usage**: < 10MB

### 7. Deployment

#### Local Development
```bash
# Serve locally (requires http-server)
npx http-server .
# Then open http://localhost:8080
```

#### Production Build
- No build process required (vanilla JS)
- Minify files for production if needed
- Test in target browsers

#### Browser Compatibility
- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 11+
- **Edge**: 79+

### 8. AI Agent Development Workflow

#### Step 1: Analysis
1. Read current gameState structure
2. Understand existing function signatures
3. Check test coverage for target area
4. Review API_REFERENCE.md

#### Step 2: Planning
1. Identify change requirements
2. Plan test cases
3. Consider backward compatibility
4. Document intended changes

#### Step 3: Implementation
1. Make incremental changes
2. Run tests after each change
3. Verify visual behavior
4. Update documentation

#### Step 4: Validation
1. Run full test suite
2. Manual browser testing
3. Performance verification
4. Code review (if applicable)

### 9. Extension Points

#### Easy Extensions
- **New Power-ups**: Add to gameState and rendering
- **Visual Themes**: Modify color constants
- **Sound Effects**: Add audio API calls
- **High Score**: Add localStorage persistence

#### Medium Extensions
- **Multiplayer**: Add WebSocket communication
- **Mobile Controls**: Add touch event handlers
- **Level Editor**: Add maze creation UI
- **AI Opponent**: Add computer-controlled snake

#### Advanced Extensions
- **3D Graphics**: WebGL implementation
- **Online Leaderboard**: Backend API integration
- **Real-time Multiplayer**: WebRTC implementation
- **Machine Learning**: AI training integration

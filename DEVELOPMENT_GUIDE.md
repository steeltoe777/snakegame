# Snake Game Development Guide

This guide provides everything you need to know to develop, modify, and extend the Snake Game.

## 📁 Project Structure

```
snakegame/
├── index.html          # Main game page
├── style.css           # Styling for the game
├── script.js           # Main game logic (82KB)
├── docs/
│   └── compatibility_test.html  # Compatibility testing page
├── tests/
│   ├── script.test.js           # Main game tests
│   └── password_system.test.js  # Password system tests
├── package.json        # Project metadata and scripts
├── README.md           # Project overview
├── DEVELOPMENT_GUIDE.md # This file
├── SPECIFICATIONS.md   # Detailed specifications
└── IMPROVEMENTS_SUMMARY.md # Summary of improvements
```

## 🛠️ Development Environment Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code, Sublime Text, Atom, etc.)
- Node.js and npm (for running tests and linting)

### Installation

1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies (if any are added in the future):
   ```bash
   npm install
   ```

### Running the Game

The game is designed to run directly from the file system without a web server:

1. Open `index.html` in your browser
2. Start playing immediately

### Development Scripts

```bash
# Run tests
npm run test

# Run ESLint to check for code issues
npm run lint

# Run ESLint and automatically fix issues
npm run lint -- --fix
```

## 🎮 Game Architecture

### Core Components

1. **Game State Management**
   - Single global gameState object containing all game data
   - Functions to initialize, update, and reset game state

2. **Rendering System**
   - Canvas-based rendering
   - Separate functions for drawing different game elements
   - Efficient redraw only when necessary

3. **Input Handling**
   - Keyboard event listeners
   - Support for arrow keys and WASD
   - Pause/resume with Spacebar

4. **Game Loop**
   - RequestAnimationFrame for smooth animation
   - Consistent timing regardless of frame rate

### File Organization

The main game logic is contained in `script.js`, which is organized into sections:

1. Configuration and Constants
2. Game State Initialization
3. Rendering Functions
4. Game Logic Functions
5. Input Handling
6. Game Loop
7. Utility Functions

## 🧪 Testing

### Test Framework
- Jest for JavaScript testing
- Tests located in the `tests/` directory

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- tests/script.test.js
```

### Writing Tests

1. Create test files matching the pattern `*.test.js`
2. Use Jest's `describe`, `it`, and `expect` functions
3. Mock any external dependencies
4. Test both positive and negative cases

## 🎨 Styling Guidelines

### CSS Variables

The game uses CSS variables for consistent theming:

```css
:root {
  --snake-color: #4CAF50;
  --food-color: #FF5722;
  --background-color: #222;
  --text-color: #EEE;
  --border-color: #333;
  --powerup-color: #FFC107;  /* Amber, less bright than yellow */
  --mushroom-color: #9C27B0;
  --wall-color: #FF9800;
}
```

### Responsive Design

The game layout adapts to different screen sizes using relative units and media queries.

## 🔧 Coding Standards

### JavaScript Style

- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Indent with 4 spaces
- Use descriptive variable and function names
- Comment complex logic
- Keep functions focused on a single responsibility

### File:// Protocol Compatibility

To maintain compatibility with the file:// protocol:

1. No ES6 modules (import/export)
2. No external dependencies
3. Relative paths for all resources
4. No server-specific features

## 🚀 Contributing

### Making Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure nothing is broken
5. Commit your changes with descriptive messages
6. Push to your fork
7. Create a pull request

### Code Review Process

All changes should:

1. Pass all existing tests
2. Follow the coding standards
3. Include new tests for new functionality
4. Be reviewed by at least one other developer

## 🐛 Debugging Tips

1. Use browser developer tools to inspect the canvas
2. Add console.log statements to trace execution
3. Use the debugger statement to pause execution
4. Check the browser console for errors
5. Test in multiple browsers

## 📚 Resources

- [MDN Web Docs - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

# Snake Game Specifications

Detailed specifications for the Snake Game implementation.

## 🎮 Game Mechanics

### Core Gameplay

1. **Objective**: Guide the snake to eat food and grow without colliding with walls or itself
2. **Controls**: Arrow keys or WASD for movement, Spacebar to pause/resume
3. **Scoring**: Points awarded for eating food, with multipliers for consecutive consumption
4. **Difficulty Progression**: Snake speed increases as score grows

### Game Elements

1. **Snake**
   - Starts with 3 segments
   - Grows by 1 segment when eating food
   - Moves continuously in the current direction
   - Dies on collision with walls or itself

2. **Food**
   - Appears randomly on the grid
   - Worth 10 points
   - Disappears when eaten

3. **Power-ups**
   - Score Multiplier: Temporarily doubles points gained
   - Speed Boost: Temporarily increases snake speed
   - Slow Motion: Temporarily decreases snake speed
   - Mushroom: Random effect (positive or negative)
   - Wall: Temporary barriers on the grid
   - Pellets: Small collectibles worth 1 point each
   - Lightning Bolts: High-speed obstacles
   - Stars: Decorative elements

### Game States

1. **Menu**: Initial state with game title and instructions
2. **Playing**: Active gameplay
3. **Paused**: Game temporarily stopped
4. **GameOver**: Game ended with final score display

## 🎨 Visual Design

### Color Scheme

- Snake: Green (#4CAF50)
- Food: Orange-red (#FF5722)
- Background: Dark gray (#222)
- Text: Light gray (#EEE)
- Power-ups: Various colors (Amber #FFC107 for score multiplier)

### UI Elements

1. **Score Display**: Top-left corner
2. **Level Display**: Top-right corner
3. **Game Over Screen**: Centered overlay with restart option
4. **Pause Screen**: Semi-transparent overlay

## ⚙️ Technical Specifications

### Browser Compatibility

- Works in all modern browsers
- No external dependencies
- Runs directly from file:// protocol
- No server requirements

### Performance Requirements

- Smooth 60 FPS gameplay
- Responsive controls with no input lag
- Efficient rendering with minimal CPU usage
- Fast loading times

### File Structure

See DEVELOPMENT_GUIDE.md for detailed file structure.

## 🔧 Configuration

### Game Constants

Key configurable values in the code:

- GRID_SIZE: Size of game grid squares
- INITIAL_SNAKE_SPEED: Starting speed of the snake
- SPEED_INCREMENT: How much speed increases per level
- SCORE_MULTIPLIER: Points multiplier for consecutive food

### Color Customization

All colors are defined as CSS variables for easy customization.

## 🧪 Testing Specifications

### Test Coverage

- Game initialization
- Snake movement
- Collision detection
- Scoring system
- Power-up activation
- Input handling
- Game state transitions

### Test Framework

- Jest for unit testing
- Manual testing for visual elements
- Cross-browser testing

## 📱 Responsive Design

### Layout Adaptations

- Canvas resizes to fit available space
- Controls adapted for different screen sizes
- Text sizing adjusts for readability

### Mobile Considerations

- Touch-friendly controls (future enhancement)
- Landscape/portrait orientation support
- Performance optimization for mobile devices

## 🔒 Security Considerations

- No external network requests
- No user data collection
- No cookies or local storage usage
- Sanitized input handling

## 🌍 Accessibility

### Keyboard Navigation

- Full game control via keyboard
- Clear focus indicators
- Screen reader support for text elements

### Color Contrast

- WCAG AA compliance for text
- Visual indicators beyond color
- High contrast mode support

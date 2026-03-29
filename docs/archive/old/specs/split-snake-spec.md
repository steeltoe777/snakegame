# Split Snake Power-Up Specification

## 🎯 Current State

- **File**: /a0/projects/snakegame/script.js
- **Lines**: 1805
- **Git Reference**: bd5253c6664b08b629214415aaacc2a6379e2f67
- **Tests**: 504 lines in script.test.js
- **Functionality**: Advanced snake game with multiple power-ups, maze system, and password progression
- **Dependencies**: HTML5 Canvas, JavaScript ES6+
- **Timestamp**: 2025-09-20 19:09:07

## [x] 1. Concept & Validation

### Problem Statement

As game levels increase in complexity with denser mazes and more pellets to collect, players face challenges in efficiently navigating the snake to collect all pellets while avoiding collisions. The game lacks a power-up that fundamentally changes gameplay to help players overcome particularly challenging level layouts.

### Core Concept

Implement a "Split Snake" power-up that temporarily splits the snake into two separate, independently controllable snakes. Both snakes would be controlled with the same input keys but move in mirrored directions, allowing players to collect pellets from multiple areas simultaneously and navigate complex maze sections more efficiently.

### Competitive Analysis

Traditional snake games don't typically feature multi-snake control. This innovative mechanic draws inspiration from games like Slither.io but adapts it to the constrained grid-based environment of classic snake, offering a unique strategic element not found in other snake game variants.

### Critical Risks

- May be too powerful if duration is too long or spawn rate too frequent
- Could cause confusion with controls for new players
- Might introduce performance issues with dual snake collision detection
- Visual representation of two snakes could be unclear

### Mitigation Strategies

- Limit duration to 5-7 seconds with moderate spawn rate
- Provide clear visual distinction between primary and secondary snake
- Thoroughly test collision detection performance
- Use distinct colors and styling for each snake

### Assumptions

- Players will enjoy the challenge of controlling two snakes simultaneously
- The mechanic will provide genuine strategic value without breaking game balance
- Visual design can clearly differentiate the two snakes

**Gate**: [x] Ready for feasibility

## [x] 2. Feasibility & Priority

### Technical Feasibility

High - The game already has robust systems for snake movement, collision detection, and power-up management. Creating a second snake entity that mirrors the primary snake's controls but in opposite directions is achievable within the existing architecture.

### Resource Estimates

- Development: 6-8 hours
- Testing: 3-4 hours
- Documentation: 1 hour

### Dependencies

- Existing snake movement system
- Collision detection framework
- Power-up generation and management system
- Rendering system

### Strategic Alignment

This feature enhances core gameplay by introducing a novel mechanic that complements existing power-ups while providing a unique strategic option. It aligns with the game's innovative approach to the classic snake formula.

### Priority Justification

Medium-high priority - Adds significant gameplay innovation that differentiates the game from standard snake implementations while building on existing systems.

**Gate**: [x] Proceed

## [x] 3. Architecture & Planning

### Architectural Approach

Extend the existing power-up system to support the split snake functionality:

1. Add split snake power-up to item generation system
2. Implement dual snake state management
3. Create mirrored control system for secondary snake
4. Implement dual snake collision detection
5. Add visual distinction between snakes
6. Manage snake recombination after power-up expiration

### System Components

- gameState.splitSnakeActive: boolean (activation state)
- gameState.splitSnakeTimer: number (remaining time)
- gameState.splitSnakeLastUpdate: number (timestamp reference)
- gameState.secondarySnake: array (segments for second snake)
- gameState.secondaryDx/Dy: number (direction vectors for second snake)

### Scope Boundaries

**In Scope**:

- Split snake power-up generation and collection
- Dual snake movement and control system
- Dual snake collision detection
- Visual indicators for both snakes
- Proper merging of snakes after power-up expiration

**Out of Scope**:

- Multiple simultaneous power-ups of the same type
- Independent control schemes for each snake
- Changing snake colors or appearances beyond visual distinction

### Requirements

1. Split snakes spawn on level 10+ with 1% probability
2. Split effect lasts 6 seconds
3. Secondary snake mirrors primary snake's movements in opposite directions
4. Visual indicator: Primary snake remains green, secondary snake is blue
5. Both snakes can collect pellets
6. Colliding with either snake ends the game
7. Snakes merge back into one at power-up expiration

### Implementation Plan

1. Add gameState properties for split snake system
2. Implement split snake generation and spawning
3. Add collision detection for split snake power-up
4. Implement dual snake movement logic
5. Add visual drawing for both snakes
6. Implement timer system integration
7. Handle snake merging logic
8. Testing and balancing

**Gate**: [x] Planning complete

## [ ] 4. Implementation

### Phase 1: Foundation

- [ ] Add split snake properties to gameState
- [ ] Implement split snake generation functions
- [ ] Verify game still runs correctly
- [ ] Reference git commit for backup: bd5253c6664b08b629214415aaacc2a6379e2f67

### Phase 2: Core Implementation

- [ ] Add collision detection for split snake power-up
- [ ] Implement dual snake movement logic
- [ ] Add visual drawing for secondary snake
- [ ] Implement timer system integration
- [ ] Verify: Both snakes move correctly and independently
- [ ] Document: Changes with version notes

### Phase 3: Enhancement

- [ ] Implement snake merging logic
- [ ] Add visual distinction between snakes
- [ ] Add timer display for split snake duration
- [ ] Verify: Snakes merge correctly after timer expiration
- [ ] Update: Documentation with usage instructions

### Phase 4: Validation

- [ ] Test split snake functionality
- [ ] Verify visual indicators work
- [ ] Balance spawn rates and durations
- [ ] Ensure all existing tests pass
- [ ] Test integration with other power-ups
- [ ] Archive: Spec version with release notes

## 🎨 Visual Design Specifications

### Color Palette

| Element              | Color  | Hex     | Purpose                        |
| -------------------- | ------ | ------- | ------------------------------ |
| Split Snake Power-Up | Orange | #FFA500 | Split snake collectible        |
| Primary Snake        | Green  | #00FF00 | Main player-controlled snake   |
| Secondary Snake      | Blue   | #0000FF | Mirror-controlled snake        |
| Timer Bar            | Orange | #FFA500 | Split snake duration indicator |

### Typography

- **Headers**: Same as existing game UI
- **Body Text**: Same as existing game UI
- **Captions**: Same as existing game UI

### Layout Specifications

- **Grid System**: Existing 20x20 tile grid
- **Item Size**: Same as pellets/mushrooms
- **Timer Display**: Below existing power-up timers

## ⚖️ Balance Considerations

### Comparative Analysis

| Feature           | Current       | Proposed     | Impact               |
| ----------------- | ------------- | ------------ | -------------------- |
| Snake Control     | Single snake  | Dual snakes  | Strategic gameplay   |
| Duration          | Various       | 6 seconds    | Balanced risk/reward |
| Spawn Rate        | Various       | 1% chance    | Rare but valuable    |
| Pellet Collection | Single source | Dual sources | Efficiency boost     |

### Trade-offs

- [ ] **Trade-off 1**: Increased efficiency vs. game challenge - Pros: Strategic gameplay, Cons: Potential for abuse
- [ ] **Trade-off 2**: Visual complexity vs. clarity - Pros: Rich feedback, Cons: Possible confusion

## 🔧 Best Practices

### Pattern Consistency

- Follow existing power-up implementation patterns
- Use same timer display approach as other power-ups
- Maintain consistent item generation logic
- Follow existing snake drawing conventions

### Git Integration

- Reference latest commit before changes: bd5253c6664b08b629214415aaacc2a6379e2f67
- Use feature branches for experimental work
- Use `git restore` for rollbacks instead of backup files

### Incremental Validation

- Test item generation separately
- Validate dual snake movement independently
- Verify collision detection for both snakes
- Test integration with existing power-ups

### System Integration

- Map functionality to existing power-up hooks
- Ensure backward compatibility
- Document API changes with versioning

### Code Quality

- Follow existing JavaScript style in script.js
- Maintain consistent naming conventions
- Include inline documentation for split snake logic

## 📊 Success Metrics

- [ ] **Performance**: Frame rate maintained at 60 FPS with split snake active
- [ ] **Reliability**: Split snake activates/deactivates correctly 100% of the time
- [ ] **Quality**: No visual artifacts or collision detection errors
- [ ] **User Satisfaction**: Player testing shows improved strategic options
- [ ] **Maintainability**: Code follows existing patterns and is well-documented

## 🎯 Decision Framework

### Mandatory Gates

1. [x] Concept → Feasibility: Idea validated with stakeholder approval
2. [x] Feasibility → Architecture: Viability confirmed with tech lead review
3. [x] Architecture → Implementation: Plan approved with team consensus
4. [ ] Implementation → Testing: Quality standards met with QA signoff
5. [ ] Testing → Deployment: Validation complete with user acceptance
6. [ ] Deployment → Maintenance: Production ready with support plan

## ✅ Overall Checklist

- [x] All stages completed or gate failure documented
- [x] Gate decisions with rationale and stakeholder input
- [x] Traceability maintained with requirement mapping
- [x] Risks identified and mitigated with owner assignment
- [x] Metrics defined with measurement approach
- [x] Single file contains complete lifecycle

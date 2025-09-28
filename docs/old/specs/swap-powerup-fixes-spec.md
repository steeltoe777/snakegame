# Spec-Driven Development: Swap Powerup Fixes

## 🎯 Purpose

This specification outlines the necessary fixes for the swap powerup functionality in the snake game.

## 📋 Core Lifecycle (7 Stages)

### 1. [x] Concept & Validation

**Purpose**: Validate the need for fixes to the swap powerup functionality
**Content**:

- [x] Problem statement: The swap powerup is not functioning correctly
- [x] Core concept: Fix the collision detection and snake popping mechanics
- [x] Business/User Feasibility Gate: Critical bug fixes for game functionality

**Gate Decision**: [x] Proceed

---

### 2. [x] Technical Feasibility & Priority

**Purpose**: Assess technical viability of the fixes
**Content**:

- [x] Technical feasibility: Straightforward fixes to existing code
- [x] Resource estimates: Minimal time and effort required
- [x] Dependencies: None
- [x] Technical Constraints Gate: None

**Gate Decision**: [x] Proceed

---

### 3. [x] Architecture & Planning

**Purpose**: Define technical approach for implementing the fixes
**Content**:

- [ ] Architectural approach: Modify existing functions in script.js
- [ ] System components: script.js file
- [ ] Scope boundaries: Only modify collision detection and popSnakeFromTrail function
- [ ] Detailed requirements:
    1. Fix collision detection so snake turns in random directions when hitting its own body (not in swap mode)
    2. Fix popSnakeFromTrail function to correctly position snake head at trail end with opposite direction
- [ ] Implementation plan: Modify the two functions and test thoroughly

**Gate Decision**: [ ] Planning complete

---

### 4. [ ] Implementation

**Purpose**: Implement the fixes
**Content**:

- [ ] Current state: script.js with broken swap powerup functionality
- [ ] Step-by-step execution: Modify collision detection and popSnakeFromTrail function
- [ ] Quality standards: Pass linting and testing
- [ ] Testing strategy: Manual testing in game
- [ ] Risk mitigation: Git backup before changes

**Gate Decision**: [x] Quality met

---

### 5. [ ] Testing & Quality Assurance

**Purpose**: Validate that the fixes work correctly
**Content**:

- [ ] Lint: no warnings or errors
- [ ] Unit tests: N/A (manual testing)
- [ ] Integration tests: Play game and verify swap powerup works correctly
- [ ] Quality Assurance Gate: Swap powerup functions as intended

**Gate Decision**: [ ] Testing complete

---

### 6. [ ] Deployment & Release

**Purpose**: Release the fixes
**Content**:

- [ ] Deployment strategy: Update script.js file
- [ ] Rollback plan: Git restore if needed
- [ ] Success metrics: Swap powerup works correctly in game
- [ ] Acceptance criteria: Both issues reported by user are fixed

**Gate Decision**: [ ] Ready for production

---

### 7. [ ] Maintenance & Evolution

**Purpose**: Ongoing support
**Content**:

- [ ] Monitoring: User feedback
- [ ] Support plan: Address any further issues

**Status**: [ ] Maintenance ready

## 🎯 Feature Requirements

### Core Functionality

1. When not in swap mode, snake should turn in random directions when hitting its own body instead of dying
2. When swap mode ends, snake head should correctly pop from trail with opposite direction of trail

### Technical Specifications

#### System Components

- script.js

#### Implementation Logic

1. Fix collision detection to allow snake to pass through its own body (turn in random directions)
2. Fix popSnakeFromTrail function to correctly calculate opposite direction and position snake head

#### Integration Points

- Game update loop
- Rendering system

## 🚀 Implementation Template

### 🎯 Current State

- **File**: /a0/projects/snakegame/script.js
- **Lines**: ~1200
- **Git Reference**: Before changes
- **Lint+Tests**: Some failing tests (pre-existing)
- **Functionality**: Swap powerup not working correctly
- **Dependencies**: None
- **Timestamp**: 2025-09-21 19:10:00

### ✅ Execution Phases

#### Phase 1: Foundation

- [x] **Task 1.1**: Fix collision detection logic for snake body
- [x] **Task 1.2**: Verify collision detection with trail still works correctly
- [x] **Verify**: Test that snake turns in random directions when hitting its own body
- [ ] **Backup**: Git commit before changes

#### Phase 2: Core Implementation

- [x] **Task 2.1**: Fix popSnakeFromTrail function direction calculation
- [x] **Task 2.2**: Verify snake head correctly positioned at trail end
- [x] **Verify**: Test that snake pops from trail with correct opposite direction
- [ ] **Document**: Note changes in code comments

#### Phase 3: Enhancement

- [ ] **Task 3.1**: Improve visual feedback for swap mode
- [ ] **Task 3.2**: Optimize trail management
- [ ] **Verify**: Ensure smooth gameplay experience
- [ ] **Update**: Update any related documentation

#### Phase 4: Validation

- [ ] **Task 4.1**: Comprehensive testing of swap powerup
- [ ] **Task 4.2**: Verify no regression in other game features
- [ ] **Verify**: All tests pass (except pre-existing failures)
- [ ] **Archive**: Commit changes with descriptive message

## ✅ Detailed Acceptance Criteria

- [ ] Snake turns in random directions when hitting its own body (not in swap mode)
- [ ] Snake dies when hitting trail segments (not in swap mode)
- [ ] Snake head correctly pops from trail with opposite direction when swap mode ends
- [ ] Swap mode indicator displays correctly
- [ ] All existing game functionality remains intact

## ⚖️ Balance Considerations

### Comparative Analysis

| Feature                   | Current       | Proposed              | Impact            | Feasibility Assessment |
| ------------------------- | ------------- | --------------------- | ----------------- | ---------------------- |
| Collision with snake body | Instant death | Random direction turn | Better gameplay   | High                   |
| Trail popping direction   | Incorrect     | Opposite of trail     | Correct mechanics | High                   |

### Strategic Value

| Aspect          | Value | Description                        |
| --------------- | ----- | ---------------------------------- |
| Gameplay        | High  | Core game mechanics                |
| User Experience | High  | Direct impact on player experience |
| Bug Fix         | High  | Resolving reported issues          |

### Trade-offs

- [ ] **Trade-off 1**: Simpler collision detection vs. more realistic snake behavior
- [ ] **Trade-off 2**: Immediate direction change vs. gradual transition

## 🔧 Best Practices

### Pattern Consistency

- [ ] Follow existing code patterns in script.js
- [ ] Maintain consistent naming conventions

### Git Integration

- [ ] Reference latest hash before changes
- [ ] Use `git restore` for rollbacks

### Incremental Validation

- [ ] Test each fix separately
- [ ] Validate: collision detection → trail popping
- [ ] Run tests after each phase

### System Integration

- [ ] Ensure backward compatibility
- [ ] Document API changes

### Code Quality

- [ ] Follow JavaScript style guide
- [ ] Include inline documentation

## 📊 Success Metrics

- [ ] **Performance**: No noticeable frame rate drops
- [ ] **Reliability**: Swap powerup works consistently
- [ ] **Quality**: Linting passes with minimal warnings
- [ ] **User Satisfaction**: Issues reported by user are resolved
- [ ] **Maintainability**: Code is readable and well-commented

## 🎯 Decision Framework

### Mandatory Gates

1. [x] Concept → Feasibility: Critical bug fixes
2. [ ] Feasibility → Architecture: Plan approved
3. [ ] Architecture → Implementation: Implementation complete
4. [ ] Implementation → Testing: Testing validates fixes
5. [ ] Testing → Deployment: Fixes verified
6. [ ] Deployment → Maintenance: Changes deployed

### Gate Failure Protocol

- [ ] Root cause documented
- [ ] Improvement plan with timeline
- [ ] Spec updated with lessons learned
- [ ] Stakeholders notified

## ✅ Overall Checklist

- [ ] All stages completed
- [ ] Gate decisions documented
- [ ] Risks identified and mitigated
- [ ] Metrics defined and measured
- [ ] Single file contains complete lifecycle

## 💡 Usage Notes

- **Single file**: Complete lifecycle
- **Checkbox tracking**: Progress visibility
- **Current state**: Document baseline
- **Step-by-step**: Execution plans
- **Version control**: Git for backups
- **Iterative updates**: Update spec with references
- **Context awareness**: Document affected files
- **Git integration**: Reference hash, use diff/restore
- **Enhanced gating**: Evidence-based decisions
- **Deterministic approach**: Facts and data
- **Rich content**: Code snippets and requirements
- **BEFORE file operations under /a0 or /**: Use `provide_instructions_for_file_study_and_editing`

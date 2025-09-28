# Bugfix Workflow Guide

A systematic approach to identifying, fixing, and verifying software bugs while preserving existing functionality.

## Core Principles

- **Preserve Functionality**: Never remove or break existing working features
- **Minimal Changes**: Make the smallest possible changes to fix the issue
- **Thorough Verification**: Validate fixes with testing and linting
- **Systematic Approach**: Follow a structured workflow to ensure quality

## Bugfix Workflow

### 1. Bug Identification

- Clearly define the problem and its symptoms
- Reproduce the issue consistently
- Identify the specific conditions that trigger the bug
- Determine expected behaviour from specifications, documentation, code and user feedback
- Document the expected vs. actual behavior

### 2. Root Cause Analysis

- Trace the execution path to locate the source of the problem
- Examine related code sections and dependencies
- Understand the intended behavior before making changes
- Use debugging tools and logging if necessary

### 3. Fix Planning

- Design the minimal fix that addresses the root cause
- Consider impact on related functionality
- Plan preservation of all existing features
- Anticipate potential side effects

### 4. Implementation

- Make focused changes to address the specific issue
- Preserve all existing function calls and logic flows
- Maintain consistent coding style and conventions
- Add comments only if clarifying complex logic

### 5. Validation

- Run linting tools to ensure code quality
- Execute all relevant tests to verify functionality
- Perform manual testing of the specific bug fix
- Check that related features still work correctly

### 6. Verification

- Confirm the bug is resolved under various conditions
- Verify no regressions in existing functionality
- Ensure performance characteristics are maintained
- Document the fix for future reference

## Best Practices

### Before Making Changes

- Create backups of original files
- Understand the complete context of the affected code
- Identify all functions and features that must be preserved
- Set up a reliable testing environment

### During Implementation

- Make incremental changes and test frequently
- Keep changes focused on the specific issue
- Avoid refactoring unrelated code
- Maintain clear commit messages documenting the fix

### After Implementation

- Run comprehensive tests including edge cases
- Verify integration with related components
- Check for performance impacts
- Update documentation if needed

## Example Workflow

When fixing the nested loop bug in the snake game:

1. **Identification**: Power-ups weren't being collected correctly
2. **Analysis**: Discovered power-up collection loops were nested inside pellet collection loop
3. **Planning**: Restructure loops to be sequential rather than nested
4. **Implementation**: Moved power-up loops outside pellet loop while preserving all logic
5. **Validation**: Ran linting and all tests to ensure no functionality was lost
6. **Verification**: Confirmed power-ups could now be collected properly

## Key Reminders

- Always validate that existing tests still pass
- Ensure all functions are still being called appropriately
- Preserve gameplay mechanics and user experience
- Make changes traceable and reversible


## Documentation & Change Management

After implementing and verifying your fix:

### 1. Document the Fix
- Place documentation following project conventions (e.g., in docs/bugfixes/)
- Use descriptive filenames that clearly identify the issue
- Include problem description, root cause, solution, and impact

### 2. Update Existing Documentation
- Review existing documentation to see if it needs updates based on your fix
- Update any documentation that described the buggy behavior as correct
- Ensure implementation and documentation are aligned

### 3. Track Changes
- Follow project conventions for tracking changes (changelog, status files, etc.)
- Include sufficient detail for future developers to understand the context
- Reference relevant documentation and specifications

## Evidence-Based Decision Making

When the correct behavior is not obvious:

### 1. Corroborate with Documentation
- Check existing documentation, specifications, and design documents
- Look for explicit statements about intended behavior

### 2. Seek Stakeholder Input
- When documentation is unclear, seek clarification from stakeholders
- Document decisions made in consultation with stakeholders

### 3. Preserve Documented Behavior
- When documented behavior exists, align implementation with it
- If changing documented behavior, update documentation accordingly

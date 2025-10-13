# File Protocol Requirements

_Last Updated: 2025-10-13

This document outlines the requirements and constraints for maintaining `file://` protocol compatibility.

## 🎯 Objective

Ensure the Snake Game can be executed directly from `file://index.html` without requiring a web server.

## 🚫 Restrictions

1. **No ES6 Modules**: Cannot use `import`/`export` syntax due to CORS restrictions
2. **Single File Execution**: All JavaScript must be contained in a single file or loaded traditionally
3. **No External Dependencies**: Cannot rely on npm packages that require bundling
4. **No Build Process**: No webpack, rollup, or other bundling tools required for basic execution

## ✅ Implementation Approach

1. **Namespaced Globals**: Group related variables into objects instead of individual globals
2. **IIFE Pattern**: Use Immediately Invoked Function Expressions for encapsulation
3. **Traditional Script Loading**: Load all scripts via standard `<script>` tags
4. **Self-Contained Logic**: Keep all game logic in a single JavaScript file

## 🧪 Testing

- Verify game loads and runs from `file://index.html`
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Confirm no CORS errors in browser console

## 🔄 Development Workflow

For development, a local server can be used:

```bash
# Using Node.js
npx http-server .

# Using Python
python -m http.server
```

However, the final implementation must work without these.


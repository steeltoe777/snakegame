# Quick Start Guide for AI Agents

## 🚀 Immediate Action Items

### 1. Project Verification
```bash
cd /a0/projects/snakegame/
ls -la                    # Verify all files present
npm test                  # Run tests (should pass)
npm run lint             # Check code quality
```

### 2. Game Launch
```bash
# Method 1: Direct browser
open /a0/projects/snakegame/index.html

# Method 2: Local server
npx http-server .         # Then visit http://localhost:8080
```

### 3. Key Files for AI Understanding
| Priority | File | Purpose | Lines |
|----------|------|---------|-------|
| **1** | `script.js` | Core game logic | 1037 |
| **2** | `index.html` | UI structure | 28 |
| **3** | `style.css` | Visual styling | 81 |
| **4** | `script.test.js` | Test coverage | 501 |

### 4. Critical Code Sections
- **Game State**: Update line range references
- **Game Loop**: Update line range references  
- **Rendering**: Update line range references
- **Input Handling**: Update line range references

### 5. Testing Commands
```bash
# Full test suite
npm test

# Specific test
npm test -- --testNamePattern="collision"

# Coverage report
npm test -- --coverage
```

### 6. Development Workflow
1. **Read** README.md for overview
2. **Study** ARCHITECTURE.md for design
3. **Reference** API_REFERENCE.md for functions
4. **Follow** DEVELOPMENT_GUIDE.md for changes
5. **Test** after every modification

### 7. Game Features (Verified)
- ✅ Snake movement (arrow keys)
- ✅ Food collection & growth
- ✅ Collision detection
- ✅ Maze generation
- ✅ Password system
- ✅ Level progression
- ✅ Score tracking
- ✅ Game over/restart

### 8. Browser Controls
- **↑ ↓ ← →**: Snake movement
- **Any key**: Start game after game over
- **Password**: Type password to skip levels

### 9. Debug Mode
```javascript
// Add to console for debugging
gameState.debug = true;
console.log(gameState);
```

### 10. Extension Points (Ready)
- **New power-ups**: Add to gameState object
- **Visual themes**: Modify color constants
- **Sound effects**: Add audio API calls
- **High scores**: Add localStorage

---

**Status**: ✅ Complete & Verified  
**Last Updated**: 2025-09-09  
**AI-Ready**: All documentation optimized for LLM agents

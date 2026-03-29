# 📜 Project History

This is a record of the major improvements, technical decisions, and evolutionary steps taken during the development of **Snake, Tron, Pac-Man Hybrid**.

---

## 🚀 The Vision
The goal was to create a "Forever Game" that blends three classic arcade genres into something new. The core philosophy was **"Fun First, Optimization Second,"** leading to a unique feature set like the secret password system—an homage to retro gaming.

---

## ✨ Major Technical Milestones

### **1. Magic Number Replacement**
We replaced hardcoded numeric values (like `20`, `600`, etc.) with named constants. This significantly improved readability and allowed us to easily experiment with grid sizes and movement speeds.

### **2. CSS Modernization**
The original styling was heavily hardcoded. We introduced **CSS Variables** (`:root`) for colors like `--snake-color` and `--wall-color`, making it easy to create themes and ensuring a consistent visual comfort level.

### **3. Spatial Grid Optimization**
To maintain performance on complex mazes and very long snakes, we implemented a **2D Spatial Grid**. Instead of iterating through all objects for every collision check, the engine now checks specific grid coordinates—drastically reducing CPU usage.

### **4. Advanced Input Handling**
We moved away from basic event listeners to a **Centralized Input Manager**. This allowed us to:
- Resolve conflicts between pausing and typing.
- Prevent default browser scrolling behavior.
- Support modern controls like **Backspace** and **Escape**.

### **5. Deterministic Password System**
The password system was built from scratch using a deterministic seed-based generator. This ensures that Level 10's password is the same every time you play, without needing a database or local storage.

### **6. Font & Visual Standardization**
We moved away from cursive fallbacks to a **Standard System Font Stack** (`Arial, Helvetica, sans-serif`). This solved rendering issues on macOS where text was accidentally appearing as italics. We also added a universal CSS reset with `!important` to force a consistent, non-italicized experience across all modern browsers.

---

## 📈 Recent Improvements
- **Visual Polish**: Adjusted color saturation for better visual comfort during long play sessions.
- **Documentation**: A complete overhaul to make the project more accessible to both players and developers.
- **Testing**: Reached significant test coverage for all core game loop edge cases.

---

## 🔄 Future Goals
- **Modularization**: Refactoring the large `script.js` into separate modules (while maintaining offline compatibility).
- **Sound Effects**: Adding retro-style blips and bloops.
- **Mobile Support**: Touch controls for playing on the go.

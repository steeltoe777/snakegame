# 💻 Development Guide

Welcome to the **Snake Game** development suite. This guide covers how to set up the environment, run tests, and contribute to the code.

---

## 🛠️ Project Setup

### **Quick Run**

The game is built with **Pure Vanilla JavaScript**, so it requires no build steps.

- **Method 1**: Simply open `index.html` in your browser.
- **Method 2 (Recommended)**: Use a local server to avoid browser caching:
    ```bash
    npx http-server .
    ```

### **Prerequisites**

If you wish to run the **test suite** or **linting tools**, you will need Node.js installed.

```bash
# Install development dependencies
npm install
```

---

## 🧪 Testing

We use **Jest** for unit testing. The tests cover game logic, collision detection, and the password system.

```bash
# Run all tests
npm test

# Run tests with a coverage report
npm test -- --coverage
```

### **Key Test Files**

- `script.test.js`: Core game loop and collision logic.
- `password_system.test.js`: Deterministic code generation logic.

---

## 🧹 Code Quality

We enforce code standards using **ESLint** and **Prettier**.

```bash
# Check for linting errors
npm run lint

# Automatically fix linting issues
npm run lint -- --fix
```

---

## 🌍 File Protocol Compatibility

This project maintains strict compatibility with the `file://` protocol. This means:

1. **No ES6 Modules**: Everything is bundled in `script.js`.
2. **No External Imports**: No CDNs or remote dependencies are used.
3. **Vanilla CSS**: No pre-processors or frameworks.

This ensures the game can be downloaded and played **offline** by simply double-clicking the HTML file.

## ⌨️ Centralized Input Management

Inputs are managed centrally to prevent multiple listeners from accumulating. This is critical for supporting both gameplay and password entry simultaneously.

- **`handleDirectionChange`**: Manages snake movement via arrow keys and the **Space/Escape** pause keys. Also resets `consecutiveMouseClicks` counter and clears `skipNextMovement` to exit mouse precision mode.
- **`handlePasswordKey`**: Manages all alphanumeric keys and **Backspace** for secret codes.
- **`handleMouseInput`**: Manages mouse clicks anywhere (except buttons). Starts game only when clicking on canvas. Increments `consecutiveMouseClicks` for slowdown.
- **`handleTouchInput`**: Manages touch input on canvas only. Also handles start and slowdown.
- Both functions use `e.preventDefault()` for whitelisted keys to ensure smooth control without browser side-effects.

---

## 🤝 Contributing

1. **Fork** the repository.
2. Create a **Feature Branch** (`git checkout -b feature/cool-new-thing`).
3. **Test** your changes thoroughly with `npm test`.
4. Submit a **Pull Request**.

### **Technical Guidelines**

- **Surgical Changes**: Avoid large refactors unless necessary.
- **Human-Readable**: Write clean, commented code.
- **Testing**: Every new feature should include a corresponding test case in `script.test.js`.

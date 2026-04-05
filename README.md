# 🐍 Snake, Tron, Pac-Man Hybrid

**A classic arcade mashup with a secret twist.**

[**🎮 Play in your browser now!**](https://steeltoe777.github.io/snakegame/)

---

## 🕹️ What is this?

Imagine the growth mechanics of **Snake**, the lethal trails of **Tron**, and the strategic pellet collection of **Pac-Man**, all wrapped in a level-based progression system with **secret passwords**. This isn't just a clone; it's a strategic arcade experience that evolves as you play.

## ✨ Core Gameplay

- **🐍 Grow and Survive**: Collect pellets to grow, but watch out—your own tail is your biggest enemy.
- **💙 Tron Trails**: Your movement leaves a blue trail that acts as a solid wall. Use it to trap yourself or navigate carefully.
- **🟡 Pac-Man Pellets**: Clear the entire board of pellets to advance. No more random spawns; every pellet counts.
- **🔐 Secret Passwords**: Every 10 levels, you'll uncover a secret code. Type it in anytime (even while paused!) to jump back to that milestone. **Important:** Write these down! They are not saved between browser sessions.
- **🍄 Dynamic Power-Ups**: From speed boosts to invincibility, collect random spawns to gain the upper hand.
- **🗺️ Minimap Navigation**: Keep an eye on the radar to locate that last elusive pellet or a distant power-up.
- **⏸️ Pause Anywhere**: On mobile, focusing the password input field automatically pauses the game; unfocusing (tapping away) unpauses. Press **Space** or **Escape** to pause/resume manually.

## ⌨️ Controls

| Input              | Action                                                                              |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Arrow Keys**     | Change Direction / Start Game                                                       |
| **Mouse Click**    | Change Direction (anywhere). **Only starts game when clicking on the canvas**.      |
| **Touch**          | Change Direction (on canvas only). Starts game on canvas touch.                     |
| **Space / Escape** | Pause or Resume (also resets mouse/touch mode)                                      |
| **Password Field** | Enter password; focusing auto-pauses, unfocusing auto-unpauses (mobile convenience) |
| **A-Z, 0-9**       | Type Password (alternative method)                                                  |
| **Backspace**      | Correct password entry                                                              |

**Note**: Using only mouse/touch for two consecutive clicks makes the snake **40% slower** and causes it to **skip one movement turn after each direction change** to improve steering precision. Additionally, when about to die from wall/trail collision, the snake **pauses for one turn** giving you a final chance to steer away. Using any arrow key or Space/Escape resets these effects.

## 🚀 Getting Started

1. **Open** `index.html` in any browser or use the [live link](https://steeltoe777.github.io/snakegame/).
2. **Start the game**: Click on the game canvas or use arrow keys.
3. Use **Arrow Keys** or **click/touch** anywhere to steer (once started).
4. Collect all **Yellow Pellets** to clear the level.
5. Avoid the **Grey Walls** and your **Blue Trail**.
6. Watch the top-right for **Secret Passwords** at level 10, 20, etc.
7. **Important**: Write down your passwords! They are not saved if you refresh the page or change browsers.

## 💡 Quick Pro-Tips

- **Trap Yourself?** Your trail disappears over time, but in tight spots, it's a solid wall. Plan your loops!
- **Milestones**: The game remembers your **highest achieved password**. If you die or reset, you can always jump back to your best milestone instantly.
- **Ghost Mode**: Collecting a **Mushroom** makes you invincible to walls (but not your own tail!).
- **Pause & Think**: Press **Space** or **Escape** to pause. On mobile, tapping the password input auto-pauses while you type.
- **High-Level Tolerance**: At **Level 600+**, dying no longer reduces your level—you respawn on the same level to prevent the game from becoming impossibly difficult.
- **Mouse/Touch Difficulty**: In mouse/touch-only mode (2+ clicks), the snake is **40% slower**, **skips one turn after direction changes**, and gets a **one-turn grace period before death**. Press any arrow key or Space/Escape to reset to normal speed.

## 🛠️ Development & Philosophy

This project was born from a love for arcade classics and a "fun-first" development philosophy. It's built with **Pure Vanilla JavaScript**, ensuring it runs anywhere without a server or complex setup.

### **Documentation Roadmap**

- **[🕹️ Gameplay Guide](docs/GAMEPLAY.md)**: Deep dive into power-ups, level scaling, and strategies.
- **[🏗️ Technical Architecture](docs/ARCHITECTURE.md)**: How the engine, spatial grid, and rendering work.
- **[💻 Development Guide](docs/DEVELOPMENT.md)**: Setup, testing, and contribution instructions.
- **[📜 Project History](docs/HISTORY.md)**: The evolution of the game and technical improvements.

---

**Game Version**: 1.0.0 | **License**: ISC | **Creator**: steeltoe777

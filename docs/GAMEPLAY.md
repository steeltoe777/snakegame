# 🕹️ Gameplay Guide

Welcome to the world of **Snake, Tron, Pac-Man Hybrid**. This guide explains the core mechanics, how to use the secret password system, and strategies for survival in higher levels.

---

## 🐍 Growth & Movement

- **Movement**: You move on a 30x30 fixed grid. Use the **Arrow Keys** or **click/touch** anywhere on screen to steer.
- **Starting**: The game begins when you click on the **canvas** (game board) or press an arrow key. Mouse/touch clicks outside the canvas won't accidentally start the game.
- **Growth**: Every pellet you eat increases your length by one segment.
- **The Trail**: Unlike classic snake games, your movement leaves a temporary blue trail. This trail acts as a solid obstacle, so you must plan your route carefully to avoid trapping yourself.

---

## 🔐 The Secret Password System

Every 10 levels (10, 20, 30...), the game generates a **Secret Code**.

- **Visibility**: The latest milestone password is displayed in the top-right corner of the screen. On mobile, you can also tap the input field below to type.
- **Entry**: You can type a password at any time—even while the game is **paused**—using either your physical keyboard or the on-screen input field.
- **Persistence**: Once you've reached a milestone level (like Level 10), the game will remember its password. This behaves like a **"High Score"**—if you die, regress, or even restart the game from Level 1, your best achieved password remains visible on the screen for instant recovery.
- **Behavior**: Entering a password for Level 10 will teleport you to **Level 9**, resetting your score but allowing you to continue from that point.

---

## 🍄 Power-Ups

Random items spawn during gameplay to help (or challenge) you:

| Power-Up           | Visual | Effect                                                     | Duration |
| ------------------ | ------ | ---------------------------------------------------------- | -------- |
| **Mushroom**       | 🍄     | **Invincibility**: Pass through walls without dying.       | 8s       |
| **Lightning Bolt** | ⚡     | **Speed Boost**: Move faster to clear pellets.             | 6s       |
| **Hourglass**      | ⏳     | **Time Slow**: Slow down for precise maneuvers.            | 8s       |
| **Golden Star**    | ⭐     | **Multiplier**: Earn double points for every pellet eaten. | 10s      |

_Note: Collecting a Mushroom or eating a Pellet always makes the snake grow._

---

## 🌱 Level Evolution

As you progress, the maze itself becomes more complex:

- **Level 1-3**: Open area with minimal boundaries.
- **Level 4-499**: Random walls begin to appear in the center.
- **Level 500-1499**: Dense labyrinths that require tight maneuvering.
- **Level 1000+**: **Wrap-around boundaries**. Instead of dying when hitting the screen edge, you'll wrap around to the other side (Pac-Man style).

---

## 🗺️ Minimap Navigation

Keep an eye on the **Top-Right Radar**:

- **Bright Green**: Your snake's head.
- **Dark Green**: Your snake's body.
- **Red**: Remaining pellets.
- **White**: Solid walls.
- **Others**: Power-ups match their specific icons.

---

## 🔄 Death & Respawn

Don't worry—death isn't the end.

- **Regression**: When you die, your score is halved. On **levels below 600**, you will always lose one level (minimum 1). On **levels 600+**, you will lose one level **only if** your new score is less than your current level; otherwise you **stay on the same level**.
- **Penalty**: Your snake length is also **reduced by half** (minimum 1 segment).
- **Forgiveness**: This system allows you to keep playing without losing all your progress, as long as you can manage the regression!

---

## 💡 Pro Tips

1. **The Trail Trick**: If you have a Mushroom (invincibility), your trail turns **rainbow**. You can still collide with your tail, so be careful!
2. **Precision Pause**: Press **Space** or **Escape** to pause anytime. On mobile, focusing the password input field auto-pauses; tapping away (unfocusing) auto-unpauses, making it easy to type passwords.
3. **Password Management**: Always write down or remember your milestone passwords. They are your safety net.
4. **Minimap Reading**: Always glance at the radar when a level starts to see the best route for pellets.
5. **Mouse/Touch Penalty**: After **two consecutive clicks** without using arrow keys, the snake **skips one movement turn after each direction change**. Additionally, when a collision with a wall or your trail would normally cause death, the snake **pauses for one turn** giving you a final chance to steer away. Press any arrow key or Space/Escape to reset all effects.

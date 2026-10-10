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
- **Behavior**: Entering a password for Level 10 will teleport you to **Level 9**, resetting your score but allowing you to continue from that point. From level 5500 you land on the exact milestone level instead of one below.
- **Management**: `FORGET` clears stored password; `HIDEPWD` hides the hint; `SHOWPWD` shows it; `RESTART` preserves hide/show state.

---

## 🍄 Power-Ups

Random items spawn during gameplay to help (or challenge) you:

| Power-Up           | Visual | Effect                                                     | Duration |
| ------------------ | ------ | ---------------------------------------------------------- | -------- |
| **Mushroom**       | 🍄     | **Invincibility**: Pass through walls without dying.       | 8s       |
| **Lightning Bolt** | ⚡     | **Speed Boost**: Move faster to clear pellets.             | 6s       |
| **Hourglass**      | ⏳     | **Time Slow**: Slow down for precise maneuvers.            | 8s       |
| **Golden Star**    | ⭐     | **Multiplier**: Points per pellet multiply. x2 below level 2888; above that the factor counts your active powerups and is capped by level. | 10s      |

_Note: Collecting a Mushroom or eating a Pellet always makes the snake grow._

_Note: From level 3300, pickups stack. Collecting a powerup again adds its duration to the one already running, which also raises the star multiplier._

---

## ⭐ Super-Pellet

When only **one pellet remains** on a level, a special **Super-Pellet** will spawn:

- **Appearance**: A golden, pulsing pellet with a glowing effect (distinct from regular amber pellets)
- **Effect**: Eating the Super-Pellet skips levels. The first one in a row advances 2, the next 4, then 8, doubling for every consecutive Super-Pellet. The snake gains twice as many segments as the level jump, capped at the number of board cells.
- **Strategy**: The choice is yours - eat the last regular pellet to advance normally, or hunt the Super-Pellet for the level skip. A long streak is a reward for players who want it; the streak resets on any level up without one, on death, and on password teleport.

---

## 🌱 Level Evolution

As you progress, the maze itself becomes more complex:

- **Level 1-3**: Open area with minimal boundaries.
- **Level 4-499**: Random walls begin to appear in the center.
- **Level 500-1499**: Dense labyrinths that require tight maneuvering.
- **Level 1000+**: **Wrap-around boundaries**. Instead of dying when hitting the screen edge, you'll wrap around to the other side (Pac-Man style).
- **Level 1500+**: Pellets grow the snake by 2 segments. From 5000 to 5499 they grow it by 3, and from 20000 they grow it by 1 again, because high levels carry more walls and need less growth.
- **Level 666 and beyond**: Pellets with a 6 in the level number start moving on their own, more often the more sixes the level has.
- **Level 2000+**: Walls can spawn on the border as well as in the center.
- **Level 3300+**: Powerups stack. Death at level 700+ and level up at 1700+ add a 2-second input cooldown.

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
- **Clean slate**: Respawn clears your trail and every pickup on the board, and halves your snake. Below level 100 the game restarts on its own; from level 100 it waits for your next key.
- **Cooldown**: At level 700+ you get a 2-second input lockout after death, shown as COOLDOWN! on the board.
- **Mouse grace**: In mouse/touch mode, the first lethal collision pauses the snake for one turn so you can steer out. Each life gets that one grace.

---

## 💡 Pro Tips

1. **The Trail Trick**: If you have a Mushroom (invincibility), your trail turns **rainbow** and you pass through walls and through your own trail for those 8 seconds. The protection ends on the timer, so do not park on a wall.
2. **Precision Pause**: Press **Space** or **Escape** to pause anytime. On mobile, focusing the password input field auto-pauses; tapping away (unfocusing) auto-unpauses, making it easy to type passwords.
3. **Password Management**: Always write down or remember your milestone passwords. They are your safety net.
4. **Minimap Reading**: Always glance at the radar when a level starts to see the best route for pellets.
5. **Mouse/Touch Penalty**: After **two consecutive clicks** without using arrow keys, the snake **skips one movement turn after each direction change**. Additionally, when a collision with a wall or your trail would normally cause death, the snake **pauses for one turn** giving you a final chance to steer away. Press any arrow key or Space/Escape to reset all effects.

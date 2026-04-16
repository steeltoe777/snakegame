// REMEDY: Centralized timer management for better accuracy
function updatePowerupTimers() {
    const currentTime = performance.now();

    // Update shield timer
    if (gameState.shieldPowerupActive) {
        const deltaTime = currentTime - gameState.shieldLastUpdate;
        gameState.shieldTimer -= deltaTime;
        gameState.shieldLastUpdate = currentTime;

        if (gameState.shieldTimer <= 0) {
            gameState.shieldPowerupActive = false;
            gameState.shieldTimer = 0;
        }
    }

    // Update mushroom timer
    if (gameState.mushroomPowerupActive) {
        const deltaTime = currentTime - gameState.mushroomLastUpdate;
        gameState.mushroomTimer -= deltaTime;
        gameState.mushroomLastUpdate = currentTime;

        if (gameState.mushroomTimer <= 0) {
            gameState.mushroomPowerupActive = false;
            gameState.mushroomTimer = 0;
            // Handle mushroom expiry safely (see Remedy 1)
        }
    }

    // Update other timers similarly...
}

// Color conversion constants

// 📝 Magic numbers replaced with constant names for better readability
// This improves maintainability while preserving functionality

// 🎨 Adjusted bright colors to be less saturated for better visual comfort
// Replaced bright yellows with amber tones and reduced saturation

const COLOR_MAX_VALUE = 255;

// Level progression constants
const PASSWORD_LEVEL_MAX = 1000000;
const WALL_COUNT_LIMIT = 15;
const WALL_LEVEL_MAX = 1000;

// Position calculation constants
const HUE_FULL_CIRCLE = 360;

// Timer bar position constants

// Other game constants
// Named constants for magic numbers
const GRID_SIZE = 20;
const BASE_SPEED = 100; // Base movement speed in ms
const MIN_SPEED = 225; // Minimum movement speed in ms
// Probability constants for power-up spawning

// Timing constants for power-ups in milliseconds
const MUSHROOM_POWERUP_DURATION = 8000;
const SHIELD_POWERUP_DURATION = 12000; // 12 seconds in milliseconds
const SPEED_BOOST_DURATION = 6000;
const SCORE_MULTIPLIER_DURATION = 10000; // 10 seconds in milliseconds

// Speed modifiers

// Position bias constants

// Password system constants
const PASSWORD_LENGTH = 6;

// Visual effect constants

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants for game over mechanics
const SCORE_REDUCTION_FACTOR = 2; // Factor by which score is reduced on respawn
const SNAKE_LENGTH_REDUCTION_FACTOR = SCORE_REDUCTION_FACTOR; // Factor by which snake length is reduced on respawn
// Helper function to calculate available tiles for item spawning
// Excludes snake body, walls, and edges to prevent items from appearing in invalid locations
function getAvailableTiles(gameState) {
    const availableTiles = [];
    for (let y = 1; y < gameState.tileCount - 1; y++) {
        for (let x = 1; x < gameState.tileCount - 1; x++) {
            let occupied;
            if (gameState.maze && gameState.maze[y] && gameState.maze[y][x]) {
                // Skip walls
                // eslint-disable-next-line no-continue
                continue;
            }
            for (let j = 0; j < gameState.snake.length; j++) {
                const segment = gameState.snake[j];
                if (segment.x === x && segment.y === y) {
                    occupied = true;
                    break;
                }
            }
            if (!occupied) {
                availableTiles.push({ x, y });
            }
        }
    }
    return availableTiles;
}

window.minimapCanvas = document.getElementById('minimapCanvas');
window.minimapCtx = window.minimapCanvas ? window.minimapCanvas.getContext('2d') : null;

// Group game state into a single object for easier management and testing

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= HUE_FULL_CIRCLE;
    s /= BASE_SPEED;
    l /= BASE_SPEED;
    let r;
    let g;
    let b;

    if (s === 0) {
        r = l;
        g = l;
        b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / PASSWORD_LENGTH) return p + (q - p) * PASSWORD_LENGTH * t;
            if (t < 1 / SCORE_REDUCTION_FACTOR) return q;
            if (t < SCORE_REDUCTION_FACTOR / 3)
                return p + (q - p) * (SCORE_REDUCTION_FACTOR / 3 - t) * PASSWORD_LENGTH;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = SCORE_REDUCTION_FACTOR * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [
        Math.round(r * COLOR_MAX_VALUE),
        Math.round(g * COLOR_MAX_VALUE),
        Math.round(b * COLOR_MAX_VALUE),
    ];
}

function generateMushrooms() {
    gameState.mushrooms = [];

    // Only spawn mushrooms on higher levels and with some probability
    if (
        gameState.level >= 5 &&
        Math.random() < 0.15 + (gameState.level > 10 ? 0.05 : 0) - (gameState.level > 20 ? 0.03 : 0)
    ) {
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake or pellets
                    let occupied = false;

                    // Check snake using traditional for loop
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets using traditional for loop
                    if (!occupied) {
                        for (let k = 0; k < gameState.pellets.length; k++) {
                            const pellet = gameState.pellets[k];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1-2 mushrooms if available tiles exist
        if (availableTiles.length > 0) {
            const mushroomCount = Math.floor(
                Math.random() * Math.min(1 + Math.floor(gameState.level / 5), 4)
            );
            for (let i = 0; i < mushroomCount; i++) {
                const randomIndex = Math.floor(Math.random() * availableTiles.length);
                gameState.mushrooms.push(availableTiles[randomIndex]);
                // Remove from available to avoid duplicate positions
                availableTiles.splice(randomIndex, 1);
            }
        }
    }
}
// Generate shields for powerups
function generateShields() {
    // Only spawn shields on level 6+ with some probability
    if (
        gameState.level >= 6 &&
        Math.random() < 0.12 + (gameState.level > 15 ? 0.03 : 0) - (gameState.level > 25 ? 0.02 : 0)
    ) {
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts/hourglasses/stars/shields)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, lightning bolts, hourglasses, stars, or existing shields
                    let occupied = false;

                    // Check snake using traditional for loop
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets using traditional for loop
                    if (!occupied) {
                        for (let k = 0; k < gameState.pellets.length; k++) {
                            const pellet = gameState.pellets[k];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let k = 0; k < gameState.mushrooms.length; k++) {
                            const mushroom = gameState.mushrooms[k];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check lightning bolts
                    if (!occupied) {
                        for (let k = 0; k < gameState.lightningBolts.length; k++) {
                            const bolt = gameState.lightningBolts[k];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check hourglasses
                    if (!occupied) {
                        for (let k = 0; k < gameState.hourglasses.length; k++) {
                            const hourglass = gameState.hourglasses[k];
                            if (hourglass.x === x && hourglass.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check stars
                    if (!occupied) {
                        for (let k = 0; k < gameState.stars.length; k++) {
                            const star = gameState.stars[k];
                            if (star.x === x && star.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check shields
                    if (!occupied) {
                        for (let k = 0; k < gameState.shields.length; k++) {
                            const shield = gameState.shields[k];
                            if (shield.x === x && shield.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 shield if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.shields.push(availableTiles[randomIndex]);
        }
    }
}

// Random mushroom spawning during gameplay
function spawnRandomMushroom() {
    // Only spawn mushrooms on higher levels with 0.3% probability
    if (gameState.level >= 5 && Math.random() < 0.003 + (gameState.level > 10 ? 0.002 : 0)) {
        // 0.3% chance per update
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, or existing mushrooms
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 mushroom if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.mushrooms.push(availableTiles[randomIndex]);
        }
    }
}
// Random shield spawning during gameplay
function spawnRandomShield() {
    // Only spawn shields on level 6+ with 0.5% probability
    if (gameState.level >= 6 && Math.random() < 0.005 + (gameState.level > 15 ? 0.003 : 0)) {
        // 0.5% chance per update
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts/hourglasses/stars/shields)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, lightning bolts, hourglasses, stars, or existing shields
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check lightning bolts
                    if (!occupied) {
                        for (let j = 0; j < gameState.lightningBolts.length; j++) {
                            const bolt = gameState.lightningBolts[j];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check hourglasses
                    if (!occupied) {
                        for (let j = 0; j < gameState.hourglasses.length; j++) {
                            const hourglass = gameState.hourglasses[j];
                            if (hourglass.x === x && hourglass.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check stars
                    if (!occupied) {
                        for (let j = 0; j < gameState.stars.length; j++) {
                            const star = gameState.stars[j];
                            if (star.x === x && star.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing shields
                    if (!occupied) {
                        for (let j = 0; j < gameState.shields.length; j++) {
                            const shield = gameState.shields[j];
                            if (shield.x === x && shield.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 shield if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.shields.push(availableTiles[randomIndex]);
        }
    }
}

function getRandomPosition() {
    const tileCount = gameState.tileCount || GRID_SIZE;
    let attempts = 0;
    const maxAttempts = BASE_SPEED; // Prevent infinite loops

    while (attempts < maxAttempts) {
        let x;
        let y;

        // Get snake's current direction
        const dx = gameState.dx || 0;
        const dy = gameState.dy || 0;

        // Bias spawn position based on movement direction
        if (dx === 1) {
            // Moving right - spawn more likely on left side
            x = 1 + Math.floor(Math.random() * Math.max(1, tileCount * 0.4)); // Left 40% of board
            y = 1 + Math.floor(Math.random() * (tileCount - SCORE_REDUCTION_FACTOR));
        } else if (dx === -1) {
            // Moving left - spawn more likely on right side
            x =
                Math.floor(tileCount * 0.6) +
                Math.floor(Math.random() * Math.max(1, tileCount * 0.4 - SCORE_REDUCTION_FACTOR)); // Right 40% of board
            y = 1 + Math.floor(Math.random() * (tileCount - SCORE_REDUCTION_FACTOR));
        } else if (dy === 1) {
            // Moving down - spawn more likely on top
            x = 1 + Math.floor(Math.random() * (tileCount - SCORE_REDUCTION_FACTOR));
            y = 1 + Math.floor(Math.random() * Math.max(1, tileCount * 0.4)); // Top 40% of board
        } else if (dy === -1) {
            // Moving up - spawn more likely on bottom
            x = 1 + Math.floor(Math.random() * (tileCount - SCORE_REDUCTION_FACTOR));
            y =
                Math.floor(tileCount * 0.6) +
                Math.floor(Math.random() * Math.max(1, tileCount * 0.4 - SCORE_REDUCTION_FACTOR)); // Bottom 40% of board
        } else {
            // No direction or stationary - use original random logic
            x = 1 + Math.floor(Math.random() * (tileCount - SCORE_REDUCTION_FACTOR));
            y = 1 + Math.floor(Math.random() * (tileCount - SCORE_REDUCTION_FACTOR));
        }

        // Ensure coordinates are within bounds
        x = Math.max(1, Math.min(tileCount - SCORE_REDUCTION_FACTOR, x));
        y = Math.max(1, Math.min(tileCount - SCORE_REDUCTION_FACTOR, y));

        // Check if position is not a wall (maze value !== 1)
        if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
            return { x, y };
        }
        attempts++;
    }

    // Fallback: find a safe position if all attempts fail
    for (let y = 1; y < tileCount - 1; y++) {
        for (let x = 1; x < tileCount - 1; x++) {
            if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                return { x, y };
            }
        }
    }
    // Ultimate fallback: center position (should be safe in most cases)
    return {
        x: Math.floor(tileCount / SCORE_REDUCTION_FACTOR),
        y: Math.floor(tileCount / SCORE_REDUCTION_FACTOR),
    };
}
const gameState = {
    gridSize: GRID_SIZE, // Define gridSize here
    tileCount: 0, // Will be calculated in resetGame/levelUp based on canvas dimensions
    baseSpeed: BASE_SPEED, // Base movement speed in ms
    snake: [{ x: 10, y: 10 }],
    dxPrev: 0,
    dyPrev: 0,
    dx: 0,
    dy: 0,
    // Direction queue for responsive controls - stores multiple rapid key presses
    directionQueue: [],
    score: 0,
    level: 1,
    lastMilestoneLevel: 0, // Track the last milestone level reached
    gameRunning: false,
    gameInterval: null,
    maze: [],
    pellets: [],
    trail: [],
    spatialGrid: [],
    mushroomPowerupActive: false,
    mushroomTimer: 0,
    mushroomLastUpdate: 0, // Track last update time for accurate timer
    shieldPowerupActive: false,
    shieldTimer: 0,
    shieldLastUpdate: 0, // Track last update time for accurate timer
    speedBoostActive: false,
    speedBoostTimer: 0,
    speedBoostLastUpdate: 0, // Track last update time for accurate speed boost timer
    lightningBolts: [],
    mushrooms: [],
    shields: [], // Array of {x, y} positions
    hourglasses: [], // Array of {x, y} positions
    timeSlowActive: false, // Activation state
    timeSlowTimer: 0, // Remaining time in milliseconds
    timeSlowLastUpdate: 0, // Timestamp reference for accurate timer
    stars: [], // Array of {x, y} positions
    scoreMultiplierActive: false, // Activation state
    scoreMultiplierTimer: 0, // Remaining time in milliseconds
    scoreMultiplierLastUpdate: 0, // Timestamp reference
    rainbowHue: 0, // Current hue value for rainbow trail effect
    superPellets: [], // Array of {x, y} positions - special pellet when only 1 pellet remains
    superPelletEaten: false, // Flag to track if super-pellet was eaten for level boost
    superPelletStreak: 0, // Consecutive super-pellet completions - 2^(streak+1) levels per streak
    paused: false,
    consecutiveMouseClicks: 0, // Count consecutive mouse/touch clicks for slowdown
    skipNextMovement: false, // Flag to skip movement on next tick after mouse direction change
    deathImminent: false, // Flag for 1-tick grace period before death in mouse mode
    pausedByPasswordInput: false, // Tracks whether pause was auto-triggered by the password input field gaining focus; used to selectively unpause when the input loses focus without overriding manual pauses.
    ignoreNextClick: false, // After auto-unpause from password blur, ignore next mouse click to prevent accidental turn
};

// Password system for level progression
const passwordSystem = {
    keySequence: [],
    maxSequenceLength: GRID_SIZE,

    // Generate deterministic password based on level
    generatePassword(level) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        let seed = level;

        // Deterministic pseudo-random generation
        for (let i = 0; i < PASSWORD_LENGTH; i++) {
            seed = (seed * 9301 + 49297) % 233280;
            const index = Math.floor((seed / 233280) * chars.length);
            password += chars[index];
        }

        return password;
    },

    // Check if key sequence matches password
    checkPassword(sequence, password) {
        const sequenceStr = sequence.join('').toUpperCase();
        const passwordStr = password.toUpperCase();
        return sequenceStr === passwordStr;
    },

    // Reset key sequence
    resetSequence() {
        this.keySequence = [];
    },

    // Add key to sequence
    addKey(key) {
        this.keySequence.push(key.toUpperCase());
        if (this.keySequence.length > this.maxSequenceLength) {
            this.keySequence.shift();
        }
    },
};

// Update password display
function updatePasswordDisplay() {
    const passwordElement = document.getElementById('password');
    if (!passwordElement) return;

    // Update last milestone level ONLY if it's a new personal best for this session
    if (gameState.level % 10 === 0 && gameState.level > gameState.lastMilestoneLevel) {
        gameState.lastMilestoneLevel = gameState.level;
        localStorage.setItem('snakeGameLastMilestone', gameState.lastMilestoneLevel);
    }

    let levelStr = '\u00A0'; // Use non-breaking space as empty line placeholder
    // Show the last reached milestone password if it exists
    if (gameState.lastMilestoneLevel > 0) {
        const milestoneLevel = gameState.lastMilestoneLevel;
        const levelPassword = passwordSystem.generatePassword(milestoneLevel);
        levelStr = `Level ${milestoneLevel - 1} password: ${levelPassword}`;
    }

    // Get typed buffer for input field sync
    const typedBufferRaw = passwordSystem.keySequence.join('');

    // Show only milestone password in the text display (input field shows typed buffer)
    passwordElement.innerText = levelStr;

    // Sync password input field (if present)
    if (passwordInput) {
        passwordInput.value = typedBufferRaw;
    }
}

// Handle key press for password system
function tryPasswordTeleport() {
    // Check for "restart" command (special case)
    const typedSequence = passwordSystem.keySequence.join('');
    if (typedSequence.toUpperCase() === 'RESTART') {
        passwordSystem.resetSequence();
        resetGame(1);
        updatePasswordDisplay();
        return;
    }

    // Only check passwords for levels divisible by 10 (and not level 1)
    for (let level = 10; level <= PASSWORD_LEVEL_MAX; level += 10) {
        const levelPassword = passwordSystem.generatePassword(level);
        if (passwordSystem.checkPassword(passwordSystem.keySequence, levelPassword)) {
            // Reset to PREVIOUS level (level - 1)
            const targetLevel = Math.max(1, level - 1);
            gameState.level = targetLevel;
            // Save current level to localStorage for persistence
            localStorage.setItem('snakeGameCurrentLevel', gameState.level);
            // Update last milestone ONLY if it's higher than the current recorded milestone
            if (level > gameState.lastMilestoneLevel) {
                gameState.lastMilestoneLevel = level;
                localStorage.setItem('snakeGameLastMilestone', gameState.lastMilestoneLevel);
            }
            gameState.score = 0;
            document.getElementById('score').innerText = `Score: ${gameState.score}`;
            document.getElementById('level').innerText = `Level: ${gameState.level}`;

            // Reset snake position and clear trail
            gameState.snake = [{ x: 10, y: 10 }];
            gameState.dx = 0;
            gameState.dy = 0;
            gameState.directionQueue = [];
            gameState.trail = [];
            gameState.superPellets = []; // Clear super-pellets on password teleport
            gameState.superPelletStreak = 0; // Reset streak on password teleport

            // Regenerate maze and pellets for the target level
            generateMaze();
            initializeSpatialGrid(); // Initialize spatial grid for collision detection
            generatePellets();

            // Reset key sequence
            passwordSystem.resetSequence();

            // Update password display
            updatePasswordDisplay();

            // Hide Game Over overlay if it was visible
            const gameOverOverlay = document.getElementById('gameOverOverlay');
            if (gameOverOverlay) {
                gameOverOverlay.classList.add('hidden');
            }

            // Ensure game is not paused after teleporting via password
            gameState.paused = false;

            // Stop current game and restart at the new level
            if (gameState.gameInterval) {
                clearInterval(gameState.gameInterval);
                gameState.gameInterval = null;
            }
            gameState.gameRunning = false;
            drawGame();

            break; // Found matching password, exit loop
        }
    }
}

function handlePasswordKey(e) {
    // If password input field is focused, ignore to avoid duplication
    if (passwordInput && document.activeElement === passwordInput) {
        return;
    }

    // Support backspace
    if (e.key === 'Backspace') {
        e.preventDefault();
        if (passwordSystem.keySequence.length > 0) {
            passwordSystem.keySequence.pop();
            updatePasswordDisplay();
        }
        return;
    }

    const key = e.key.toUpperCase();
    const validKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    if (validKeys.includes(key)) {
        e.preventDefault();
        passwordSystem.addKey(key);
        updatePasswordDisplay(); // Update display on every valid key press
        tryPasswordTeleport();
    }
}

// Handle input field changes for password entry (mobile friendly)
function handlePasswordInputChange() {
    if (!passwordInput) return;
    const raw = passwordInput.value;
    // Filter to uppercase alphanumeric and enforce max length
    let filtered = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (filtered.length > passwordSystem.maxSequenceLength) {
        filtered = filtered.slice(-passwordSystem.maxSequenceLength);
    }
    // Update input if filtering changed anything
    if (raw !== filtered) {
        passwordInput.value = filtered;
    }
    // Update key sequence
    passwordSystem.keySequence = filtered.split('');
    updatePasswordDisplay();
    tryPasswordTeleport();
}

// Listen for password key presses - managed centrally to prevent accumulation
// Centralized event listener management
function manageEventListeners(action) {
    if (action === 'add') {
        document.addEventListener('keydown', handlePasswordKey);
        document.addEventListener('keydown', handleDirectionChange);
    } else if (action === 'remove') {
        document.removeEventListener('keydown', handlePasswordKey);
        document.removeEventListener('keydown', handleDirectionChange);
    }
}

// Initial event listener setup
manageEventListeners('add');

// DOM elements for game over overlay
// DOM elements for game over overlay
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const passwordInput = document.getElementById('passwordInput');

// Attach input listener for password field (mobile support)
if (passwordInput) {
    passwordInput.addEventListener('input', handlePasswordInputChange);
    // Auto-pause when password input is focused (mobile convenience)
    passwordInput.addEventListener('focus', () => {
        if (gameState.gameRunning && !gameState.paused) {
            gameState.paused = true;
            gameState.pausedByPasswordInput = true; // Mark that we auto-paused for password
            drawGame();
        }
    });
    // Auto-unpause when password input loses focus, but only if we were the ones who paused it
    passwordInput.addEventListener('blur', () => {
        if (gameState.pausedByPasswordInput) {
            gameState.ignoreNextClick = true; // The click that triggered blur will be ignored
            gameState.paused = false;
            gameState.pausedByPasswordInput = false;
            drawGame();
        }
    });
}

function calculateTileCount() {
    if (canvas && canvas.width && gameState.gridSize > 0) {
        gameState.tileCount = canvas.width / gameState.gridSize;
    } else {
        // Fallback for environments where canvas might not be fully ready (e.g., initial load in JSDOM)
        // This value should ideally be set by the test environment or after DOMContentLoaded
        gameState.tileCount = GRID_SIZE; // Default to GRID_SIZE if canvas dimensions are not available
    }
}

function generateMaze() {
    calculateTileCount(); // Ensure tileCount is up-to-date
    gameState.maze = Array(gameState.tileCount)
        .fill(0)
        .map(() => Array(gameState.tileCount).fill(0));

    if (gameState.level < WALL_LEVEL_MAX) {
        // Create outer walls to define the game area when level is below WALL_LEVEL_MAX
        for (let i = 0; i < gameState.tileCount; i++) {
            gameState.maze[0][i] = 1; // Top wall
            gameState.maze[gameState.tileCount - 1][i] = 1; // Bottom wall
            gameState.maze[i][0] = 1; // Left wall
            gameState.maze[i][gameState.tileCount - 1] = 1; // Right wall
        }
    }

    // Dynamic internal maze generation based on level
    if (gameState.level >= 4) {
        let numInternalWalls = Math.min(10, gameState.level - 3); // More walls for higher levels, max 10
        if (gameState.level >= 500) {
            numInternalWalls += Math.min(WALL_COUNT_LIMIT, (gameState.level - 500) / GRID_SIZE); // More walls for higher levels, max WALL_COUNT_LIMIT
        }
        if (gameState.level >= WALL_COUNT_LIMIT) {
            numInternalWalls += Math.min(
                WALL_COUNT_LIMIT,
                (gameState.level - WALL_COUNT_LIMIT) / WALL_LEVEL_MAX
            ); // More walls for higher levels, max WALL_COUNT_LIMIT
        }
        if (gameState.level >= 5000) {
            numInternalWalls += Math.min(
                WALL_COUNT_LIMIT,
                (gameState.level - 5000) / WALL_LEVEL_MAX
            ); // More walls for higher levels, max WALL_COUNT_LIMIT
        }

        for (let k = 0; k < numInternalWalls; k++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < BASE_SPEED) {
                // Limit attempts to prevent infinite loops
                const wallX =
                    Math.floor(Math.random() * (gameState.tileCount - SCORE_REDUCTION_FACTOR)) + 1; // Avoid outer walls
                const wallY =
                    Math.floor(Math.random() * (gameState.tileCount - SCORE_REDUCTION_FACTOR)) + 1;
                const wallLength = Math.floor(Math.random() * 5) + 1; // Wall length 1-6
                const isHorizontal = Math.random() > 0.5;

                let canPlace = true;
                const wallSegments = [];

                for (let i = 0; i < wallLength; i++) {
                    const segmentX = isHorizontal ? wallX + i : wallX;
                    const segmentY = isHorizontal ? wallY : wallY + i;

                    // Check boundaries and existing walls (FIXED: segmentX < 1 and segmentY < 1)
                    if (
                        segmentX < 1 ||
                        segmentX >= gameState.tileCount - 1 ||
                        segmentY < 1 ||
                        segmentY >= gameState.tileCount - 1 ||
                        gameState.maze[segmentY][segmentX] === 1
                    ) {
                        canPlace = false;
                        break;
                    }
                    // Avoid placing walls directly on snake's initial spawn point
                    if (segmentX === gameState.snake[0].x && segmentY === gameState.snake[0].y) {
                        canPlace = false;
                        break;
                    }
                    wallSegments.push({ x: segmentX, y: segmentY });
                }

                if (canPlace) {
                    // Simple check for connectivity (avoid completely blocking paths)
                    // This is a basic heuristic, not a full pathfinding check
                    // For truly completable mazes, a BFS/DFS check would be needed.
                    // For now, we'll rely on random placement and hope for the best.
                    wallSegments.forEach((segment) => {
                        gameState.maze[segment.y][segment.x] = 1;
                    });
                    placed = true;
                }
                attempts++;
            }
        }
    }
}

function generatePellets() {
    calculateTileCount(); // Ensure tileCount is up-to-date
    gameState.pellets = [];
    const basePellets = 1; // Minimum pellets for level 1
    const pelletsPerLevel = 1; // How many pellets increase per level
    let maxPelletsForLevel = basePellets;
    if (gameState.level >= 1) {
        maxPelletsForLevel += (Math.min(gameState.level, 10) - 1) * pelletsPerLevel;
    }

    // Generate mushrooms for powerups
    if (gameState.level >= 10) {
        maxPelletsForLevel += ((Math.min(gameState.level - 10, 10) - 1) * pelletsPerLevel) / 2.0;
    }
    if (gameState.level >= GRID_SIZE) {
        maxPelletsForLevel +=
            ((Math.min(gameState.level - GRID_SIZE, 480) - 1) * pelletsPerLevel) / 10.0;
    }

    const availableTiles = getAvailableTiles(gameState);

    // Shuffle available tiles
    for (let i = availableTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableTiles[i], availableTiles[j]] = [availableTiles[j], availableTiles[i]];
    }

    // Distribute pellets based on level and pattern
    const numToPlace = Math.min(maxPelletsForLevel, availableTiles.length);
    for (let i = 0; i < numToPlace; i++) {
        gameState.pellets.push(availableTiles[i]);
    }

    // Ensure at least one pellet if possible
    if (gameState.pellets.length === 0 && availableTiles.length > 0) {
        gameState.pellets.push(availableTiles[0]);
    }
}

function drawMaze() {
    for (let y = 0; y < gameState.tileCount; y++) {
        for (let x = 0; x < gameState.tileCount; x++) {
            if (gameState.maze[y][x] === 1) {
                ctx.fillStyle = 'grey';
                ctx.fillRect(
                    x * gameState.gridSize,
                    y * gameState.gridSize,
                    gameState.gridSize,
                    gameState.gridSize
                );
            }
        }
    }
}

function drawPellets() {
    gameState.pellets.forEach((p) => {
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.arc(
            p.x * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR,
            p.y * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR,
            gameState.gridSize / 3,
            0,
            Math.PI * SCORE_REDUCTION_FACTOR
        );
        ctx.fill();
    });
}

function trySpawnSuperPellet() {
    // Only spawn when level 20+ and exactly 1 pellet remains and no super-pellet exists yet
    if (
        gameState.level < 20 ||
        gameState.pellets.length !== 1 ||
        gameState.superPellets.length > 0
    ) {
        return;
    }

    const lastPellet = gameState.pellets[0];

    // Find all non-wall, non-edge tiles
    const allTiles = [];
    for (let y = 1; y < gameState.tileCount - 1; y++) {
        for (let x = 1; x < gameState.tileCount - 1; x++) {
            if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                allTiles.push({ x, y });
            }
        }
    }

    // Filter out occupied tiles (snake, powerups, last pellet, AND TRAIL)
    const filteredTiles = allTiles.filter((tile) => {
        if (tile.x === lastPellet.x && tile.y === lastPellet.y) return false;
        for (let i = 0; i < gameState.snake.length; i++) {
            if (tile.x === gameState.snake[i].x && tile.y === gameState.snake[i].y) return false;
        }
        for (let i = 0; i < gameState.trail.length; i++) {
            if (tile.x === gameState.trail[i].x && tile.y === gameState.trail[i].y) return false;
        }
        for (let i = 0; i < gameState.mushrooms.length; i++) {
            if (tile.x === gameState.mushrooms[i].x && tile.y === gameState.mushrooms[i].y)
                return false;
        }
        for (let i = 0; i < gameState.shields.length; i++) {
            if (tile.x === gameState.shields[i].x && tile.y === gameState.shields[i].y)
                return false;
        }
        for (let i = 0; i < gameState.lightningBolts.length; i++) {
            if (
                tile.x === gameState.lightningBolts[i].x &&
                tile.y === gameState.lightningBolts[i].y
            )
                return false;
        }
        for (let i = 0; i < gameState.hourglasses.length; i++) {
            if (tile.x === gameState.hourglasses[i].x && tile.y === gameState.hourglasses[i].y)
                return false;
        }
        for (let i = 0; i < gameState.stars.length; i++) {
            if (tile.x === gameState.stars[i].x && tile.y === gameState.stars[i].y) return false;
        }
        return true;
    });

    if (filteredTiles.length > 0) {
        // Found a valid tile - spawn super-pellet
        const randomIndex = Math.floor(Math.random() * filteredTiles.length);
        gameState.superPellets.push(filteredTiles[randomIndex]);
    } else {
        // No available tiles - clear all powerups to make room
        gameState.mushrooms = [];
        gameState.shields = [];
        gameState.lightningBolts = [];
        gameState.hourglasses = [];
        gameState.stars = [];

        // Retry filtering with only snake, trail, and last pellet excluded
        const retryTiles = allTiles.filter((tile) => {
            if (tile.x === lastPellet.x && tile.y === lastPellet.y) return false;
            for (let i = 0; i < gameState.snake.length; i++) {
                if (tile.x === gameState.snake[i].x && tile.y === gameState.snake[i].y)
                    return false;
            }
            for (let i = 0; i < gameState.trail.length; i++) {
                if (tile.x === gameState.trail[i].x && tile.y === gameState.trail[i].y)
                    return false;
            }
            return true;
        });

        if (retryTiles.length > 0) {
            // Found room after clearing powerups
            const randomIndex = Math.floor(Math.random() * retryTiles.length);
            gameState.superPellets.push(retryTiles[randomIndex]);
        }
        // If still no tiles, the board is completely full - super-pellet won't spawn this frame
        // It will retry on next frame since snake will have moved
    }
}

function drawSuperPellets() {
    const pulse = Math.sin(performance.now() / 150) * 0.3 + 0.7;
    gameState.superPellets.forEach((sp) => {
        const centerX = sp.x * gameState.gridSize + gameState.gridSize / 2;
        const centerY = sp.y * gameState.gridSize + gameState.gridSize / 2;
        const baseRadius = gameState.gridSize / 3;

        // Outer glow
        ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius + 4, 0, Math.PI * 2);
        ctx.fill();

        // Main super-pellet
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = '#FFF8DC';
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY - 2, baseRadius / 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw mushrooms on the canvas
function drawMushrooms() {
    gameState.mushrooms.forEach((mushroom) => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            mushroom.x * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR,
            mushroom.y * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR,
            gameState.gridSize / 3,
            0,
            Math.PI * SCORE_REDUCTION_FACTOR
        );
        ctx.fill();

        // Add white spots for mushroom appearance
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
            mushroom.x * gameState.gridSize +
                gameState.gridSize / SCORE_REDUCTION_FACTOR -
                SCORE_REDUCTION_FACTOR,
            mushroom.y * gameState.gridSize +
                gameState.gridSize / SCORE_REDUCTION_FACTOR -
                SCORE_REDUCTION_FACTOR,
            gameState.gridSize / 8,
            0,
            Math.PI * SCORE_REDUCTION_FACTOR
        );
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
            mushroom.x * gameState.gridSize +
                gameState.gridSize / SCORE_REDUCTION_FACTOR +
                SCORE_REDUCTION_FACTOR,
            mushroom.y * gameState.gridSize +
                gameState.gridSize / SCORE_REDUCTION_FACTOR -
                SCORE_REDUCTION_FACTOR,
            gameState.gridSize / 8,
            0,
            Math.PI * SCORE_REDUCTION_FACTOR
        );
        ctx.fill();
    });
}
// Draw shields on the canvas
function drawShields() {
    gameState.shields.forEach((shield) => {
        ctx.fillStyle = '#00BFFF'; // Deep sky blue for shield
        ctx.beginPath();
        ctx.arc(
            shield.x * gameState.gridSize + gameState.gridSize / 2,
            shield.y * gameState.gridSize + gameState.gridSize / 2,
            gameState.gridSize / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Add shield symbol (triangle)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(
            shield.x * gameState.gridSize + gameState.gridSize / 2,
            shield.y * gameState.gridSize + gameState.gridSize / 4
        );
        ctx.lineTo(
            shield.x * gameState.gridSize + gameState.gridSize / 4,
            shield.y * gameState.gridSize + (3 * gameState.gridSize) / 4
        );
        ctx.lineTo(
            shield.x * gameState.gridSize + (3 * gameState.gridSize) / 4,
            shield.y * gameState.gridSize + (3 * gameState.gridSize) / 4
        );
        ctx.closePath();
        ctx.fill();
    });
}

// Draw shield effect around snake when active
function drawShieldEffect() {
    if (!gameState.shieldPowerupActive) return;

    // Draw a pulsing shield effect around each snake segment
    const pulse = Math.sin(performance.now() / 200) * 0.2 + 0.8; // Pulsing effect
    const shieldColor = `rgba(0, 191, 255, ${pulse * 0.8})`; // Deep sky blue with pulsing opacity

    gameState.snake.forEach((segment, index) => {
        // Draw a glowing ring around each segment
        ctx.strokeStyle = shieldColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
            segment.x * gameState.gridSize + gameState.gridSize / 2,
            segment.y * gameState.gridSize + gameState.gridSize / 2,
            gameState.gridSize / 2 + 3,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        // Draw small shield symbols around the snake
        if (index % 3 === 0) {
            // Every 3rd segment
            ctx.fillStyle = shieldColor;
            ctx.beginPath();
            ctx.moveTo(
                segment.x * gameState.gridSize + gameState.gridSize / 2,
                segment.y * gameState.gridSize + gameState.gridSize / 4
            );
            ctx.lineTo(
                segment.x * gameState.gridSize + gameState.gridSize / 4,
                segment.y * gameState.gridSize + (3 * gameState.gridSize) / 4
            );
            ctx.lineTo(
                segment.x * gameState.gridSize + (3 * gameState.gridSize) / 4,
                segment.y * gameState.gridSize + (3 * gameState.gridSize) / 4
            );
            ctx.closePath();
            ctx.fill();
        }
    });
}

function drawSnake() {
    gameState.snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head with darker green and eye indicator
            ctx.fillStyle = '#00aa00'; // Darker green for head
            ctx.fillRect(
                segment.x * gameState.gridSize,
                segment.y * gameState.gridSize,
                gameState.gridSize,
                gameState.gridSize
            );

            // Add eye indicator based on direction
            ctx.fillStyle = 'white';
            const eyeSize = Math.max(2, gameState.gridSize / PASSWORD_LENGTH);
            let eyeX = segment.x * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR;
            let eyeY = segment.y * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR;

            // Position eye based on movement direction
            if (gameState.dx === 1)
                eyeX += gameState.gridSize / 3; // Moving right
            else if (gameState.dx === -1)
                eyeX -= gameState.gridSize / 3; // Moving left
            else if (gameState.dy === 1)
                eyeY += gameState.gridSize / 3; // Moving down
            else if (gameState.dy === -1)
                eyeY -= gameState.gridSize / 3; // Moving up
            else {
                // Default position when not moving - center the eye
                eyeX = segment.x * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR;
                eyeY = segment.y * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR;
            }

            ctx.fillRect(
                eyeX - eyeSize / SCORE_REDUCTION_FACTOR,
                eyeY - eyeSize / SCORE_REDUCTION_FACTOR,
                eyeSize,
                eyeSize
            );
        } else {
            // Draw body segments with original lime color
            ctx.fillStyle = 'lime';
            ctx.fillRect(
                segment.x * gameState.gridSize,
                segment.y * gameState.gridSize,
                gameState.gridSize,
                gameState.gridSize
            );
        }
    });
}

function drawTrail() {
    // Draw trail with conditional rainbow effect
    // Rainbow effect only active during mushroom powerup
    if (gameState.mushroomPowerupActive) {
        // Draw with rainbow effect
        gameState.trail.forEach((segment, index) => {
            // Calculate hue for this segment based on its position and time
            const hue = (gameState.rainbowHue + index * 3) % HUE_FULL_CIRCLE;
            const [r, g, b] = hslToRgb(Math.floor(hue), BASE_SPEED, 50);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

            ctx.fillRect(
                segment.x * gameState.gridSize,
                segment.y * gameState.gridSize,
                gameState.gridSize,
                gameState.gridSize
            );
        });
    } else {
        // Draw with original blue trail
        ctx.fillStyle = 'blue';
        gameState.trail.forEach((segment) => {
            ctx.fillRect(
                segment.x * gameState.gridSize,
                segment.y * gameState.gridSize,
                gameState.gridSize,
                gameState.gridSize
            );
        });
    }
}

function shouldBlockMovement(head) {
    // Check for wall collisions (outer walls)
    // Note: We don't check outer walls here because wrapping is handled separately
    // and we want to allow normal wrapping even with shield active

    // Check for maze wall collisions
    if (gameState.maze[head.y] && gameState.maze[head.y][head.x] === 1) {
        // With mushroom active, snake can phase through all obstacles
        if (gameState.mushroomPowerupActive) {
            return false; // Allow movement through maze walls
        }
        // Shield blocks collision with maze walls
        if (gameState.shieldPowerupActive) {
            return true; // Block movement
        }
        // Without shield or mushroom, collision causes game over
        gameOver();
        return true; // Block movement
    }

    // Check for trail collisions
    for (let i = 0; i < gameState.trail.length; i++) {
        if (head.x === gameState.trail[i].x && head.y === gameState.trail[i].y) {
            // With mushroom active, snake can phase through all obstacles
            if (gameState.mushroomPowerupActive) {
                return false; // Allow movement through trail
            }
            // Shield blocks collision with trail
            if (gameState.shieldPowerupActive) {
                return true; // Block movement
            }
            // Without shield or mushroom, collision causes game over
            gameOver();
            return true; // Block movement
        }
    }

    return false; // Don't block movement
}
// Helper function to try random movement when snake is blocked
function tryRandomMovement() {
    const head = gameState.snake[0];

    // Define all possible directions
    const directions = [
        { dx: 0, dy: -1 }, // Up
        { dx: 1, dy: 0 }, // Right
        { dx: 0, dy: 1 }, // Down
        { dx: -1, dy: 0 }, // Left
    ];

    // Array to hold valid directions
    const validDirections = [];

    // Check each direction for validity
    for (let i = 0; i < directions.length; i++) {
        const dir = directions[i];
        const nextX = head.x + dir.dx;
        const nextY = head.y + dir.dy;

        // Handle wrapping
        let wrappedX = nextX;
        let wrappedY = nextY;
        if (wrappedX < 0) wrappedX = gameState.tileCount - 1;
        if (wrappedX >= gameState.tileCount) wrappedX = 0;
        if (wrappedY < 0) wrappedY = gameState.tileCount - 1;
        if (wrappedY >= gameState.tileCount) wrappedY = 0;

        // Create test head position
        const testHead = { x: wrappedX, y: wrappedY };

        // Check if this direction is blocked
        let blocked = false;

        // Check for maze walls (unless mushroom powerup is active)
        if (
            !gameState.mushroomPowerupActive &&
            gameState.maze[testHead.y] &&
            gameState.maze[testHead.y][testHead.x] === 1
        ) {
            blocked = true;
        }

        // Check for trail (unless mushroom powerup is active)
        if (!gameState.mushroomPowerupActive) {
            for (let j = 0; j < gameState.trail.length; j++) {
                if (testHead.x === gameState.trail[j].x && testHead.y === gameState.trail[j].y) {
                    blocked = true;
                    break;
                }
            }
        }

        // Check for snake body (excluding head)
        for (let j = 1; j < gameState.snake.length; j++) {
            if (testHead.x === gameState.snake[j].x && testHead.y === gameState.snake[j].y) {
                blocked = true;
                break;
            }
        }

        // If not blocked, add to valid directions
        if (!blocked) {
            validDirections.push(dir);
        }
    }

    // If we have valid directions, choose one randomly
    if (validDirections.length > 0) {
        // Shuffle the valid directions
        for (let i = validDirections.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [validDirections[i], validDirections[j]] = [validDirections[j], validDirections[i]];
        }

        // Set the new direction
        const chosenDir = validDirections[0];
        gameState.dx = chosenDir.dx;
        gameState.dy = chosenDir.dy;

        return true; // Successfully moved
    }

    // No valid directions - snake is trapped
    return false; // Failed to move
}

function update() {
    if (gameState.paused) return;
    if (!gameState.gameRunning) return;

    // Determine if we should skip movement this tick (mouse mode precision)
    let skipMovement = false;
    if (gameState.skipNextMovement) {
        skipMovement = true;
        gameState.skipNextMovement = false;
    }

    // Process ONE direction from queue per game tick
    // Validates each direction at execution time to allow complex sequences
    if (gameState.directionQueue.length > 0) {
        while (gameState.directionQueue.length > 0) {
            const nextDir = gameState.directionQueue.shift();

            // Validate: prevent 180-degree turns (can't go opposite of current direction)
            const isOpposite =
                nextDir.dx === -gameState.dx &&
                nextDir.dy === -gameState.dy &&
                (gameState.dx !== 0 || gameState.dy !== 0);

            if (!isOpposite) {
                // Update previous direction before applying new one (for neck collision)
                gameState.dxPrev = gameState.dx;
                gameState.dyPrev = gameState.dy;
                // Apply valid direction
                gameState.dx = nextDir.dx;
                gameState.dy = nextDir.dy;
                // If in mouse-only mode (2+ clicks), skip next movement tick for better precision
                if (gameState.consecutiveMouseClicks >= 2) {
                    gameState.skipNextMovement = true;
                }
                break; // Processed one direction this tick
            }
            // If opposite, skip and try next queued direction
        }
    }

    // REMEDY: Centralized timer updates for accuracy
    updatePowerupTimers();

    // Continue with existing logic...
    // Deadlock detection to prevent infinite trapping
    // Check if snake is surrounded by walls/trail and cannot move
    if (gameState.shieldPowerupActive && !gameState.mushroomPowerupActive) {
        const head = gameState.snake[0];
        let escapeRoutes = 0;

        // Check all four directions
        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 1, dy: 0 }, // Right
            { dx: 0, dy: 1 }, // Down
            { dx: -1, dy: 0 }, // Left
        ];

        for (let i = 0; i < directions.length; i++) {
            const nextX = head.x + directions[i].dx;
            const nextY = head.y + directions[i].dy;

            // Handle wrapping
            let wrappedX = nextX;
            let wrappedY = nextY;
            if (wrappedX < 0) wrappedX = gameState.tileCount - 1;
            if (wrappedX >= gameState.tileCount) wrappedX = 0;
            if (wrappedY < 0) wrappedY = gameState.tileCount - 1;
            if (wrappedY >= gameState.tileCount) wrappedY = 0;

            // Create a test head position
            const testHead = { x: wrappedX, y: wrappedY };

            // Check if this direction is blocked
            let blocked = false;

            // Check for maze walls
            if (gameState.maze[testHead.y] && gameState.maze[testHead.y][testHead.x] === 1) {
                blocked = true;
            }

            // Check for trail
            for (let j = 0; j < gameState.trail.length; j++) {
                if (testHead.x === gameState.trail[j].x && testHead.y === gameState.trail[j].y) {
                    blocked = true;
                    break;
                }
            }

            // If not blocked, this is an escape route
            if (!blocked) {
                escapeRoutes++;
            }
        }

        // If no escape routes, game over
        if (escapeRoutes === 0) {
            // Check if snake is in a death trap (completely surrounded by wall+trail)
            // If so, and there's no mushroom, the snake should die
            let wallAndTrailCount = 0;
            const head = gameState.snake[0];

            // Check all four directions for wall or trail
            const directions = [
                { dx: 0, dy: -1 }, // Up
                { dx: 1, dy: 0 }, // Right
                { dx: 0, dy: 1 }, // Down
                { dx: -1, dy: 0 }, // Left
            ];

            for (let i = 0; i < directions.length; i++) {
                const nextX = head.x + directions[i].dx;
                const nextY = head.y + directions[i].dy;

                // Handle wrapping
                let wrappedX = nextX;
                let wrappedY = nextY;
                if (wrappedX < 0) wrappedX = gameState.tileCount - 1;
                if (wrappedX >= gameState.tileCount) wrappedX = 0;
                if (wrappedY < 0) wrappedY = gameState.tileCount - 1;
                if (wrappedY >= gameState.tileCount) wrappedY = 0;

                // Create a test head position
                const testHead = { x: wrappedX, y: wrappedY };

                // Check if this direction is blocked by wall or trail
                let blocked = false;

                // Check for maze walls
                if (gameState.maze[testHead.y] && gameState.maze[testHead.y][testHead.x] === 1) {
                    blocked = true;
                }

                // Check for trail
                for (let j = 0; j < gameState.trail.length; j++) {
                    if (
                        testHead.x === gameState.trail[j].x &&
                        testHead.y === gameState.trail[j].y
                    ) {
                        blocked = true;
                        break;
                    }
                }

                // If blocked, increment counter
                if (blocked) {
                    wallAndTrailCount++;
                }
            }

            // If all directions are blocked by wall/trail and no mushroom, game over
            if (wallAndTrailCount === 4 && !gameState.mushroomPowerupActive) {
                gameOver();
                return;
            }
            // If no escape routes, move randomly to prevent standing still
            const randomDirections = [
                { dx: 0, dy: -1 }, // Up
                { dx: 1, dy: 0 }, // Right
                { dx: 0, dy: 1 }, // Down
                { dx: -1, dy: 0 }, // Left
            ];

            // Shuffle directions randomly
            for (let i = randomDirections.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [randomDirections[i], randomDirections[j]] = [
                    randomDirections[j],
                    randomDirections[i],
                ];
            }

            // Try the first direction
            const dir = randomDirections[0];
            gameState.dx = dir.dx;
            gameState.dy = dir.dy;
        }
    }

    // Update rainbow trail hue for animation effect
    gameState.rainbowHue = (gameState.rainbowHue + 0.5) % HUE_FULL_CIRCLE;

    updateSpatialGrid(); // Update spatial grid for accurate collision detection
    if (!skipMovement) {
        const head = {
            x: gameState.snake[0].x + gameState.dx,
            y: gameState.snake[0].y + gameState.dy,
        };
        for (let i = 1; i < gameState.snake.length; i++) {
            if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
                if (
                    i <= SCORE_REDUCTION_FACTOR &&
                    (gameState.dxPrev !== 0 || gameState.dyPrev !== 0)
                ) {
                    // Avoid collision with neck segments of self.
                    gameState.dx = gameState.dxPrev;
                    gameState.dy = gameState.dyPrev;
                    // Only for the first touch though.
                    gameState.dxPrev = 0;
                    gameState.dyPrev = 0;
                } else {
                    const newDirection = Math.round(Math.random() * 3) + 1; // Direction 1-4
                    switch (newDirection) {
                        case 1:
                            gameState.dx = 0;
                            gameState.dy = -1;
                            break;
                        case 2:
                            gameState.dx = 0;
                            gameState.dy = 1;
                            break;
                        case 3:
                            gameState.dx = -1;
                            gameState.dy = 0;
                            break;
                        case 4:
                            gameState.dx = 1;
                            gameState.dy = 0;
                            break;
                        default:
                            break;
                    }
                    gameState.snake.pop(); // Only remove tail if snake didn't eat something that causes growth
                }
                drawGame();
                return;
            }
        }

        // Check if movement should be blocked due to collision and active shield

        // Update shield timer if active
        if (gameState.shieldPowerupActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.shieldLastUpdate;
            gameState.shieldTimer -= deltaTime;
            gameState.shieldLastUpdate = currentTime;

            // Deactivate shield when timer expires
            if (gameState.shieldTimer <= 0) {
                gameState.shieldPowerupActive = false;
                gameState.shieldTimer = 0;
            }
        }

        // Helper function to check if collision should be ignored due to active shield

        // Update shield timer if active
        if (gameState.shieldPowerupActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.shieldLastUpdate;
            gameState.shieldTimer -= deltaTime;
            gameState.shieldLastUpdate = currentTime;

            // Deactivate shield when timer expires
            if (gameState.shieldTimer <= 0) {
                gameState.shieldPowerupActive = false;
                gameState.shieldTimer = 0;
            }
        }

        // Helper function to handle collisions with shield logic

        // Update shield timer if active
        if (gameState.shieldPowerupActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.shieldLastUpdate;
            gameState.shieldTimer -= deltaTime;
            gameState.shieldLastUpdate = currentTime;

            // Deactivate shield when timer expires
            if (gameState.shieldTimer <= 0) {
                gameState.shieldPowerupActive = false;
                gameState.shieldTimer = 0;
            }
        }

        // Update shield timer if active
        if (gameState.shieldPowerupActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.shieldLastUpdate;
            gameState.shieldTimer -= deltaTime;
            gameState.shieldLastUpdate = currentTime;

            // Deactivate shield when timer expires
            if (gameState.shieldTimer <= 0) {
                gameState.shieldPowerupActive = false;
                gameState.shieldTimer = 0;
            }
        }

        // REMEDY: Check for collisions BEFORE wrapping for more accurate detection
        // Check for collisions with walls and trail BEFORE wrapping
        if (shouldBlockMovement(head)) {
            // Handle shielded snake random movement
            if (gameState.shieldPowerupActive && !gameState.mushroomPowerupActive) {
                if (tryRandomMovement()) {
                    // Recalculate head position with new direction
                    head.x = gameState.snake[0].x + gameState.dx;
                    head.y = gameState.snake[0].y + gameState.dy;
                } else {
                    // No valid directions - game over
                    gameOver();
                    return;
                }
            } else {
                return; // Block movement
            }
        }

        // Handle board wrapping AFTER collision checks
        if (head.x < 0) head.x = gameState.tileCount - 1;
        if (head.x >= gameState.tileCount) head.x = 0;
        if (head.y < 0) head.y = gameState.tileCount - 1;
        if (head.y >= gameState.tileCount) head.y = 0;
        // Shield should block collisions but not interfere with wrapping
        if (shouldBlockMovement(head)) {
            // For shielded snakes (unless mushroom active), try random movement instead of blocking
            if (gameState.shieldPowerupActive && !gameState.mushroomPowerupActive) {
                // Try random movement
                if (tryRandomMovement()) {
                    // Successfully moved in a random direction, continue with update
                    // We need to recalculate head position with new direction
                    head.x = gameState.snake[0].x + gameState.dx;
                    head.y = gameState.snake[0].y + gameState.dy;

                    // Handle wrapping for new head position
                    if (head.x < 0) head.x = gameState.tileCount - 1;
                    if (head.x >= gameState.tileCount) head.x = 0;
                    if (head.y < 0) head.y = gameState.tileCount - 1;
                    if (head.y >= gameState.tileCount) head.y = 0;

                    // Continue with update function instead of returning
                } else {
                    // No valid directions - snake is trapped despite having shield
                    gameOver();
                    return; // Return early from update function
                }
            } else {
                // For unshielded snakes or when mushroom is active, block movement as before
                return; // Block movement by returning early
            }
        }

        // Collision with walls (maze)
        if (
            gameState.maze[head.y][head.x] === 1 &&
            !gameState.mushroomPowerupActive &&
            !gameState.shieldPowerupActive
        ) {
            gameOver();
            return;
        }

        // Collision with self
        // Collision with self

        for (let i = 0; i < gameState.trail.length; i++) {
            if (
                head.x === gameState.trail[i].x &&
                head.y === gameState.trail[i].y &&
                !gameState.shieldPowerupActive
            ) {
                if (!gameState.mushroomPowerupActive && !gameState.shieldPowerupActive) {
                    gameOver();
                }
            }
        }

        // Add current head to trail before moving
        gameState.trail.push({ x: gameState.snake[0].x, y: gameState.snake[0].y });

        gameState.snake.unshift(head);

        // Check for pellet eating
        // Check for item collection
        let shouldGrow = false; // Only pellets and mushrooms cause growth
        for (let i = 0; i < gameState.pellets.length; i++) {
            if (head.x === gameState.pellets[i].x && head.y === gameState.pellets[i].y) {
                gameState.pellets.splice(i, 1);
                const points = gameState.scoreMultiplierActive ? GRID_SIZE : 10;
                gameState.score += points;
                document.getElementById('score').innerText = `Score: ${gameState.score}`;
                shouldGrow = true;
                // Update game speed based on increased snake length
                clearInterval(gameState.gameInterval);
                gameState.gameInterval = setInterval(update, calculateGameSpeed());
                break;
            }
        }

        // Check for shield eating
        for (let i = 0; i < gameState.shields.length; i++) {
            if (head.x === gameState.shields[i].x && head.y === gameState.shields[i].y) {
                gameState.shields.splice(i, 1);
                // Activate shield powerup for 6 seconds
                gameState.shieldPowerupActive = true;
                gameState.shieldTimer = SHIELD_POWERUP_DURATION;
                gameState.shieldLastUpdate = performance.now(); // Store start time for accurate timer
                break;
            }
        }

        // Check for mushroom eating
        for (let i = 0; i < gameState.mushrooms.length; i++) {
            if (head.x === gameState.mushrooms[i].x && head.y === gameState.mushrooms[i].y) {
                gameState.mushrooms.splice(i, 1);
                shouldGrow = true;
                // Activate mushroom powerup for 8 seconds and make snake grow
                gameState.mushroomPowerupActive = true;
                gameState.mushroomTimer = MUSHROOM_POWERUP_DURATION;
                gameState.mushroomLastUpdate = performance.now(); // Store start time for accurate timer
                break;
            }
        }

        // Check for lightning bolt eating
        for (let i = 0; i < gameState.lightningBolts.length; i++) {
            if (
                head.x === gameState.lightningBolts[i].x &&
                head.y === gameState.lightningBolts[i].y
            ) {
                gameState.lightningBolts.splice(i, 1);

                // Reduce snake length as bonus for eating speedup
                const lengthReduction = Math.floor(gameState.snake.length / 3);
                if (lengthReduction > 0 && gameState.snake.length > 1) {
                    // Ensure snake never becomes shorter than its head
                    const actualReduction = Math.min(lengthReduction, gameState.snake.length - 1);
                    gameState.snake.splice(-actualReduction);
                }

                // Activate speed boost powerup for PASSWORD_LENGTH seconds
                gameState.speedBoostActive = true;
                // Immediately update game speed for instant boost effect
                clearInterval(gameState.gameInterval);
                gameState.gameInterval = setInterval(update, calculateGameSpeed());
                gameState.speedBoostTimer = SPEED_BOOST_DURATION;
                gameState.speedBoostLastUpdate = performance.now(); // Store start time for accurate timer
                break;
            }
        }

        // Check for hourglass eating
        for (let i = 0; i < gameState.hourglasses.length; i++) {
            if (head.x === gameState.hourglasses[i].x && head.y === gameState.hourglasses[i].y) {
                gameState.hourglasses.splice(i, 1);

                // Activate time slow powerup for 8 seconds
                gameState.timeSlowActive = true;
                gameState.timeSlowTimer = MUSHROOM_POWERUP_DURATION;
                gameState.timeSlowLastUpdate = performance.now(); // Store start time for accurate timer

                // Immediately update game speed for instant slow effect
                clearInterval(gameState.gameInterval);
                gameState.gameInterval = setInterval(update, calculateGameSpeed());
                break;
            }
        }

        // Check for star eating
        for (let i = 0; i < gameState.stars.length; i++) {
            if (head.x === gameState.stars[i].x && head.y === gameState.stars[i].y) {
                gameState.stars.splice(i, 1);
                // Activate score multiplier powerup for 10 seconds
                gameState.scoreMultiplierActive = true;
                gameState.scoreMultiplierTimer = SCORE_MULTIPLIER_DURATION;
                gameState.scoreMultiplierLastUpdate = performance.now(); // Store start time for accurate timer
                break;
            }
        }

        // Check for super-pellet eating (only spawns when 1 pellet remains)
        for (let i = 0; i < gameState.superPellets.length; i++) {
            if (head.x === gameState.superPellets[i].x && head.y === gameState.superPellets[i].y) {
                gameState.superPellets.splice(i, 1);
                gameState.superPelletEaten = true;
                gameState.pellets = []; // Clear remaining pellet to trigger level up
                break;
            }
        }

        // Update mushroom timer if powerup is active
        if (gameState.mushroomPowerupActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.mushroomLastUpdate;

            // Decrement timer by actual elapsed time
            gameState.mushroomTimer -= deltaTime;
            gameState.mushroomLastUpdate = currentTime;
            if (gameState.mushroomTimer <= 0) {
                gameState.mushroomPowerupActive = false;
                gameState.mushroomTimer = 0;

                // REMEDY: Add grace period and safe position check after mushroom expires
                const head = gameState.snake[0];
                let isInDanger = false;

                // Check if head is in a dangerous position
                if (gameState.maze[head.y] && gameState.maze[head.y][head.x] === 1) {
                    isInDanger = true;
                }

                // Check trail collision
                for (let i = 0; i < gameState.trail.length; i++) {
                    if (head.x === gameState.trail[i].x && head.y === gameState.trail[i].y) {
                        isInDanger = true;
                        break;
                    }
                }

                // If in danger and no shield, try to move to safety
                if (isInDanger && !gameState.shieldPowerupActive) {
                    // Try random movement to escape
                    if (!tryRandomMovement()) {
                        // If no escape possible, give brief invulnerability
                        gameState.shieldPowerupActive = true;
                        gameState.shieldTimer = 1000; // 1 second grace period
                        gameState.shieldLastUpdate = performance.now();
                    }
                }
                // REMOVED DUPLICATE: const head = gameState.snake[0];
                // Check outer wall collision
                if (
                    gameState.level < WALL_LEVEL_MAX &&
                    (head.x < 0 ||
                        head.x >= gameState.tileCount ||
                        head.y < 0 ||
                        (head.y >= gameState.tileCount && !gameState.shieldPowerupActive))
                ) {
                    gameOver();
                    return;
                }
                // Check maze wall collision
                if (
                    gameState.maze[head.y] &&
                    gameState.maze[head.y][head.x] === 1 &&
                    !gameState.shieldPowerupActive
                ) {
                    gameOver();
                    return;
                }
            }
        }
        // Update speed boost timer if powerup is active
        if (gameState.speedBoostActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.speedBoostLastUpdate;

            // Decrement timer by actual elapsed time
            gameState.speedBoostTimer -= deltaTime;
            gameState.speedBoostLastUpdate = currentTime;
            if (gameState.speedBoostTimer <= 0) {
                gameState.speedBoostActive = false;
                gameState.speedBoostTimer = 0;
            }
        }

        // Update time slow timer if powerup is active
        if (gameState.timeSlowActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.timeSlowLastUpdate;

            // Decrement timer by actual elapsed time
            gameState.timeSlowTimer -= deltaTime;
            gameState.timeSlowLastUpdate = currentTime;
            if (gameState.timeSlowTimer <= 0) {
                gameState.timeSlowActive = false;
                gameState.timeSlowTimer = 0;

                // Update game speed when time slow ends
                clearInterval(gameState.gameInterval);
                gameState.gameInterval = setInterval(update, calculateGameSpeed());
            }
        }
        // Update score multiplier timer if powerup is active
        if (gameState.scoreMultiplierActive) {
            const currentTime = performance.now();
            const deltaTime = currentTime - gameState.scoreMultiplierLastUpdate;

            // Decrement timer by actual elapsed time
            gameState.scoreMultiplierTimer -= deltaTime;
            gameState.scoreMultiplierLastUpdate = currentTime;
            if (gameState.scoreMultiplierTimer <= 0) {
                gameState.scoreMultiplierActive = false;
                gameState.scoreMultiplierTimer = 0;
            }
        }
        if (!shouldGrow) {
            gameState.snake.pop(); // Only remove tail if snake didn't eat something that causes growth
        }

        if (gameState.pellets.length === 0) {
            levelUp();
        }

        // Clear deathImminent after surviving a tick during grace period
        if (gameState.deathImminent) {
            gameState.deathImminent = false;
        }
    } // end skipMovement block

    spawnRandomMushroom(); // Random mushroom spawning during game
    spawnRandomShield(); // Random shield spawning during gameplayplay
    spawnRandomLightningBolt(); // Random lightning bolt spawning during gameplay
    spawnRandomHourglass();
    spawnRandomStar();
    trySpawnSuperPellet(); // Try to spawn super-pellet when 1 pellet remains
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Change background color when score multiplier is active
    if (gameState.scoreMultiplierActive) {
        ctx.fillStyle = 'rgba(255, 193, 7, 0.05)'; // Slightly brighter than normal when score multiplier active
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawMaze();
    drawPellets();
    drawSuperPellets(); // Draw super-pellets after regular pellets
    drawTrail();
    drawMushrooms(); // Draw mushroom power
    drawShields(); // Draw shield powerupsups
    drawLightningBolts(); // Draw lightning bolt powerups
    drawHourglasses();
    drawStars();
    drawSnake();
    drawShieldEffect(); // Draw shield effect when active

    // Draw mushroom powerup indicator if active
    if (gameState.mushroomPowerupActive) {
        ctx.fillStyle = 'rgba(COLOR_MAX_VALUE, 0, 0, 0.5)';
        ctx.font = 'normal normal 12px Arial, Helvetica, sans-serif';
        ctx.fillText('MUSHROOM POWER!', 10, GRID_SIZE);

        // Draw timer bar
        const timerWidth = (gameState.mushroomTimer / MUSHROOM_POWERUP_DURATION) * BASE_SPEED;
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 25, timerWidth, 5);
    }

    // Draw shield powerup indicator if active
    if (gameState.shieldPowerupActive) {
        ctx.fillStyle = 'rgba(0, 191, 255, 0.7)';
        ctx.font = 'normal normal 12px Arial, Helvetica, sans-serif';
        ctx.fillText('SHIELD ACTIVE!', 10, 70);

        // Draw timer bar
        const timerWidth = (gameState.shieldTimer / SHIELD_POWERUP_DURATION) * 20;
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(10, 75, timerWidth, 5);
    }

    // Draw the minimap showing the entire game board
    function drawMinimap() {
        // Only draw if minimap context exists and it's time to update
        if (!window.minimapCtx) return;

        const ctx = window.minimapCtx;
        const minimapSize = BASE_SPEED; // Should match CSS
        const tileCount = gameState.tileCount || GRID_SIZE;
        const scale = minimapSize / tileCount;

        // Clear the minimap
        ctx.clearRect(0, 0, minimapSize, minimapSize);

        // Draw background
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, minimapSize, minimapSize);

        // Draw maze walls
        if (gameState.maze && Array.isArray(gameState.maze)) {
            ctx.fillStyle = '#FFFFFF'; // White for walls
            for (let y = 0; y < gameState.maze.length; y++) {
                for (let x = 0; x < gameState.maze[y].length; x++) {
                    if (gameState.maze[y][x] === 1) {
                        ctx.fillRect(x * scale, y * scale, scale, scale);
                    }
                }
            }
        }

        // Draw pellets
        if (gameState.pellets && Array.isArray(gameState.pellets)) {
            ctx.fillStyle = '#FF0000'; // Red for pellets
            for (let i = 0; i < gameState.pellets.length; i++) {
                const pellet = gameState.pellets[i];
                ctx.fillRect(pellet.x * scale, pellet.y * scale, scale, scale);
            }
        }

        // Draw powerups
        // Mushrooms
        if (gameState.mushrooms && Array.isArray(gameState.mushrooms)) {
            ctx.fillStyle = '#00FF00'; // Green for mushrooms
            for (let i = 0; i < gameState.mushrooms.length; i++) {
                const mushroom = gameState.mushrooms[i];
                ctx.fillRect(mushroom.x * scale, mushroom.y * scale, scale, scale);
            }
        }

        // Lightning bolts
        if (gameState.lightningBolts && Array.isArray(gameState.lightningBolts)) {
            ctx.fillStyle = '#FFC107'; // Yellow for lightning bolts
            for (let i = 0; i < gameState.lightningBolts.length; i++) {
                const bolt = gameState.lightningBolts[i];
                ctx.fillRect(bolt.x * scale, bolt.y * scale, scale, scale);
            }
        }

        // Hourglasses
        if (gameState.hourglasses && Array.isArray(gameState.hourglasses)) {
            ctx.fillStyle = '#00FFFF'; // Cyan for hourglasses
            for (let i = 0; i < gameState.hourglasses.length; i++) {
                const hourglass = gameState.hourglasses[i];
                ctx.fillRect(hourglass.x * scale, hourglass.y * scale, scale, scale);
            }
        }

        // Stars
        if (gameState.stars && Array.isArray(gameState.stars)) {
            ctx.fillStyle = '#FF00FF'; // Magenta for stars
            for (let i = 0; i < gameState.stars.length; i++) {
                const star = gameState.stars[i];
                ctx.fillRect(star.x * scale, star.y * scale, scale, scale);
            }
        }

        // Draw snake
        if (gameState.snake && Array.isArray(gameState.snake)) {
            // Draw snake body
            ctx.fillStyle = '#00AA00'; // Darker green for snake body
            for (let i = 1; i < gameState.snake.length; i++) {
                const segment = gameState.snake[i];
                ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
            }

            // Draw snake head
            if (gameState.snake.length > 0) {
                const head = gameState.snake[0];
                ctx.fillStyle = '#00FF00'; // Bright green for snake head
                ctx.fillRect(head.x * scale, head.y * scale, scale, scale);
            }
        }
    }

    // Draw speed boost powerup indicator if active
    if (gameState.speedBoostActive) {
        ctx.fillStyle = 'rgba(COLOR_MAX_VALUE, COLOR_MAX_VALUE, 0, 0.5)';
        ctx.font = 'normal normal 12px Arial, Helvetica, sans-serif';
        ctx.fillText('SPEED BOOST!', 10, 45);

        // Draw timer bar
        const timerWidth = (gameState.speedBoostTimer / SPEED_BOOST_DURATION) * 100;
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(10, 50, timerWidth, 5);
    }

    // Draw time slow powerup indicator if active
    if (gameState.timeSlowActive) {
        ctx.fillStyle = 'rgba(128, 0, 128, 0.7)';
        ctx.font = 'normal normal 12px Arial, Helvetica, sans-serif';
        ctx.fillText('TIME SLOW!', 10, 45);

        // Draw timer bar
        const timerWidth = (gameState.timeSlowTimer / MUSHROOM_POWERUP_DURATION) * BASE_SPEED;
        ctx.fillStyle = '#800080';
        ctx.fillRect(10, 50, timerWidth, 5);
    }

    // Draw score multiplier powerup indicator if active
    if (gameState.scoreMultiplierActive) {
        ctx.fillStyle = 'rgba(COLOR_MAX_VALUE, 30, 0, 0.7)'; // Gold color with transparency
        ctx.font = 'normal normal 12px Arial, Helvetica, sans-serif';
        ctx.fillText('SCORE X2', 10, 65);

        // Draw timer bar
        const timerWidth = (gameState.scoreMultiplierTimer / SCORE_MULTIPLIER_DURATION) * 100;
        ctx.fillStyle = '#FFA000'; // Gold color
        ctx.fillRect(10, 70, timerWidth, 5);
    }
    drawMinimap(); // Draw the minimap

    // Draw pause indicator if game is paused
    if (gameState.paused) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pause text
        ctx.fillStyle = 'white';
        ctx.font = 'normal bold 48px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            'PAUSED',
            canvas.width / SCORE_REDUCTION_FACTOR,
            canvas.height / SCORE_REDUCTION_FACTOR
        );

        // Resume instruction
        ctx.font = 'normal normal 24px Arial, Helvetica, sans-serif';
        ctx.fillText(
            'Press SPACE or ESC to resume',
            canvas.width / SCORE_REDUCTION_FACTOR,
            canvas.height / SCORE_REDUCTION_FACTOR + 50
        );

        // Reset textAlign to default
        ctx.textAlign = 'left';
    }
}

// Grace period for mouse/touch mode: one-tick pause before actual death to allow steering
function gameOver() {
    if (gameState.consecutiveMouseClicks >= 2) {
        if (!gameState.deathImminent) {
            gameState.deathImminent = true;
            return; // Delay death by one tick; snake pauses this tick
        }
    }
    realGameOver();
}

function realGameOver() {
    gameState.gameRunning = false;
    clearInterval(gameState.gameInterval);
    gameState.gameInterval = null;
    finalScoreDisplay.innerText = `Score: ${gameState.score}`;

    // Display overlay first to ensure visibility
    gameOverOverlay.classList.remove('hidden');

    // Store level/score before reset

    // Implement respawn logic
    const { level, score } = gameState;
    if (level > 1) {
        gameState.gameInterval = null;
        gameState.gameRunning = false; // Ensure game is stopped before respawn
        gameState.score = Math.floor(score / SCORE_REDUCTION_FACTOR); // Halve the score first

        // Determine level change based on current level
        if (level >= 600) {
            // For high levels (>= 600): lose level only if reduced score is less than current level
            if (gameState.score < level) {
                gameState.level = Math.max(1, level - 1);
            } else {
                gameState.level = level; // Keep level
            }
        } else {
            // For levels below 600: always lose one level (original behavior)
            gameState.level = Math.max(1, level - 1);
        }
        // Save current level to localStorage for persistence
        localStorage.setItem('snakeGameCurrentLevel', gameState.level);
        gameState.snake = gameState.snake.slice(
            0,
            Math.max(1, Math.floor(gameState.snake.length / SNAKE_LENGTH_REDUCTION_FACTOR))
        ); // Reduce snake length by half, minimum 1 segment
        gameState.trail = []; // Clear trail
        gameState.superPellets = []; // Clear super-pellets on respawn
        gameState.superPelletEaten = false; // Reset super-pellet flag
        gameState.superPelletStreak = 0; // Reset super-pellet streak on death
        updateSpatialGrid(); // FIX: Update spatial grid immediately after clearing trail
        // Clear all powerups when respawning
        gameState.shields = []; // Clear shields when respawning
        gameState.lightningBolts = [];
        gameState.mushrooms = [];
        gameState.hourglasses = [];
        gameState.stars = [];
        // Reset all powerup timers and active states
        gameState.mushroomPowerupActive = false;
        gameState.speedBoostActive = false; // ADDED: Reset speed boost state on respawn
        gameState.timeSlowActive = false; // ADDED: Reset time slow state on respawn
        gameState.scoreMultiplierActive = false; // ADDED: Reset score multiplier state on respawn
        gameState.mushroomTimer = 0;
        gameState.speedBoostTimer = 0;
        gameState.timeSlowTimer = 0;
        gameState.scoreMultiplierTimer = 0;
        if (gameState.snake.length <= 1) {
            gameState.snake = [{ x: getRandomPosition().x, y: getRandomPosition().y }]; // Randomized start position
        }
        document.getElementById('score').innerText = `Score: ${gameState.score}`;
        document.getElementById('level').innerText = `Level: ${gameState.level}`;
        gameOverOverlay.classList.add('hidden'); // Hide overlay
        generateMaze(); // Regenerate maze for the new (previous) level
        initializeSpatialGrid(); // Initialize spatial grid for collision detection
        generatePellets(); // Regenerate pellets for the new (previous) level
        passwordSystem.resetSequence(); // Clear typed password on respawn
        updatePasswordDisplay(); // Update password display
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Explicit clear before respawn draw
        drawGame(); // Draw initial state for the respawned level
        if (gameState.level >= BASE_SPEED) {
            // Reset snake direction after death on level BASE_SPEED and above
            gameState.dx = 0;
            gameState.dy = 0;
            gameState.directionQueue = [];
        } else {
            startGame(); // Start game loop after respawn on levels below 100
        }
    } else {
        // Game over on level 1, truly end the game
        gameState.gameRunning = false;
        // The overlay is already visible from line 235
    }
    // REMOVED: startGame(); // Game should not start automatically after levelUp
}

function levelUp() {
    // Clear shields when level changes
    gameState.shields = [];

    clearInterval(gameState.gameInterval);
    gameState.gameInterval = null;

    let levelBoost = 0; // Number of extra segments to add to snake
    // Grant levels based on super-pellet streak
    if (gameState.superPelletEaten) {
        // Calculate level boost: 2^(streak+1)
        levelBoost = 2 ** (gameState.superPelletStreak + 1);
        const prevLevel = gameState.level;
        gameState.level += levelBoost;
        gameState.superPelletEaten = false; // Reset flag
        gameState.superPelletStreak++; // Increment streak for next time

        // Update lastMilestoneLevel for any milestones we passed
        for (let milestone = 10; milestone <= gameState.level; milestone += 10) {
            if (milestone > prevLevel && milestone > gameState.lastMilestoneLevel) {
                gameState.lastMilestoneLevel = milestone;
            }
        }
        localStorage.setItem('snakeGameLastMilestone', gameState.lastMilestoneLevel);

        // Add extra segments: twice the level boost
        const segmentCount = levelBoost * 2;
        const tailIndex = gameState.snake.length - 1;
        const tail = gameState.snake[tailIndex];
        if (gameState.snake.length >= 2) {
            for (let i = 0; i < segmentCount; i++) {
                gameState.snake.splice(tailIndex, 0, { ...tail });
            }
        } else {
            for (let i = 0; i < segmentCount; i++) {
                gameState.snake.push({ ...tail });
            }
        }
    } else {
        gameState.level++;
        gameState.superPelletStreak = 0; // Reset streak on normal level up
    }

    // Save current level to localStorage for persistence
    localStorage.setItem('snakeGameCurrentLevel', gameState.level);

    // Reset direction and clear trail
    gameState.dx = 0;
    gameState.dy = 0;
    gameState.directionQueue = []; // Clear direction queue
    gameState.trail = []; // Clear trail
    gameState.superPellets = []; // Clear super-pellets on level up
    document.getElementById('level').innerText = `Level: ${gameState.level}`;
    generateMaze();
    initializeSpatialGrid(); // Initialize spatial grid for collision detection
    generatePellets();
    generateMushrooms(); // Generate mushrooms for power
    generateShields(); // Generate shields for powerupsups
    generateLightningBolts(); // Generate lightning bolts for speed boost powerups
    generateHourglasses();
    generateStars();
    drawGame();
    gameState.gameRunning = false; // Set game to idle after level up
    gameState.deathImminent = false; // Reset death grace flag on level up
    gameState.pausedByPasswordInput = false; // Reset password pause flag
    gameState.ignoreNextClick = false; // Reset click ignore flag
    passwordSystem.resetSequence(); // Clear typed password on level transition
    updatePasswordDisplay();
}

function resetGame(level = 1) {
    // Clear shields when game resets
    gameState.shields = [];

    // FIX: Clear any existing game interval when resetting the game
    if (gameState.gameInterval) {
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = null; // Clear the interval ID
    }
    gameState.snake = [{ x: 10, y: 10 }];
    gameState.dx = 0;
    gameState.dy = 0;
    gameState.directionQueue = [];
    gameState.score = 0;
    gameState.level = level;
    // Clear saved level if resetting to level 1 (manual restart)
    if (level === 1) {
        localStorage.removeItem('snakeGameCurrentLevel');
    }
    // Keep lastMilestoneLevel intact so it stays visible on reset
    gameState.trail = [];
    gameState.superPellets = []; // Clear super-pellets on reset
    gameState.superPelletEaten = false; // Reset super-pellet flag
    gameState.superPelletStreak = 0; // Reset streak on game reset
    document.getElementById('score').innerText = `Score: ${gameState.score}`;
    document.getElementById('level').innerText = `Level: ${gameState.level}`;

    calculateTileCount(); // Recalculate tileCount based on current canvas dimensions
    generateMaze();
    initializeSpatialGrid(); // Initialize spatial grid for collision detection
    generatePellets();
    generateLightningBolts(); // Generate lightning bolts for speed boost powerups
    generateHourglasses();
    generateMushrooms();
    generateShields(); // Generate shields for powerups // Generate mushrooms for powerups
    drawGame(); // Draw initial state
    gameState.gameRunning = false;
    gameState.consecutiveMouseClicks = 0; // Reset mouse click counter on game reset
    gameState.skipNextMovement = false; // Reset movement skip flag
    gameState.deathImminent = false; // Reset death grace flag
    gameState.pausedByPasswordInput = false; // Reset password pause flag
    gameState.ignoreNextClick = false; // Reset click ignore flag
    passwordSystem.resetSequence(); // Clear typed password on game reset
    updatePasswordDisplay(); // Update password display
    gameOverOverlay.classList.add('hidden'); // Hide overlay on reset
    // Manage event listeners centrally
    manageEventListeners('remove');
    manageEventListeners('add');
}

function handleDirectionChange(e) {
    // Prevent default browser behavior for navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
    }
    // Ignore arrow keys when game is paused to prevent direction changes during pause
    if (
        gameState.paused &&
        (e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight')
    ) {
        return;
    }

    // Handle arrow keys based on game state
    if (
        !gameState.gameRunning &&
        (e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight')
    ) {
        // If game over overlay is visible, we're in true game over state
        // In this state, ignore arrow keys to prevent accidental restart
        // This prevents the bug where arrow keys restart the game during game over state
        if (!gameOverOverlay.classList.contains('hidden')) {
            return;
        }
        // Otherwise, start the game (initial start or resume after respawn)
        startGame();
        // Continue to allow normal arrow key processing
    }

    let newDx = null;
    let newDy = null;

    switch (e.key) {
        case 'ArrowUp':
            newDx = 0;
            newDy = -1;
            // Reset mouse-only mode and restart if penalty was active
            if (gameState.consecutiveMouseClicks >= 2) {
                restartGameLoop();
            }
            gameState.consecutiveMouseClicks = 0;
            gameState.skipNextMovement = false; // Clear any pending skip for precision
            break;
        case 'ArrowDown':
            newDx = 0;
            newDy = 1;
            if (gameState.consecutiveMouseClicks >= 2) {
                restartGameLoop();
            }
            gameState.consecutiveMouseClicks = 0;
            gameState.skipNextMovement = false; // Clear any pending skip for precision
            break;
        case 'ArrowLeft':
            newDx = -1;
            newDy = 0;
            if (gameState.consecutiveMouseClicks >= 2) {
                restartGameLoop();
            }
            gameState.consecutiveMouseClicks = 0;
            gameState.skipNextMovement = false; // Clear any pending skip for precision
            break;
        case 'ArrowRight':
            newDx = 1;
            newDy = 0;
            if (gameState.consecutiveMouseClicks >= 2) {
                restartGameLoop();
            }
            gameState.consecutiveMouseClicks = 0;
            gameState.skipNextMovement = false; // Clear any pending skip for precision
            break;
        case ' ':
        case 'Escape':
            // Disable mouse/touch mode when using keyboard to pause/unpause
            gameState.consecutiveMouseClicks = 0;
            gameState.skipNextMovement = false;
            gameState.paused = !gameState.paused;
            if (gameState.paused === false) {
                // Reset power-up timestamps when unpausing to avoid timer drift
                resetPowerupTimestamps();
                passwordSystem.resetSequence();
                updatePasswordDisplay();
            }
            drawGame(); // Redraw to show/hide pause indicator
            return;
        default:
            return;
    }

    // Simply queue the direction - validation happens at execution time
    // This allows sequences like UP -> LEFT when moving RIGHT
    // (UP becomes valid, then LEFT is valid against the new direction UP)

    // Prevent consecutive duplicate directions (optional optimization)
    if (gameState.directionQueue.length > 0) {
        const lastDir = gameState.directionQueue[gameState.directionQueue.length - 1];
        if (lastDir.dx === newDx && lastDir.dy === newDy) {
            return; // Skip duplicate consecutive direction
        }
    }

    // Store previous direction for neck collision detection
    gameState.dxPrev = gameState.dx;
    gameState.dyPrev = gameState.dy;

    // Add to queue with generous limit to capture fast sequences
    gameState.directionQueue.push({ dx: newDx, dy: newDy });
    if (gameState.directionQueue.length > 10) {
        gameState.directionQueue.shift(); // Remove oldest if queue gets too large
    }
}

restartButton.addEventListener('click', resetGame);

// Mouse/touch click control - click anywhere to change snake direction
// Mouse click: allows clicking anywhere on screen to steer
function handleMouseInput(e) {
    // If we just unpaused from password blur, ignore this click to avoid accidental turn
    if (gameState.ignoreNextClick) {
        gameState.ignoreNextClick = false;
        return;
    }
    if (gameState.paused) return;

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const { clientX } = e;
    const { clientY } = e;

    // Check if click is on canvas (only needed for starting the game)
    const isClickOnCanvas =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

    if (!gameState.gameRunning) {
        if (!gameOverOverlay.classList.contains('hidden')) return;
        // Only start game if click is on the canvas
        if (!isClickOnCanvas) return;
        // Starting via mouse click counts as 2 clicks for slowdown
        gameState.consecutiveMouseClicks = 2;
        startGame();
    }

    // Convert to internal canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const inputX = (clientX - rect.left) * scaleX;
    const inputY = (clientY - rect.top) * scaleY;

    // Get snake head position (center of tile) in internal canvas coordinates
    const head = gameState.snake[0];
    const headPxX = head.x * GRID_SIZE + GRID_SIZE / 2;
    const headPxY = head.y * GRID_SIZE + GRID_SIZE / 2;

    const dx = inputX - headPxX;
    const dy = inputY - headPxY;

    if (dx === 0 && dy === 0) return;

    const candidates = [];
    if (dx !== 0) candidates.push({ dx: dx > 0 ? 1 : -1, dy: 0 });
    if (dy !== 0) candidates.push({ dx: 0, dy: dy > 0 ? 1 : -1 });

    const validCandidates = candidates.filter(
        (cand) =>
            !(
                cand.dx === -gameState.dx &&
                cand.dy === -gameState.dy &&
                (gameState.dx !== 0 || gameState.dy !== 0)
            )
    );
    if (validCandidates.length === 0) return;

    let chosen = validCandidates[0];
    if (validCandidates.length === 2) {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (chosen.dx !== 0) {
            chosen = absDx >= absDy ? chosen : validCandidates[1];
        } else {
            chosen = absDy >= absDx ? chosen : validCandidates[1];
        }
    }

    gameState.dxPrev = gameState.dx;
    gameState.dyPrev = gameState.dy;
    gameState.directionQueue.push({ dx: chosen.dx, dy: chosen.dy });
    if (gameState.directionQueue.length > 10) gameState.directionQueue.shift();

    // Increment mouse click counter for slowdown
    const prevClicks = gameState.consecutiveMouseClicks;
    gameState.consecutiveMouseClicks++;
    // Restart game loop with new speed if we just crossed the threshold
    if (prevClicks < 2 && gameState.consecutiveMouseClicks >= 2) {
        restartGameLoop();
    }
}

// Touch input: only active on canvas, with bounds check
function handleTouchInput(e) {
    e.preventDefault();
    if (gameState.paused) return;
    if (!gameState.gameRunning) {
        if (!gameOverOverlay.classList.contains('hidden')) return;
        // Starting via touch counts as 2 clicks for slowdown
        gameState.consecutiveMouseClicks = 2;
        startGame();
    }

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;

    const { clientX } = touch;
    const { clientY } = touch;

    // Bounds check: only process if touch started on canvas
    if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
    ) {
        return;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const inputX = (clientX - rect.left) * scaleX;
    const inputY = (clientY - rect.top) * scaleY;

    const head = gameState.snake[0];
    const headPxX = head.x * GRID_SIZE + GRID_SIZE / 2;
    const headPxY = head.y * GRID_SIZE + GRID_SIZE / 2;

    const dx = inputX - headPxX;
    const dy = inputY - headPxY;

    if (dx === 0 && dy === 0) return;

    const candidates = [];
    if (dx !== 0) candidates.push({ dx: dx > 0 ? 1 : -1, dy: 0 });
    if (dy !== 0) candidates.push({ dx: 0, dy: dy > 0 ? 1 : -1 });

    const validCandidates = candidates.filter(
        (cand) =>
            !(
                cand.dx === -gameState.dx &&
                cand.dy === -gameState.dy &&
                (gameState.dx !== 0 || gameState.dy !== 0)
            )
    );
    if (validCandidates.length === 0) return;

    let chosen = validCandidates[0];
    if (validCandidates.length === 2) {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (chosen.dx !== 0) {
            chosen = absDx >= absDy ? chosen : validCandidates[1];
        } else {
            chosen = absDy >= absDx ? chosen : validCandidates[1];
        }
    }

    gameState.dxPrev = gameState.dx;
    gameState.dyPrev = gameState.dy;
    gameState.directionQueue.push({ dx: chosen.dx, dy: chosen.dy });
    if (gameState.directionQueue.length > 10) gameState.directionQueue.shift();

    // Increment mouse click counter for slowdown
    const prevClicks = gameState.consecutiveMouseClicks;
    gameState.consecutiveMouseClicks++;
    // Restart game loop with new speed if we just crossed the threshold
    if (prevClicks < 2 && gameState.consecutiveMouseClicks >= 2) {
        restartGameLoop();
    }
}

// Touch on canvas - prevent scrolling
document.getElementById('gameCanvas').addEventListener(
    'touchstart',
    (e) => {
        e.preventDefault();
        handleTouchInput(e);
    },
    { passive: false }
);

// Click anywhere on body (except buttons) - for PC mouse control
document.body.addEventListener('click', (e) => {
    if (
        e.target.closest('button') ||
        e.target.closest('.key') ||
        e.target.closest('.arrow') ||
        e.target.closest('#passwordInputContainer')
    ) {
        return;
    }
    handleMouseInput(e);
});

// Calculate speed based on level and snake length with reasonable limits
// Level-based speed limits: Higher levels have slower maximum speeds for better navigation
// on cluttered maps. This prevents the snake from becoming too fast on difficult levels.

function calculateGameSpeed() {
    const { baseSpeed } = gameState;
    const snakeLength = gameState.snake.length;
    const { level } = gameState;

    // Base calculation: speed decreases with snake length
    let speed = baseSpeed + snakeLength * SCORE_REDUCTION_FACTOR;

    // Level-based speed limits - higher levels get slower maximum speeds
    let maxSpeed = baseSpeed;

    if (level >= GRID_SIZE) {
        // Very high levels: slowest speed for careful navigation
        maxSpeed = baseSpeed + 80; // 180ms interval minimum
    } else if (level >= WALL_COUNT_LIMIT) {
        // High levels: moderately slow
        maxSpeed = baseSpeed + 60; // 160ms interval minimum
    } else if (level >= 10) {
        // Medium-high levels: reasonable speed
        maxSpeed = baseSpeed + 40; // 140ms interval minimum
    } else if (level >= 5) {
        // Medium levels: slightly slower
        maxSpeed = baseSpeed + GRID_SIZE; // 120ms interval minimum
    }

    // Ensure speed is at least MIN_SPEED and at most the calculated maxSpeed
    speed = Math.min(Math.max(speed, maxSpeed), MIN_SPEED);

    if (level >= 850) {
        // Slower speed for highest levels
        speed *= 1.1;
    } else if (level >= 750) {
        // Slower speed for very high levels
        speed *= 1.05;
    } else if (level >= 500) {
        // Slower speed for higher levels
        speed *= 1.025;
    } else if (level >= 200) {
        // Slower speed for high levels
        speed *= 1.0125;
    }

    // Apply speed modifiers
    // When both speed boost and time slow are active, they should cancel each other out
    if (gameState.speedBoostActive && gameState.timeSlowActive) {
        // Both active - no speed modifier applied (normal speed)
    } else if (gameState.speedBoostActive) {
        // Only speed boost active
        speed *= 0.75;
    } else if (gameState.timeSlowActive) {
        // Only time slow active
        speed *= 1.25;
    }

    // Apply mouse-only slowdown: if player used only mouse/touch for 2+ consecutive clicks
    if (gameState.consecutiveMouseClicks >= 2) {
        speed *= 1.0; // No slowdown - mechanics only (skip-turn, grace period)
    }

    return speed;
}

// Restart the game loop timer with current speed settings
function restartGameLoop() {
    if (gameState.gameInterval) {
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = setInterval(update, calculateGameSpeed());
    }
}

function resetPowerupTimestamps() {
    const now = performance.now();
    gameState.mushroomLastUpdate = now;
    gameState.shieldLastUpdate = now;
    gameState.speedBoostLastUpdate = now;
    gameState.timeSlowLastUpdate = now;
    gameState.scoreMultiplierLastUpdate = now;
}

function startGame() {
    // FIX: Clear any existing game interval before starting a new one
    if (gameState.gameInterval) {
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = null; // Clear the interval ID
    }
    if (gameState.gameRunning) return;
    // Reset power-up timestamps to prevent timer from counting idle time
    resetPowerupTimestamps();
    gameState.gameRunning = true;
    passwordSystem.resetSequence(); // Clear typed password when snake starts moving
    updatePasswordDisplay();
    gameState.gameInterval = setInterval(update, calculateGameSpeed()); // Dynamic speed based on snake length
}

// Initial setup

// Load saved current level from localStorage
const savedLevel = localStorage.getItem('snakeGameCurrentLevel');
let initialLevel = 1;
if (savedLevel !== null) {
    const parsed = parseInt(savedLevel, 10);
    if (!Number.isNaN(parsed) && parsed >= 1) {
        initialLevel = parsed;
    }
}

// Load saved milestone from localStorage
const savedMilestone = localStorage.getItem('snakeGameLastMilestone');
if (savedMilestone !== null) {
    const parsed = parseInt(savedMilestone, 10);
    if (!Number.isNaN(parsed)) {
        gameState.lastMilestoneLevel = parsed;
    }
}

resetGame(initialLevel);

// Expose gameState object for testing purposes
window.gameState = gameState;

// Expose functions for testing purposes
window.calculateTileCount = calculateTileCount;
window.generateMaze = generateMaze;
window.generatePellets = generatePellets;
window.drawMaze = drawMaze;
window.drawPellets = drawPellets;
window.drawSnake = drawSnake;
window.drawTrail = drawTrail;
window.update = update;
window.gameOver = gameOver;
window.levelUp = levelUp;
window.resetGame = resetGame;
window.startGame = startGame;

// Spatial grid management functions
function initializeSpatialGrid() {
    calculateTileCount();
    gameState.spatialGrid = Array(gameState.tileCount)
        .fill(0)
        .map(() => Array(gameState.tileCount).fill(0));

    // Initialize with maze walls using array methods
    if (gameState.maze && Array.isArray(gameState.maze)) {
        gameState.maze.forEach((row, y) => {
            if (row && Array.isArray(row)) {
                row.forEach((cell, x) => {
                    if (cell === 1) {
                        gameState.spatialGrid[y][x] = 1;
                    }
                });
            }
        });
    }
}

function updateSpatialGrid() {
    if (!gameState.spatialGrid || !Array.isArray(gameState.spatialGrid)) {
        initializeSpatialGrid();
        return;
    }

    // Clear previous snake positions using array methods
    gameState.spatialGrid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === SCORE_REDUCTION_FACTOR) {
                // Snake segments are marked as 2
                gameState.spatialGrid[y][x] = 0;
            }
        });
    });

    // Mark current snake positions
    if (gameState.snake && Array.isArray(gameState.snake)) {
        gameState.snake.forEach((segment) => {
            if (
                segment &&
                segment.x >= 0 &&
                segment.x < gameState.tileCount &&
                segment.y >= 0 &&
                segment.y < gameState.tileCount
            ) {
                gameState.spatialGrid[segment.y][segment.x] = SCORE_REDUCTION_FACTOR;
            }
        });
    }

    // Mark trail positions
    if (gameState.trail && Array.isArray(gameState.trail)) {
        gameState.trail.forEach((trailPos) => {
            if (
                trailPos &&
                trailPos.x >= 0 &&
                trailPos.x < gameState.tileCount &&
                trailPos.y >= 0 &&
                trailPos.y < gameState.tileCount
            ) {
                gameState.spatialGrid[trailPos.y][trailPos.x] = 3; // Trail marked as 3
            }
        });
    }
}

// Lightning bolt generation for speed boost powerups
function generateLightningBolts() {
    gameState.lightningBolts = [];

    // Only spawn lightning bolts on level 3+ with some probability
    if (gameState.level >= 3 && Math.random() < 0.2 - (gameState.level > 10 ? 0.05 : 0)) {
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, or existing lightning bolts
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing lightning bolts
                    if (!occupied) {
                        for (let j = 0; j < gameState.lightningBolts.length; j++) {
                            const bolt = gameState.lightningBolts[j];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 lightning bolt if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.lightningBolts.push(availableTiles[randomIndex]);
        }
    }
}

function generateHourglasses() {
    gameState.hourglasses = [];

    // Only spawn hourglasses on higher levels and with some probability
    if (gameState.level >= 5 && Math.random() < 0.2 - (gameState.level > 10 ? 0.05 : 0)) {
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts/hourglasses)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, lightning bolts, or existing hourglasses
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check lightning bolts
                    if (!occupied) {
                        for (let j = 0; j < gameState.lightningBolts.length; j++) {
                            const bolt = gameState.lightningBolts[j];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing hourglasses
                    if (!occupied) {
                        for (let j = 0; j < gameState.hourglasses.length; j++) {
                            const hourglass = gameState.hourglasses[j];
                            if (hourglass.x === x && hourglass.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 hourglass if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.hourglasses.push(availableTiles[randomIndex]);
        }
    }
}

function generateStars() {
    gameState.stars = [];

    // Only spawn stars on level 4+
    if (gameState.level >= 4 && Math.random() < 0.2 - (gameState.level > 10 ? 0.05 : 0)) {
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts/hourglasses/stars)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, lightning bolts, hourglasses, or existing stars
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check lightning bolts
                    if (!occupied) {
                        for (let j = 0; j < gameState.lightningBolts.length; j++) {
                            const bolt = gameState.lightningBolts[j];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check hourglasses
                    if (!occupied) {
                        for (let j = 0; j < gameState.hourglasses.length; j++) {
                            const hourglass = gameState.hourglasses[j];
                            if (hourglass.x === x && hourglass.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing stars
                    if (!occupied) {
                        for (let j = 0; j < gameState.stars.length; j++) {
                            const star = gameState.stars[j];
                            if (star.x === x && star.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 star if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.stars.push(availableTiles[randomIndex]);
        }
    }
}

// Random lightning bolt spawning during gameplay
function spawnRandomLightningBolt() {
    // Only spawn lightning bolts on level 3+ with 0.6% probability
    if (gameState.level >= 3 && Math.random() < 0.006) {
        // 0.6% chance per update
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, or existing lightning bolts
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing lightning bolts
                    if (!occupied) {
                        for (let j = 0; j < gameState.lightningBolts.length; j++) {
                            const bolt = gameState.lightningBolts[j];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 lightning bolt if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.lightningBolts.push(availableTiles[randomIndex]);
        }
    }
}

function spawnRandomHourglass() {
    // Only spawn hourglasses on higher levels and with some probability
    if (gameState.level >= 5 && Math.random() < 0.008) {
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts/hourglasses)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, lightning bolts, or existing hourglasses
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check lightning bolts
                    if (!occupied) {
                        for (let j = 0; j < gameState.lightningBolts.length; j++) {
                            const bolt = gameState.lightningBolts[j];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing hourglasses
                    if (!occupied) {
                        for (let j = 0; j < gameState.hourglasses.length; j++) {
                            const hourglass = gameState.hourglasses[j];
                            if (hourglass.x === x && hourglass.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 hourglass if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.hourglasses.push(availableTiles[randomIndex]);
        }
    }
}

function spawnRandomStar() {
    // Only spawn stars on level 4+ with 1.2% probability
    if (gameState.level >= 4 && Math.random() < 0.012) {
        const availableTiles = getAvailableTiles(gameState);
        // Find all available tiles (not walls, not occupied by snake/pellets/mushrooms/lightning bolts/hourglasses/stars)
        for (let y = 1; y < gameState.tileCount - 1; y++) {
            for (let x = 1; x < gameState.tileCount - 1; x++) {
                if (gameState.maze && gameState.maze[y] && gameState.maze[y][x] !== 1) {
                    // Check if tile is not occupied by snake, pellets, mushrooms, lightning bolts, hourglasses, or existing stars
                    let occupied = false;

                    // Check snake
                    for (let j = 0; j < gameState.snake.length; j++) {
                        const segment = gameState.snake[j];
                        if (segment.x === x && segment.y === y) {
                            occupied = true;
                            break;
                        }
                    }

                    // Check pellets
                    if (!occupied) {
                        for (let j = 0; j < gameState.pellets.length; j++) {
                            const pellet = gameState.pellets[j];
                            if (pellet.x === x && pellet.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check mushrooms
                    if (!occupied) {
                        for (let j = 0; j < gameState.mushrooms.length; j++) {
                            const mushroom = gameState.mushrooms[j];
                            if (mushroom.x === x && mushroom.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check lightning bolts
                    if (!occupied) {
                        for (let j = 0; j < gameState.lightningBolts.length; j++) {
                            const bolt = gameState.lightningBolts[j];
                            if (bolt.x === x && bolt.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check hourglasses
                    if (!occupied) {
                        for (let j = 0; j < gameState.hourglasses.length; j++) {
                            const hourglass = gameState.hourglasses[j];
                            if (hourglass.x === x && hourglass.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    // Check existing stars
                    if (!occupied) {
                        for (let j = 0; j < gameState.stars.length; j++) {
                            const star = gameState.stars[j];
                            if (star.x === x && star.y === y) {
                                occupied = true;
                                break;
                            }
                        }
                    }

                    if (!occupied) {
                        availableTiles.push({ x, y });
                    }
                }
            }
        }

        // Spawn 1 star if available tiles exist
        if (availableTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            gameState.stars.push(availableTiles[randomIndex]);
        }
    }
}

// Draw lightning bolts on the canvas
function drawLightningBolts() {
    gameState.lightningBolts.forEach((bolt) => {
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.moveTo(
            bolt.x * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR,
            bolt.y * gameState.gridSize
        );
        ctx.lineTo(
            bolt.x * gameState.gridSize + gameState.gridSize / 4,
            bolt.y * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR
        );
        ctx.lineTo(
            bolt.x * gameState.gridSize + (gameState.gridSize * 3) / 4,
            bolt.y * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR
        );
        ctx.lineTo(
            bolt.x * gameState.gridSize + gameState.gridSize / SCORE_REDUCTION_FACTOR,
            bolt.y * gameState.gridSize + gameState.gridSize
        );
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = SCORE_REDUCTION_FACTOR;
        ctx.stroke();
        ctx.fill();
    });
}

function drawHourglasses() {
    const { gridSize } = gameState;
    ctx.fillStyle = '#800080'; // Purple color for hourglasses

    for (let i = 0; i < gameState.hourglasses.length; i++) {
        const hourglass = gameState.hourglasses[i];
        const x = hourglass.x * gridSize;
        const y = hourglass.y * gridSize;

        // Draw hourglass shape (simplified)
        ctx.beginPath();
        ctx.moveTo(x + gridSize * 0.3, y + gridSize * 0.2);
        ctx.lineTo(x + gridSize * 0.7, y + gridSize * 0.2);
        ctx.lineTo(x + gridSize * 0.5, y + gridSize * 0.5);
        ctx.lineTo(x + gridSize * 0.7, y + gridSize * 0.8);
        ctx.lineTo(x + gridSize * 0.3, y + gridSize * 0.8);
        ctx.lineTo(x + gridSize * 0.5, y + gridSize * 0.5);
        ctx.closePath();
        ctx.fill();

        // Add subtle pulsing effect
        const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
        ctx.globalAlpha = pulse;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function drawStars() {
    const { gridSize } = gameState;
    ctx.fillStyle = '#FFA000'; // Gold color for stars

    for (let i = 0; i < gameState.stars.length; i++) {
        const star = gameState.stars[i];
        const x = star.x * gridSize;
        const y = star.y * gridSize;

        // Draw five-pointed star
        ctx.beginPath();
        const centerX = x + gridSize / SCORE_REDUCTION_FACTOR;
        const centerY = y + gridSize / SCORE_REDUCTION_FACTOR;
        const outerRadius = gridSize / 3;
        const innerRadius = outerRadius / SCORE_REDUCTION_FACTOR;

        for (let j = 0; j < 10; j++) {
            const radius = j % SCORE_REDUCTION_FACTOR === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / 5) * j - Math.PI / SCORE_REDUCTION_FACTOR;
            const pointX = centerX + radius * Math.cos(angle);
            const pointY = centerY + radius * Math.sin(angle);

            if (j === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }

        ctx.closePath();
        ctx.fill();

        // Add subtle pulsing effect
        const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
        ctx.globalAlpha = pulse;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

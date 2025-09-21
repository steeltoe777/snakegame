const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Group game state into a single object for easier management and testing

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r; let g; let b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function generateMushrooms() {
    gameState.mushrooms = [];

    // Only spawn mushrooms on higher levels and with some probability
    if (gameState.level >= 5 && Math.random() < 0.15) {
        const availableTiles = [];

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

// Random mushroom spawning during gameplay
function spawnRandomMushroom() {
    // Only spawn mushrooms on higher levels and with low probability
    if (gameState.level >= 5 && Math.random() < 0.005) {
        // 1% chance per update
        const availableTiles = [];

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

function getRandomPosition() {
    const tileCount = gameState.tileCount || 20;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

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
            y = 1 + Math.floor(Math.random() * (tileCount - 2));
        } else if (dx === -1) {
            // Moving left - spawn more likely on right side
            x =
                Math.floor(tileCount * 0.6) +
                Math.floor(Math.random() * Math.max(1, tileCount * 0.4 - 2)); // Right 40% of board
            y = 1 + Math.floor(Math.random() * (tileCount - 2));
        } else if (dy === 1) {
            // Moving down - spawn more likely on top
            x = 1 + Math.floor(Math.random() * (tileCount - 2));
            y = 1 + Math.floor(Math.random() * Math.max(1, tileCount * 0.4)); // Top 40% of board
        } else if (dy === -1) {
            // Moving up - spawn more likely on bottom
            x = 1 + Math.floor(Math.random() * (tileCount - 2));
            y =
                Math.floor(tileCount * 0.6) +
                Math.floor(Math.random() * Math.max(1, tileCount * 0.4 - 2)); // Bottom 40% of board
        } else {
            // No direction or stationary - use original random logic
            x = 1 + Math.floor(Math.random() * (tileCount - 2));
            y = 1 + Math.floor(Math.random() * (tileCount - 2));
        }

        // Ensure coordinates are within bounds
        x = Math.max(1, Math.min(tileCount - 2, x));
        y = Math.max(1, Math.min(tileCount - 2, y));

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
    return { x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) };
}
const gameState = {
    gridSize: 20, // Define gridSize here
    tileCount: 0, // Will be calculated in resetGame/levelUp based on canvas dimensions
    baseSpeed: 100, // Base movement speed in ms
    snake: [{ x: 10, y: 10 }],
    dxPrev: 0,
    dyPrev: 0,
    dx: 0,
    dy: 0,
    score: 0,
    level: 1,
    gameRunning: false,
    gameInterval: null,
    maze: [],
    pellets: [],
    trail: [],
    spatialGrid: [],
    mushroomPowerupActive: false,
    mushroomTimer: 0,
    mushroomLastUpdate: 0, // Track last update time for accurate timer
    speedBoostActive: false,
    speedBoostTimer: 0,
    speedBoostLastUpdate: 0, // Track last update time for accurate speed boost timer
    lightningBolts: [],
    mushrooms: [],
    hourglasses: [], // Array of {x, y} positions
    timeSlowActive: false, // Activation state
    timeSlowTimer: 0, // Remaining time in milliseconds
    timeSlowLastUpdate: 0, // Timestamp reference for accurate timer
    stars: [], // Array of {x, y} positions
    scoreMultiplierActive: false, // Activation state
    scoreMultiplierTimer: 0, // Remaining time in milliseconds
    scoreMultiplierLastUpdate: 0, // Timestamp reference
    rainbowHue: 0, // Current hue value for rainbow trail effect
};

// Password system for level progression
const passwordSystem = {
    keySequence: [],
    maxSequenceLength: 20,

    // Generate deterministic password based on level
    generatePassword(level) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        let seed = level;

        // Deterministic pseudo-random generation
        for (let i = 0; i < 6; i++) {
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

    // Only show passwords for levels divisible by 10 (and not level 1)
    if (gameState.level % 10 === 0 && gameState.level > 1) {
        const password = passwordSystem.generatePassword(gameState.level);
        passwordElement.innerText = `Password: ${password}`;
        passwordElement.style.display = 'block';
    } else {
        passwordElement.innerText = '';
        passwordElement.style.display = 'none';
    }
}

// Handle key press for password system
function handlePasswordKey(e) {
    const key = e.key.toUpperCase();
    const validKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    if (validKeys.includes(key)) {
        passwordSystem.addKey(key);

        // Only check passwords for levels divisible by 10 (and not level 1)
        for (let level = 10; level <= 100000; level += 10) {
            const levelPassword = passwordSystem.generatePassword(level);
            if (passwordSystem.checkPassword(passwordSystem.keySequence, levelPassword)) {
                // Reset to PREVIOUS level (level - 1)
                const targetLevel = Math.max(1, level - 1);
                gameState.level = targetLevel;
                gameState.score = 0;
                document.getElementById('score').innerText = `Score: ${gameState.score}`;
                document.getElementById('level').innerText = `Level: ${gameState.level}`;

                // Reset snake position and clear trail
                gameState.snake = [{ x: 10, y: 10 }];
                gameState.dx = 0;
                gameState.dy = 0;
                gameState.trail = [];

                // Regenerate maze and pellets for the target level
                generateMaze();
                initializeSpatialGrid(); // Initialize spatial grid for collision detection
                generatePellets();

                // Reset key sequence
                passwordSystem.resetSequence();

                // Update password display
                updatePasswordDisplay();

                // Stop current game and restart
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
}

// Listen for password key presses
document.addEventListener('keydown', handlePasswordKey);

// DOM elements for game over overlay
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

function calculateTileCount() {
    if (canvas && canvas.width && gameState.gridSize > 0) {
        gameState.tileCount = canvas.width / gameState.gridSize;
    } else {
        // Fallback for environments where canvas might not be fully ready (e.g., initial load in JSDOM)
        // This value should ideally be set by the test environment or after DOMContentLoaded
        gameState.tileCount = 20; // Default to 20 if canvas dimensions are not available
    }
}

function generateMaze() {
    calculateTileCount(); // Ensure tileCount is up-to-date
    gameState.maze = Array(gameState.tileCount)
        .fill(0)
        .map(() => Array(gameState.tileCount).fill(0));

    if (gameState.level < 1000) {
        // Create outer walls to define the game area when level is below 1000
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
            numInternalWalls += Math.min(15, (gameState.level - 500) / 20); // More walls for higher levels, max 15
        }
        if (gameState.level >= 1500) {
            numInternalWalls += Math.min(15, (gameState.level - 1500) / 1000); // More walls for higher levels, max 15
        }
        if (gameState.level >= 5000) {
            numInternalWalls += Math.min(15, (gameState.level - 5000) / 1000); // More walls for higher levels, max 15
        }

        for (let k = 0; k < numInternalWalls; k++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                // Limit attempts to prevent infinite loops
                const wallX = Math.floor(Math.random() * (gameState.tileCount - 2)) + 1; // Avoid outer walls
                const wallY = Math.floor(Math.random() * (gameState.tileCount - 2)) + 1;
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
    if (gameState.level >= 20) {
        maxPelletsForLevel += ((Math.min(gameState.level - 20, 480) - 1) * pelletsPerLevel) / 10.0;
    }

    const availableTiles = [];
    for (let y = 0; y < gameState.tileCount; y++) {
        for (let x = 0; x < gameState.tileCount; x++) {
            // Place pellets only on path squares (maze[y][x] === 0)
            // and not on the initial snake position
            if (
                gameState.maze[y][x] === 0 &&
                !(x === gameState.snake[0].x && y === gameState.snake[0].y)
            ) {
                availableTiles.push({ x, y });
            }
        }
    }

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
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(
            p.x * gameState.gridSize + gameState.gridSize / 2,
            p.y * gameState.gridSize + gameState.gridSize / 2,
            gameState.gridSize / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
}

// Draw mushrooms on the canvas
function drawMushrooms() {
    gameState.mushrooms.forEach((mushroom) => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            mushroom.x * gameState.gridSize + gameState.gridSize / 2,
            mushroom.y * gameState.gridSize + gameState.gridSize / 2,
            gameState.gridSize / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Add white spots for mushroom appearance
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
            mushroom.x * gameState.gridSize + gameState.gridSize / 2 - 2,
            mushroom.y * gameState.gridSize + gameState.gridSize / 2 - 2,
            gameState.gridSize / 8,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
            mushroom.x * gameState.gridSize + gameState.gridSize / 2 + 2,
            mushroom.y * gameState.gridSize + gameState.gridSize / 2 - 2,
            gameState.gridSize / 8,
            0,
            Math.PI * 2
        );
        ctx.fill();
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
            const eyeSize = Math.max(2, gameState.gridSize / 6);
            let eyeX = segment.x * gameState.gridSize + gameState.gridSize / 2;
            let eyeY = segment.y * gameState.gridSize + gameState.gridSize / 2;

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
                eyeX = segment.x * gameState.gridSize + gameState.gridSize / 2;
                eyeY = segment.y * gameState.gridSize + gameState.gridSize / 2;
            }

            ctx.fillRect(eyeX - eyeSize / 2, eyeY - eyeSize / 2, eyeSize, eyeSize);
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
            const hue = (gameState.rainbowHue + index * 3) % 360;
            const [r, g, b] = hslToRgb(Math.floor(hue), 100, 50);
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



function update() {
    if (!gameState.gameRunning) return;
    // Update rainbow trail hue for animation effect
    gameState.rainbowHue = (gameState.rainbowHue + 0.5) % 360;
    

    updateSpatialGrid(); // Update spatial grid for accurate collision detection
    const head = { x: gameState.snake[0].x + gameState.dx, y: gameState.snake[0].y + gameState.dy };

    // Collision with outer walls
    if (
        head.x < 0 ||
        head.x >= gameState.tileCount ||
        head.y < 0 ||
        head.y >= gameState.tileCount
    ) {
        if (gameState.level < 1000 && !gameState.mushroomPowerupActive) {
            // Only check for outer wall collisions on level below 1000 and without mushroom
            gameOver();
            return;
        }
        if (head.x < 0) {
            head.x = gameState.tileCount - 1;
        }
        if (head.x >= gameState.tileCount) {
            head.x = 0;
        }
        if (head.y < 0) {
            head.y = gameState.tileCount - 1;
        }
        if (head.y >= gameState.tileCount) {
            head.y = 0;
        }
    }

    // Collision with walls (maze)
    if (gameState.maze[head.y][head.x] === 1 && !gameState.mushroomPowerupActive) {
        gameOver();
        return;
    }

    // Collision with self
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            if (i < gameState.snake.length - 500000000) {
                gameOver();
            } else {
                if (i <= 2 && (gameState.dxPrev !== 0 || gameState.dyPrev !== 0)) {
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
                    gameState.snake.pop(); // Only remove tail if no pellet was eaten
                }
                drawGame();
            }
            return;
        }
    }

    // Collision with trail
    for (let i = 0; i < gameState.trail.length; i++) {
        if (head.x === gameState.trail[i].x && head.y === gameState.trail[i].y) {
            if (!gameState.mushroomPowerupActive) {
                gameOver();
            }
        }
    }

    // Add current head to trail before moving
    gameState.trail.push({ x: gameState.snake[0].x, y: gameState.snake[0].y });

    gameState.snake.unshift(head);

    // Check for pellet eating
    let atePellet = false;
    for (let i = 0; i < gameState.pellets.length; i++) {
        if (head.x === gameState.pellets[i].x && head.y === gameState.pellets[i].y) {
            gameState.pellets.splice(i, 1);
            const points = gameState.scoreMultiplierActive ? 20 : 10;
            gameState.score += points;
            document.getElementById('score').innerText = `Score: ${gameState.score}`;
            atePellet = true;
            // Update game speed based on increased snake length
            clearInterval(gameState.gameInterval);
            gameState.gameInterval = setInterval(update, calculateGameSpeed());
            break;
        }

        // Check for mushroom eating
        for (let i = 0; i < gameState.mushrooms.length; i++) {
            if (head.x === gameState.mushrooms[i].x && head.y === gameState.mushrooms[i].y) {
                gameState.mushrooms.splice(i, 1);
                atePellet = true;
                // Activate mushroom powerup for 8 seconds and make snake grow
                gameState.mushroomPowerupActive = true;
                gameState.mushroomTimer = 8000;
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
                atePellet = true;
                // Activate speed boost powerup for 6 seconds
                gameState.speedBoostActive = true;
                // Immediately update game speed for instant boost effect
                clearInterval(gameState.gameInterval);
                gameState.gameInterval = setInterval(update, calculateGameSpeed());
                gameState.speedBoostTimer = 6000;
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
                gameState.timeSlowTimer = 8000;
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
                atePellet = true;
                // Activate score multiplier powerup for 10 seconds
                gameState.scoreMultiplierActive = true;
                gameState.scoreMultiplierTimer = 10000;
                gameState.scoreMultiplierLastUpdate = performance.now(); // Store start time for accurate timer
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
    }

    if (!atePellet) {
        gameState.snake.pop(); // Only remove tail if no pellet was eaten
    }

    if (gameState.pellets.length === 0) {
        levelUp();
    }

    spawnRandomMushroom(); // Random mushroom spawning during gameplay
    spawnRandomLightningBolt(); // Random lightning bolt spawning during gameplay
    spawnRandomHourglass();
    spawnRandomStar();
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Change background color when score multiplier is active
    if (gameState.scoreMultiplierActive) {
        ctx.fillStyle = 'rgba(255, 255, 220, 0.01)'; // Light yellow with transparency
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawMaze();
    drawPellets();
    drawTrail();
    drawMushrooms(); // Draw mushroom powerups
    drawLightningBolts(); // Draw lightning bolt powerups
    drawHourglasses();
    drawStars();
    drawSnake();

    // Draw mushroom powerup indicator if active
    if (gameState.mushroomPowerupActive) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.font = '12px Arial';
        ctx.fillText('MUSHROOM POWER!', 10, 20);

        // Draw timer bar
        const timerWidth = (gameState.mushroomTimer / 8000) * 100;
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 25, timerWidth, 5);
    }

    // Draw speed boost powerup indicator if active
    if (gameState.speedBoostActive) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.font = '12px Arial';
        ctx.fillText('SPEED BOOST!', 10, 45);

        // Draw timer bar
        const timerWidth = (gameState.speedBoostTimer / 6000) * 100;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(10, 50, timerWidth, 5);
    }

    // Draw time slow powerup indicator if active
    if (gameState.timeSlowActive) {
        ctx.fillStyle = 'rgba(128, 0, 128, 0.7)';
        ctx.font = '12px Arial';
        ctx.fillText('TIME SLOW!', 10, 45);

        // Draw timer bar
        const timerWidth = (gameState.timeSlowTimer / 8000) * 100;
        ctx.fillStyle = '#800080';
        ctx.fillRect(10, 50, timerWidth, 5);
    }

    // Draw score multiplier powerup indicator if active
    if (gameState.scoreMultiplierActive) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.7)'; // Gold color with transparency
        ctx.font = '12px Arial';
        ctx.fillText('SCORE X2', 10, 65);

        // Draw timer bar
        const timerWidth = (gameState.scoreMultiplierTimer / 10000) * 100;
        ctx.fillStyle = '#FFD700'; // Gold color
        ctx.fillRect(10, 70, timerWidth, 5);
    }
}

function gameOver() {
    gameState.gameRunning = false;
    clearInterval(gameState.gameInterval);
    finalScoreDisplay.innerText = `Score: ${gameState.score}`;

    // Display overlay first to ensure visibility
    gameOverOverlay.classList.remove('hidden');
    finalScoreDisplay.innerText = `Score: ${gameState.score}`;

    // Store level/score before reset
    const { level, score } = gameState;

    // Implement respawn logic
    if (level > 1) {
        clearInterval(gameState.gameInterval); // Clear existing interval
        gameState.gameInterval = null;
        gameState.gameRunning = false; // Ensure game is stopped before respawn
        gameState.level = Math.max(1, level - 1); // Go back to previous level, min 1
        gameState.score = Math.floor(score / 2); // Halve the score
        gameState.snake = gameState.snake.slice(
            0,
            Math.max(1, Math.floor(gameState.snake.length / 2))
        ); // Reduce snake length by half, minimum 1 segment
        gameState.trail = []; // Clear trail
        // Clear all powerups when respawning
        gameState.lightningBolts = [];
        gameState.mushrooms = [];
        gameState.hourglasses = [];
        gameState.stars = [];
        // Reset all powerup timers and active states
        gameState.mushroomPowerupActive = false;
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
        drawGame(); // Draw initial state for the respawned level
        if (gameState.level >= 100) {
            // Reset snake direction after death on level 100 and above
            gameState.dx = 0;
            gameState.dy = 0;
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
    clearInterval(gameState.gameInterval);
    gameState.gameInterval = null;
    gameState.level++;
    const newSnake = [];
    newSnake.push({ x: 10, y: 10 }); // Head
    newSnake.push({ x: 10, y: 10 }); // Body segment 1
    newSnake.push({ x: 10, y: 10 }); // Body segment 2
    // Snake will appear as single segment initially, but body will show as it moves
    gameState.dx = 0; // Reset direction
    gameState.dy = 0; // Reset direction
    gameState.trail = []; // Clear trail
    document.getElementById('level').innerText = `Level: ${gameState.level}`;
    generateMaze();
    initializeSpatialGrid(); // Initialize spatial grid for collision detection
    generatePellets();
    generateMushrooms(); // Generate mushrooms for powerups
    generateLightningBolts(); // Generate lightning bolts for speed boost powerups
    generateHourglasses();
    generateStars();
    drawGame();
    gameState.gameRunning = false; // Set game to idle after level up
    updatePasswordDisplay();
}

function resetGame() {
    // FIX: Clear any existing game interval when resetting the game
    if (gameState.gameInterval) {
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = null; // Clear the interval ID
    }
    gameState.snake = [{ x: 10, y: 10 }];
    gameState.dx = 0;
    gameState.dy = 0;
    gameState.score = 0;
    gameState.level = 1;
    gameState.trail = [];
    document.getElementById('score').innerText = `Score: ${gameState.score}`;
    document.getElementById('level').innerText = `Level: ${gameState.level}`;

    calculateTileCount(); // Recalculate tileCount based on current canvas dimensions
    generateMaze();
    initializeSpatialGrid(); // Initialize spatial grid for collision detection
    generatePellets();
    generateLightningBolts(); // Generate lightning bolts for speed boost powerups
    generateHourglasses();
    generateMushrooms(); // Generate mushrooms for powerups
    drawGame(); // Draw initial state
    gameState.gameRunning = false;
    gameOverOverlay.classList.add('hidden'); // Hide overlay on reset

    // Re-enable keyboard controls
    document.removeEventListener('keydown', handleDirectionChange);
    document.addEventListener('keydown', handleDirectionChange);
    updatePasswordDisplay();
}

function handleDirectionChange(e) {
    if (
        !gameState.gameRunning &&
        (e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight')
    ) {
        startGame();
    }

    switch (e.key) {
        case 'ArrowUp':
            if (gameState.dy !== 1) {
                gameState.dxPrev = gameState.dx;
                gameState.dyPrev = gameState.dy;
                gameState.dx = 0;
                gameState.dy = -1;
            }
            break;
        case 'ArrowDown':
            if (gameState.dy !== -1) {
                gameState.dxPrev = gameState.dx;
                gameState.dyPrev = gameState.dy;
                gameState.dx = 0;
                gameState.dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (gameState.dx !== 1) {
                gameState.dxPrev = gameState.dx;
                gameState.dyPrev = gameState.dy;
                gameState.dx = -1;
                gameState.dy = 0;
            }
            break;
        case 'ArrowRight':
            if (gameState.dx !== -1) {
                gameState.dxPrev = gameState.dx;
                gameState.dyPrev = gameState.dy;
                gameState.dx = 1;
                gameState.dy = 0;
            }
            break;
        default:
            break;
    }
}

document.addEventListener('keydown', handleDirectionChange);

restartButton.addEventListener('click', resetGame);

// Calculate speed based on level and snake length with reasonable limits
// Level-based speed limits: Higher levels have slower maximum speeds for better navigation
// on cluttered maps. This prevents the snake from becoming too fast on difficult levels.

function calculateGameSpeed() {
    const { baseSpeed } = gameState;
    const snakeLength = gameState.snake.length;
    const { level } = gameState;

    // Base calculation: speed decreases with snake length
    let speed = baseSpeed + snakeLength * 2;

    // Level-based speed limits - higher levels get slower maximum speeds
    let maxSpeed = baseSpeed;

    if (level >= 20) {
        // Very high levels: slowest speed for careful navigation
        maxSpeed = baseSpeed + 80; // 180ms interval minimum
    } else if (level >= 15) {
        // High levels: moderately slow
        maxSpeed = baseSpeed + 60; // 160ms interval minimum
    } else if (level >= 10) {
        // Medium-high levels: reasonable speed
        maxSpeed = baseSpeed + 40; // 140ms interval minimum
    } else if (level >= 5) {
        // Medium levels: slightly slower
        maxSpeed = baseSpeed + 20; // 120ms interval minimum
    }

    // Apply speed boost if active
    if (gameState.speedBoostActive) {
        speed *= 0.75;
        maxSpeed *= 0.75;
    }

    // Apply time slow if active
    if (gameState.timeSlowActive) {
        speed *= 1.25;
        maxSpeed *= 1.25;
    }

    return Math.max(speed, maxSpeed);
}

function startGame() {
    if (gameState.gameRunning) return;
    gameState.gameRunning = true;
    gameState.gameInterval = setInterval(update, calculateGameSpeed()); // Dynamic speed based on snake length
}

// Initial setup
resetGame(); // Re-add this line

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
            if (cell === 2) {
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
                gameState.spatialGrid[segment.y][segment.x] = 2;
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
    if (gameState.level >= 3 && Math.random() < 0.00001) {
        const availableTiles = [];

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
    if (gameState.level >= 5 && Math.random() < 0.00005) {
        const availableTiles = [];

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
    if (gameState.level >= 4 && Math.random() < 0.00001) {
        const availableTiles = [];

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
    // Only spawn lightning bolts on level 3+ with low probability
    if (gameState.level >= 3 && Math.random() < 0.008) {
        // 0.8% chance per update
        const availableTiles = [];

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
    if (gameState.level >= 5 && Math.random() < 0.015) {
        const availableTiles = [];

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
    // Only spawn stars on level 4+ with 2% probability
    if (gameState.level >= 4 && Math.random() < 0.02) {
        const availableTiles = [];

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
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(
            bolt.x * gameState.gridSize + gameState.gridSize / 2,
            bolt.y * gameState.gridSize
        );
        ctx.lineTo(
            bolt.x * gameState.gridSize + gameState.gridSize / 4,
            bolt.y * gameState.gridSize + gameState.gridSize / 2
        );
        ctx.lineTo(
            bolt.x * gameState.gridSize + (gameState.gridSize * 3) / 4,
            bolt.y * gameState.gridSize + gameState.gridSize / 2
        );
        ctx.lineTo(
            bolt.x * gameState.gridSize + gameState.gridSize / 2,
            bolt.y * gameState.gridSize + gameState.gridSize
        );
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2;
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
    ctx.fillStyle = '#FFD700'; // Gold color for stars

    for (let i = 0; i < gameState.stars.length; i++) {
        const star = gameState.stars[i];
        const x = star.x * gridSize;
        const y = star.y * gridSize;

        // Draw five-pointed star
        ctx.beginPath();
        const centerX = x + gridSize / 2;
        const centerY = y + gridSize / 2;
        const outerRadius = gridSize / 3;
        const innerRadius = outerRadius / 2;

        for (let j = 0; j < 10; j++) {
            const radius = j % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / 5) * j - Math.PI / 2;
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

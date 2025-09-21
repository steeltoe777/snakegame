const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Group game state into a single object for easier management and testing
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

function update() {
    if (!gameState.gameRunning) return;

    updateSpatialGrid(); // Update spatial grid for accurate collision detection
    const head = { x: gameState.snake[0].x + gameState.dx, y: gameState.snake[0].y + gameState.dy };

    // Collision with outer walls
    if (
        head.x < 0 ||
        head.x >= gameState.tileCount ||
        head.y < 0 ||
        head.y >= gameState.tileCount
    ) {
        if (gameState.level < 1000) {
            // Only check for outer wall collisions on level below 1000
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
    if (gameState.maze[head.y][head.x] === 1) {
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
            gameOver();
            return;
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
            gameState.score += 10;
            document.getElementById('score').innerText = `Score: ${gameState.score}`;
            atePellet = true;
            // Update game speed based on increased snake length
            clearInterval(gameState.gameInterval);
            gameState.gameInterval = setInterval(update, calculateGameSpeed());
            break;
        }
    }

    if (!atePellet) {
        gameState.snake.pop(); // Only remove tail if no pellet was eaten
    }

    if (gameState.pellets.length === 0) {
        levelUp();
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPellets();
    drawTrail();
    drawSnake();
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
    const speed = baseSpeed + snakeLength * 2;

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

    // Apply the maximum speed limit
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

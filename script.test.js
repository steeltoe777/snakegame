
/* eslint-disable no-eval */
const fs = require('fs');
const path = require('path');

// Mock timers globally before any script evaluation
jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
jest.spyOn(global, 'clearInterval');
jest.spyOn(global, 'alert').mockImplementation(() => {}); // Mock alert to prevent blocking tests

let scriptContent;
let mockCtx;
let resetGameSpy; // Declare globally for access in beforeAll and afterAll
let originalResetGameImpl; // To store the original implementation of resetGame

// Setup for all tests: Load script once and mock canvas properties
beforeAll(() => {
    // Set up the DOM with the canvas element and other game elements first
    document.body.innerHTML = `
        <canvas id="gameCanvas" width="600" height="600"></canvas>
        <div id="score">Score: 0</div>
        <div id="level">Level: 1</div>
        <div id="gameOverOverlay" class="hidden">
            <div class="gameOverContent">
                <h2>Game Over!</h2>
                <p id="finalScore">Score: 0</p>
                <button id="restartButton">Press OK to restart</button>
            </div>
        </div>
    `;

    // Mock HTMLCanvasElement.prototype.getContext and its return value
    mockCtx = {
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        fillText: jest.fn(),
        measureText: jest.fn(() => ({ width: 100 })) // Mock measureText for completeness
    };

    // Ensure the mocked canvas has width and height properties *before* script evaluation
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: jest.fn(() => mockCtx),
        configurable: true,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
        value: 600, // Match canvas width from index.html
        configurable: true,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
        value: 600, // Match canvas height from index.html
        configurable: true,
    });

    // Load the game script first to define functions like resetGame
    const scriptPath = path.resolve(__dirname, 'script.js');
    scriptContent = fs.readFileSync(scriptPath, 'utf8');
    window.eval(scriptContent); // Evaluate the script ONLY ONCE here

    // Store original implementation before spying
    originalResetGameImpl = window.resetGame;

    // Spy on resetGame AFTER script.js is evaluated
    resetGameSpy = jest.spyOn(window, 'resetGame').mockImplementation(() => {
        // Call the original implementation when the spied function is invoked
        originalResetGameImpl.apply(window);
    });

    // Expose ctx and canvas from the mocked context for tests after initial eval
    window.ctx = mockCtx;
    window.canvas = document.getElementById('gameCanvas');

    // Explicitly ensure tileCount is set in gameState after script load
    if (window.gameState && window.canvas && window.gameState.gridSize > 0) {
        window.gameState.tileCount = window.canvas.width / window.gameState.gridSize;
    } else {
        window.gameState.tileCount = 20; // Fallback if canvas dimensions are not available
    }

    // Perform initial game setup by calling resetGame through the spy
    // This ensures the initial state is set up and the call is recorded.
    window.resetGame();

    // Run any timers set during initial script load (e.g., resetGame -> startGame)
    jest.runAllTimers();
});

afterAll(() => {
    // Restore the spy after all tests are done
    if (resetGameSpy) {
        resetGameSpy.mockRestore();
    }
});

// Helper to reset the DOM and game state for each test
function resetGameEnvironment() {
    // No need to clear/set innerHTML here, it's done once in beforeAll

    // Reset mocks for global functions that might have state (e.g., setInterval, alert)
    global.alert.mockClear();
    global.setInterval.mockClear();
    global.clearInterval.mockClear();

    // Clear the spy's call history for each test
    if (resetGameSpy) {
        resetGameSpy.mockClear();
    }

    // Call resetGame to ensure a clean game state for each test
    // Since resetGameSpy's mockImplementation calls the original, just calling window.resetGame()
    // will reset the state and record the call.
    window.resetGame();

    // Ensure overlay is hidden on reset
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    if (gameOverOverlay) {
        gameOverOverlay.classList.add('hidden');
    }
}

describe('Game Initialization', () => {
    beforeEach(() => {
        resetGameEnvironment();
    });

    test('canvas and context should be defined', () => {
        expect(window.canvas).toBeDefined();
        expect(window.ctx).toBeDefined();
    });

    test('initial snake length should be 1', () => {
        expect(window.gameState.snake.length).toBe(1);
    });

    test('initial score should be 0', () => {
        expect(window.gameState.score).toBe(0);
    });

    test('initial level should be 1', () => {
        expect(window.gameState.level).toBe(1);
    });

    test('game should not be running initially', () => {
        expect(window.gameState.gameRunning).toBe(false);
    });
});

describe('Level Progression', () => {
    beforeEach(() => {
        resetGameEnvironment();
        // Set initial state for testing levelUp
        window.gameState.score = 100;
        window.gameState.level = 1;
        window.gameState.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
        window.gameState.trail = [{ x: 3, y: 5 }];
        window.gameState.gameRunning = true;
        window.gameState.gameInterval = 123; // Simulate an active interval

        // Clear mocks before calling levelUp/resetGame to ensure fresh assertions
        global.setInterval.mockClear();
        global.clearInterval.mockClear();
    });

    test('levelUp should increment level, reset snake, clear trail, and set game to idle', () => {
        window.levelUp();

        expect(window.gameState.level).toBe(2);
        expect(window.gameState.snake).toEqual([{ x: 10, y: 10 }, { x: 9, y: 10 }]);
        expect(window.gameState.dx).toBe(0);
        expect(window.gameState.dy).toBe(0);
        expect(window.gameState.trail).toEqual([]);
        expect(global.clearInterval).toHaveBeenCalledWith(123); // Check if previous interval was cleared
        expect(window.gameState.gameRunning).toBe(false); // Game should be idle after levelUp
    });

    test('resetGame should reset all game state variables', () => {
        // Modify some state to ensure reset works
        window.gameState.score = 50;
        window.gameState.level = 2;
        window.gameState.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
        window.gameState.trail = [{ x: 3, y: 5 }];
        window.gameState.gameRunning = true;
        window.gameState.gameInterval = 456; // Simulate an active interval

        window.resetGame();

        expect(window.gameState.snake).toEqual([{ x: 10, y: 10 }]);
        expect(window.gameState.dx).toBe(0);
        expect(window.gameState.dy).toBe(0);
        expect(window.gameState.score).toBe(0);
        expect(window.gameState.level).toBe(1);
        expect(window.gameState.trail).toEqual([]);
        expect(global.clearInterval).toHaveBeenCalledWith(456);
        expect(window.gameState.gameRunning).toBe(false);
    });
});

describe('Dynamic Pellet Distribution', () => {
    let mathRandomSpy;

    beforeEach(() => {
        resetGameEnvironment();
        // Mock Math.random to ensure predictable pellet generation for testing
        const mockRandomValues = [
            0.5, // For first pellet
            0.5, // For second pellet
            ...Array(20).fill(0.5) // Fill with enough dummy values
        ];
        let callCount = 0;
        mathRandomSpy = jest.spyOn(global.Math, 'random').mockImplementation(() => mockRandomValues[callCount++] || 0.5);
    });

    afterEach(() => {
        if (mathRandomSpy) {
            mathRandomSpy.mockRestore(); // Restore original Math.random
        }
    });

    test('generatePellets should produce fewer pellets for lower levels (e.g., Level 1)', () => {
        window.gameState.level = 1;
        window.generatePellets();
        // The script now calculates maxPelletsForLevel = basePellets + (level - 1) * pelletsPerLevel;
        // For level 1: 5 + (1-1)*2 = 5
        expect(window.gameState.pellets.length).toBe(5);
    });

    test('generatePellets should produce more pellets for higher levels (e.g., Level 5)', () => {
        window.gameState.level = 5;
        window.generatePellets();
        // Expected: 5 + (5-1)*2 = 5 + 8 = 13 pellets
        expect(window.gameState.pellets.length).toBe(13);
    });

    test('generatePellets should ensure at least one pellet if available tiles exist', () => {
        // The tileCount will be 30 based on canvas width 600 and gridSize 20
        // Correctly create a 2D array with distinct inner arrays matching the expected tileCount
        window.gameState.maze = Array.from({ length: window.gameState.tileCount }, () => Array(window.gameState.tileCount).fill(1));
        window.gameState.maze[1][1] = 0; // Make one tile available
        window.gameState.pellets = []; // Ensure it starts empty
        window.generatePellets();
        expect(window.gameState.pellets.length).toBeGreaterThanOrEqual(1);
    });
});

describe('Dynamic Maze Generation', () => {
    let mathRandomSpy;

    beforeEach(() => {
        resetGameEnvironment();
        // Mock Math.random to ensure a wall is placed predictably for testing
        // For tileCount=30, (tileCount-2) = 28. Math.floor(Math.random() * 28) + 1
        // To place a wall at (5,5), we need random values that result in 5 for both x and y.
        // e.g., 5/28 = 0.178. So, if random returns 0.178, floor(0.178*28)+1 = 4+1 = 5.
        // Let's mock a sequence that guarantees a wall at (5,5) for level 4.
        const mockRandomValues = [
            0.178, 0.178, // For first wall at (5,5)
            // Add more values if more walls are expected or if the loop runs multiple times
            // For the 'attempts' loop, we need to provide enough values.
            // Let's provide a sequence that ensures at least one wall is placed.
            0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, // Dummy values for other attempts
            0.178, 0.178, // Another attempt to place a wall at (5,5) if first fails
            ...Array(200).fill(0.5) // Fill with enough dummy values for 'attempts'
        ];
        let callCount = 0;
        mathRandomSpy = jest.spyOn(global.Math, 'random').mockImplementation(() => mockRandomValues[callCount++] || 0.5);
    });

    afterEach(() => {
        if (mathRandomSpy) {
            mathRandomSpy.mockRestore(); // Restore original Math.random
        }
    });

    test('generateMaze should create only outer walls for lower levels (e.g., Level 1)', () => {
        window.gameState.level = 1;
        window.generateMaze();

        // Check outer walls
        for (let i = 0; i < window.gameState.tileCount; i++) {
            expect(window.gameState.maze[0][i]).toBe(1);
            expect(window.gameState.maze[window.gameState.tileCount - 1][i]).toBe(1);
            expect(window.gameState.maze[i][0]).toBe(1);
            expect(window.gameState.maze[i][window.gameState.tileCount - 1]).toBe(1);
        }

        // Check internal area (should be all 0s for level 1)
        for (let y = 1; y < window.gameState.tileCount - 1; y++) {
            for (let x = 1; x < window.gameState.tileCount - 1; x++) {
                expect(window.gameState.maze[y][x]).toBe(0);
            }
        }
    });

    test('generateMaze should introduce internal walls for higher levels (e.g., Level 4)', () => {
        window.gameState.level = 4;
        window.generateMaze();

        // Check outer walls (should still be there)
        for (let i = 0; i < window.gameState.tileCount; i++) {
            expect(window.gameState.maze[0][i]).toBe(1);
            expect(window.gameState.maze[window.gameState.tileCount - 1][i]).toBe(1);
            expect(window.gameState.maze[i][0]).toBe(1);
            expect(window.gameState.maze[i][window.gameState.tileCount - 1]).toBe(1);
        }

        // FIX: Check if internal walls exist (at least one 1 in the internal grid)
        let internalWallFound = false;
        for (let y = 1; y < window.gameState.tileCount - 1; y++) {
            for (let x = 1; x < window.gameState.tileCount - 1; x++) {
                if (window.gameState.maze[y][x] === 1) {
                    internalWallFound = true;
                    break;
                }
            }
            if (internalWallFound) break;
        }

        expect(internalWallFound).toBe(true);
    });
});

describe('Game Over Overlay', () => {
    beforeEach(() => {
        resetGameEnvironment();
        // Set up a scenario where gameOver is called
        window.gameState.score = 120;
        window.gameState.gameRunning = true;
        window.gameState.gameInterval = setInterval(() => {}, 100); // Mock interval
    });

    afterEach(() => {
        // Only clear if gameInterval is defined to prevent TypeError
        if (window.gameState.gameInterval) {
            clearInterval(window.gameState.gameInterval);
        }
    });

    test('gameOver should display the overlay with correct score and stop the game', () => {
        const gameOverOverlay = document.getElementById('gameOverOverlay');
        const finalScoreDisplay = document.getElementById('finalScore');

        expect(gameOverOverlay.classList.contains('hidden')).toBe(true); // Initially hidden
        expect(window.gameState.gameRunning).toBe(true); // Game running before gameOver

        window.gameOver();

        expect(gameOverOverlay.classList.contains('hidden')).toBe(false); // Overlay should be visible
        expect(finalScoreDisplay.innerText).toBe('Score: 120'); // Score should be updated
        expect(window.gameState.gameRunning).toBe(false); // Game should be stopped
        expect(clearInterval).toHaveBeenCalledWith(window.gameState.gameInterval); // Interval should be cleared
    });

    test('restart button should call resetGame and hide the overlay', () => {
        const gameOverOverlay = document.getElementById('gameOverOverlay');
        const restartButton = document.getElementById('restartButton');

        // Simulate game over state
        window.gameOver();
        expect(gameOverOverlay.classList.contains('hidden')).toBe(false);

        // Click the restart button
        restartButton.click();

        expect(resetGameSpy).toHaveBeenCalled(); // resetGame should be called
        expect(gameOverOverlay.classList.contains('hidden')).toBe(true); // Overlay should be hidden
    });
});


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Group game state into a single object for easier management and testing
const gameState = {
gridSize: 20, // Define gridSize here
tileCount: 0, // Will be calculated in resetGame/levelUp based on canvas dimensions
snake: [{ x: 10, y: 10 }],
dx: 0,
dy: 0,
score: 0,
level: 1,
gameRunning: false,
gameInterval: null,
maze: [],
pellets: [],
trail: []
};

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
gameState.maze = Array(gameState.tileCount).fill(0).map(() => Array(gameState.tileCount).fill(0));

// Create outer walls to define the game area
for (let i = 0; i < gameState.tileCount; i++) {
gameState.maze[0][i] = 1; // Top wall
gameState.maze[gameState.tileCount - 1][i] = 1; // Bottom wall
gameState.maze[i][0] = 1; // Left wall
gameState.maze[i][gameState.tileCount - 1] = 1; // Right wall
}

// Dynamic internal maze generation based on level
if (gameState.level >= 4) {
const numInternalWalls = Math.min(5, gameState.level - 3); // More walls for higher levels, max 5
for (let k = 0; k < numInternalWalls; k++) {
let placed = false;
let attempts = 0;
while (!placed && attempts < 100) { // Limit attempts to prevent infinite loops
const wallX = Math.floor(Math.random() * (gameState.tileCount - 2)) + 1; // Avoid outer walls
const wallY = Math.floor(Math.random() * (gameState.tileCount - 2)) + 1;
const wallLength = Math.floor(Math.random() * 3) + 2; // Wall length 2-4
const isHorizontal = Math.random() > 0.5;

let canPlace = true;
const wallSegments = [];

for (let i = 0; i < wallLength; i++) {
const segmentX = isHorizontal ? wallX + i : wallX;
const segmentY = isHorizontal ? wallY : wallY + i;

// Check boundaries and existing walls (FIXED: segmentX < 1 and segmentY < 1)
if (segmentX < 1 || segmentX >= gameState.tileCount - 1 || segmentY < 1 || segmentY >= gameState.tileCount - 1 || gameState.maze[segmentY][segmentX] === 1) {
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
wallSegments.forEach(segment => {
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
const basePellets = 5; // Minimum pellets for level 1
const pelletsPerLevel = 2; // How many pellets increase per level
const maxPelletsForLevel = basePellets + (gameState.level - 1) * pelletsPerLevel;

const availableTiles = [];
for (let y = 0; y < gameState.tileCount; y++) {
for (let x = 0; x < gameState.tileCount; x++) {
// Place pellets only on path squares (maze[y][x] === 0)
// and not on the initial snake position
if (gameState.maze[y][x] === 0 && !(x === gameState.snake[0].x && y === gameState.snake[0].y)) {
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
ctx.fillRect(x * gameState.gridSize, y * gameState.gridSize, gameState.gridSize, gameState.gridSize);
}
}
}
}

function drawPellets() {
gameState.pellets.forEach(p => {
ctx.fillStyle = 'yellow';
ctx.beginPath();
ctx.arc(p.x * gameState.gridSize + gameState.gridSize / 2, p.y * gameState.gridSize + gameState.gridSize / 2, gameState.gridSize / 3, 0, Math.PI * 2);
ctx.fill();
});
}

function drawSnake() {
gameState.snake.forEach(segment => {
ctx.fillStyle = 'lime';
ctx.fillRect(segment.x * gameState.gridSize, segment.y * gameState.gridSize, gameState.gridSize, gameState.gridSize);
});
}

function drawTrail() {
ctx.fillStyle = 'blue';
gameState.trail.forEach(segment => {
ctx.fillRect(segment.x * gameState.gridSize, segment.y * gameState.gridSize, gameState.gridSize, gameState.gridSize);
});
}

function update() {
if (!gameState.gameRunning) return;

const head = { x: gameState.snake[0].x + gameState.dx, y: gameState.snake[0].y + gameState.dy };

// Collision with walls (maze)
if (head.x < 0 || head.x >= gameState.tileCount || head.y < 0 || head.y >= gameState.tileCount || gameState.maze[head.y][head.x] === 1) {
gameOver();
return;
}

// Collision with self
for (let i = 1; i < gameState.snake.length; i++) {
if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
gameOver();
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
document.getElementById('score').innerText = `Score: ${  gameState.score}`;
atePellet = true;
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
// Preserve new level/score after reset
resetGame();
gameState.level = level - 1;
gameState.score = Math.floor(score / 2);

// Add extra pellets for half the lost score
for (let i = 0; i < Math.floor(gameState.score / 2); i++) {
generatePellets();
}

// Update UI elements to reflect new level and score
document.getElementById('score').innerText = `Score: ${gameState.score}`;
document.getElementById('level').innerText = `Level: ${gameState.level}`;
startGame(); // Start game loop after respawn (automatically sets gameRunning = true)
  } else {
    // Keep overlay visible and game state stopped
    gameState.gameRunning = false;
  }
}

function levelUp() {
gameState.level++;
document.getElementById('level').innerText = `Level: ${  gameState.level}`;
gameState.snake = Array.from({length: gameState.snake.length}, () => ({x: 10, y: 10}));
gameState.dx = 0;
gameState.dy = 0;
gameState.trail = [];
// Crucial fix: Stop the current game interval and set gameRunning to false
clearInterval(gameState.gameInterval);
gameState.gameInterval = null; // Ensure interval ID is cleared
gameState.gameRunning = false;

calculateTileCount(); // Recalculate tileCount based on current canvas dimensions
generateMaze(); // Regenerate maze for new level (can be more complex later)
generatePellets();
drawGame(); // Draw initial state for the new level
// REMOVED: startGame(); // Game should not start automatically after levelUp
}

function resetGame() {
// FIX: Clear any existing game interval when resetting the game
if (gameState.gameInterval) {
clearInterval(gameState.gameInterval);
gameState.gameInterval = null; // Clear the interval ID
}
gameState.snake = [
{ x: 10, y: 10 }
];
gameState.dx = 0;
gameState.dy = 0;
gameState.score = 0;
gameState.level = 1;
gameState.trail = [];
document.getElementById('score').innerText = `Score: ${  gameState.score}`;
document.getElementById('level').innerText = `Level: ${  gameState.level}`;

calculateTileCount(); // Recalculate tileCount based on current canvas dimensions
generateMaze();
generatePellets();
drawGame(); // Draw initial state
gameState.gameRunning = false;
gameOverOverlay.classList.add('hidden'); // Hide overlay on reset
  
  // Re-enable keyboard controls
  document.removeEventListener('keydown', handleDirectionChange);
  document.addEventListener('keydown', handleDirectionChange);
}

function handleDirectionChange(e) {
if (!gameState.gameRunning && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
startGame();
}

switch (e.key) {
case 'ArrowUp':
if (gameState.dy === 0) { gameState.dx = 0; gameState.dy = -1; }
break;
case 'ArrowDown':
if (gameState.dy === 0) { gameState.dx = 0; gameState.dy = 1; }
break;
case 'ArrowLeft':
if (gameState.dx === 0) { gameState.dx = -1; gameState.dy = 0; }
break;
case 'ArrowRight':
if (gameState.dx === 0) { gameState.dx = 1; gameState.dy = 0; }
break;
default:
break;
}
}

document.addEventListener('keydown', handleDirectionChange);

restartButton.addEventListener('click', resetGame);

function startGame() {
if (gameState.gameRunning) return;
gameState.gameRunning = true;
gameState.gameInterval = setInterval(update, 150); // Game speed
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

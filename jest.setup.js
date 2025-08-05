
// Polyfill TextEncoder/TextDecoder at the very top to ensure they are available for JSDOM's dependencies
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

// Set up a global JSDOM instance once
const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <body>
        <canvas id="gameCanvas" width="400" height="400"></canvas>
        <div id="score">Score: 0</div>
        <div id="level">Level: 1</div>
    </body>
    </html>
`, { runScripts: 'dangerously', resources: 'usable' });

global.window = dom.window;
global.document = dom.window.document;

// Mock the Canvas API globally for all HTMLCanvasElement instances
global.window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    // Add any other canvas context methods/properties used in script.js
    font: '',
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
    set strokeStyle(value) {},
    set fillStyle(value) {},
    set lineWidth(value) {},
    set lineCap(value) {},
    set lineJoin(value) {},
    set miterLimit(value) {},
    set globalAlpha(value) {},
    set globalCompositeOperation(value) {},
    set imageSmoothingEnabled(value) {},
    set imageSmoothingQuality(value) {},
    set shadowOffsetX(value) {},
    set shadowOffsetY(value) {},
    set shadowBlur(value) {},
    set shadowColor(value) {},
    set filter(value) {},
    set direction(value) {},
    set textAlign(value) {},
    set textBaseline(value) {},
    set lineDashOffset(value) {},
    set currentTransform(value) {},
    set canvas(value) {},
}));

// Mock global functions that interact with the browser environment
global.clearInterval = jest.fn();
global.setInterval = jest.fn(() => 123); // Mock setInterval to return an ID
global.alert = jest.fn(); // Mock alert

// Ensure document.getElementById returns the correct mocked elements
const originalGetElementById = global.document.getElementById;
global.document.getElementById = jest.fn((id) => {
    if (id === 'gameCanvas') {
        // Return the actual canvas element from the JSDOM instance, which will use our mocked getContext
        return originalGetElementById.call(global.document, id);
    }
    // For other elements like score/level divs, return the actual div from the JSDOM instance
    return originalGetElementById.call(global.document, id);
});

// Expose the JSDOM instance's window and document for tests to use
// This is already done by global.window = dom.window; and global.document = dom.window.document;
// No need to re-expose them in script.test.js

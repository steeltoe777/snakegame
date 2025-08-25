
// jest.setup.js
// Explicit and simple mock for browser environment in Jest tests

// Create a mock canvas element
const mockCanvasElement = {
  getContext: jest.fn(() => ({
    // Mock common canvas context methods
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    closePath: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 100, height: 20 })),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  })),
  width: 600,
  height: 600,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock the global document object
global.document = {
  getElementById: jest.fn(id => {
    if (id === 'gameCanvas') {
      return mockCanvasElement;
    }
    return null; // For any other ID, return null
  }),
  // Add other document properties/methods if script.js uses them
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    style: {},
  },
  createElement: jest.fn(tagName => {
    if (tagName === 'canvas') return mockCanvasElement;
    return {};
  }),
};

// Mock the global window object
global.window = {
  requestAnimationFrame: jest.fn(cb => setTimeout(cb, 0)),
  cancelAnimationFrame: jest.fn(id => clearTimeout(id)),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  innerWidth: 1024,
  innerHeight: 768,
};

// Mock alert, confirm, prompt if script.js uses them
global.alert = jest.fn();
global.confirm = jest.fn();
global.prompt = jest.fn();

// Ensure console is available if script.js uses it (Jest usually handles this)
// global.console = console;

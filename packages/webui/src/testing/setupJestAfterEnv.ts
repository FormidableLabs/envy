import '@testing-library/jest-dom';

// The "allotment" package uses ResizeObserver, which is not available in JSDOM.
window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

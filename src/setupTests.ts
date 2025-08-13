import "@testing-library/jest-dom";
import { vi } from "vitest";

// jsdom doesn't implement matchMedia. Provide a minimal stub so components that
// query it (e.g. for prefers-reduced-motion) don't crash during tests.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});


import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

// Add custom jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
	cleanup();
});

// Mock fetch for testing
global.fetch = vi.fn();

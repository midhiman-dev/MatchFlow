import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Firebase imports so UI tests don't error out on network requests
vi.mock('./lib/firebase', () => ({
  authenticateFan: vi.fn().mockResolvedValue({ uid: 'mock-test-user' }),
  trackEvent: vi.fn(),
  database: {},
  app: {},
  auth: {},
  storage: {},
  analytics: {}
}));

describe('App Root Component', () => {
  it('renders the role switcher by default', () => {
    // Suppress console.warn during test for clean output if valid UI elements are missing
    const originalWarn = console.warn;
    console.warn = vi.fn();

    render(<App />);
    
    // Just check if rendering completes without crashing.
    // We target the default role context that gets rendered on Mount.
    expect(screen.getByText(/Steward/i)).toBeInTheDocument();
    expect(screen.getByText(/Operator/i)).toBeInTheDocument();

    console.warn = originalWarn;
  });
});

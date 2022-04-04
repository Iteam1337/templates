import { describe, expect, it } from 'vitest';

import App from './App.jsx';
import { render, screen } from './test/test.utils.js';

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<App />);
    expect(screen.getByText('Hello Iteam + React!')).toBeInTheDocument();
  });
});

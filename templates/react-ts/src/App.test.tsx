import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';
import { render } from './test/test.utils';

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<App />);
    expect(
      screen.getByText(/Hello Iteam \+ React \+ Typescript!/i)
    ).toBeInTheDocument();
  });
});

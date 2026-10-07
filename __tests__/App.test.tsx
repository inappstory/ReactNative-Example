import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

describe('App Root Smoke Test', () => {
  it('renders root app without throwing errors', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });
    expect(renderer).not.toBeNull();
  });
});

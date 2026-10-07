import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { BannersExample } from '../src/examples/banners/BannersExample';

describe('BannersExample Smoke & Render Test', () => {
  it('renders correctly', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <NavigationContainer>
          <BannersExample />
        </NavigationContainer>
      );
    });
    expect(renderer).not.toBeNull();
    const tree = renderer!.toJSON();
    expect(tree).toBeDefined();
  });
});

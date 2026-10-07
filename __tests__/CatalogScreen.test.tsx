import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { CatalogScreen } from '../src/examples/CatalogScreen';
import { EXAMPLES_REGISTRY } from '../src/examples/registry';

describe('CatalogScreen Smoke & Render Test', () => {
  it('renders available examples in the catalog', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <NavigationContainer>
          <CatalogScreen />
        </NavigationContainer>
      );
    });

    expect(renderer).not.toBeNull();
    const tree = renderer!.toJSON();
    expect(tree).toBeDefined();

    // Verify available example buttons exist by testID
    const root = renderer!.root;
    for (const example of EXAMPLES_REGISTRY) {
      const card = root.findByProps({ testID: `example-card-${example.id}` });
      expect(card).toBeDefined();
    }
  });
});

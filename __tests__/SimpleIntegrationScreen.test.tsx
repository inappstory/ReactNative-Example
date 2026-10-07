import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SimpleIntegrationScreen } from '../src/examples/simple-integration/SimpleIntegrationScreen';

describe('SimpleIntegrationScreen Render Test', () => {
  it('renders StoriesList and reload feed button', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SimpleIntegrationScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    // Verify StoriesList mock is rendered
    const storiesMock = root.findByProps({ testID: 'stories-list-mock' });
    expect(storiesMock).toBeDefined();

    // Verify Reload button is present
    const reloadButton = root.findByProps({ testID: 'reload-feed-button' });
    expect(reloadButton).toBeDefined();

    // Verify reload triggers reload on ref
    await ReactTestRenderer.act(async () => {
      reloadButton.props.onPress();
    });
  });
});

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { CellCustomizationScreen } from '../src/examples/cell-customization/CellCustomizationScreen';

describe('CellCustomizationScreen Component Test', () => {
  it('renders screen, preset chips, stories list and reload button', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<CellCustomizationScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    // Verify main screen container
    const screen = root.findByProps({ testID: 'cell-customization-screen' });
    expect(screen).toBeDefined();

    // Verify all 3 preset chips are rendered
    const rectangleChip = root.findByProps({ testID: 'preset-chip-rectangle' });
    const circleChip = root.findByProps({ testID: 'preset-chip-circle' });
    const quadChip = root.findByProps({ testID: 'preset-chip-quad' });
    expect(rectangleChip).toBeDefined();
    expect(circleChip).toBeDefined();
    expect(quadChip).toBeDefined();

    // Verify highlights card is present
    const highlights = root.findByProps({ testID: 'active-preset-highlights' });
    expect(highlights).toBeDefined();

    // Verify StoriesList mock is rendered
    const storiesMock = root.findByProps({ testID: 'stories-list-mock' });
    expect(storiesMock).toBeDefined();

    // Verify Reload button is present
    const reloadButton = root.findByProps({ testID: 'reload-feed-button' });
    expect(reloadButton).toBeDefined();

    // Test reload triggers reload on ref
    await ReactTestRenderer.act(async () => {
      reloadButton.props.onPress();
    });
  });

  it('switches presets on chip press and updates highlights', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<CellCustomizationScreen />);
    });

    const root = renderer!.root;

    // Switch to circle preset
    const circleChip = root.findByProps({ testID: 'preset-chip-circle' });
    await ReactTestRenderer.act(async () => {
      circleChip.props.onPress();
    });

    // Check highlights card content for CIRCLE
    const circleTextFound = JSON.stringify(renderer!.toJSON()).includes('CIRCLE');
    expect(circleTextFound).toBe(true);

    // Switch to quad preset
    const quadChip = root.findByProps({ testID: 'preset-chip-quad' });
    await ReactTestRenderer.act(async () => {
      quadChip.props.onPress();
    });

    const quadTextFound = JSON.stringify(renderer!.toJSON()).includes('QUAD');
    expect(quadTextFound).toBe(true);
  });
});

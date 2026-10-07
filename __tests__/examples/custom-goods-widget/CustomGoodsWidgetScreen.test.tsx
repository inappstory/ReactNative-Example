import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { CustomGoodsWidgetScreen } from '../../../src/examples/custom-goods-widget/CustomGoodsWidgetScreen';

describe('CustomGoodsWidgetScreen Smoke & Render Test', () => {
  it('renders correctly', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<CustomGoodsWidgetScreen />);
    });
    expect(renderer).not.toBeNull();
  });
});

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { FavoritesFeedScreen } from '../src/examples/favorites/FavoritesFeedScreen';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: mockGoBack,
    }),
  };
});

describe('FavoritesFeedScreen Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders screen container and favorites-only StoriesList', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesFeedScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    expect(root.findByProps({ testID: 'favorites-feed-screen' })).toBeDefined();
    expect(root.findByProps({ testID: 'favorites-only-feed' })).toBeDefined();
  });

  it('navigates back when back button is pressed', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesFeedScreen />);
    });

    const root = renderer!.root;
    const backBtn = root.findByProps({ testID: 'favorites-feed-back-button' });

    await ReactTestRenderer.act(async () => {
      backBtn.props.onPress();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

});

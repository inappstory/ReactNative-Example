import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { GamesScreen } from '../../../src/examples/games/GamesScreen';
import { StoryManager } from '@inappstory/react-native-sdk';
import { DEMO_GAME_ID } from '../../../src/examples/registry';

// Create a single stable mock instance
const mockInstance = {
  showGame: jest.fn(),
  preloadGames: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  off: jest.fn(),
};

// Mock StoryManager
jest.mock('@inappstory/react-native-sdk', () => ({
  StoryManager: {
    getInstance: jest.fn(() => mockInstance),
  },
  CTASource: {
    GAME_READER: 2,
  },
}));

describe('GamesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and triggers showGame when button is pressed', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<GamesScreen />);
    });
    
    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    // Trigger showGame
    const showGameButton = root.findByProps({ testID: 'open-game-button' });
    expect(showGameButton).toBeDefined();
    
    await ReactTestRenderer.act(async () => {
      showGameButton.props.onPress();
    });
    
    expect(mockInstance.showGame).toHaveBeenCalledWith(DEMO_GAME_ID);
  });

  it('handles Game CTA events correctly', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<GamesScreen />);
    });

    const root = renderer!.root;

    // Trigger the callback directly from the mock
    const clickHandler = (mockInstance as any).storyLinkClickHandler;
    expect(clickHandler).toBeDefined();

    await ReactTestRenderer.act(async () => {
      if (clickHandler) {
        clickHandler({
          url: 'https://example.com/promo',
          src: 2, // CTASource.GAME_READER
          gameInstanceId: 'game-123',
        });
      }
    });

    // Verify UI updated
    const logTexts = root.findAllByProps({ className: 'logText' }).concat(
      root.findAll(node => node.props.children?.includes?.('https://example.com/promo'))
    );
    expect(logTexts.length).toBeGreaterThan(0);
  });

  it('handles Preload Games correctly', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<GamesScreen />);
    });
    
    const root = renderer!.root;
    
    const preloadButton = root.findByProps({ testID: 'preload-button' });
    
    await ReactTestRenderer.act(async () => {
      preloadButton.props.onPress();
    });
    
    expect(mockInstance.preloadGames).toHaveBeenCalled();
  });

  it('subscribes to and displays Game Events', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<GamesScreen />);
    });

    // Trigger game event via the registered callback
    const onCall = mockInstance.on.mock.calls.find(call => call[0] === 'gameEvent');
    expect(onCall).toBeDefined();

    const gameEventCallback = onCall[1];
    await ReactTestRenderer.act(async () => {
      gameEventCallback({
        body: {
          id: 'start-123',
          gameID: 'demo-game',
          name: 'startGame',
        }
      });
    });

    const root = renderer!.root;
    const logNodes = root.findAll(node => 
      Array.isArray(node.props.children) && node.props.children.join('').includes('startGame')
    );
    expect(logNodes.length).toBeGreaterThan(0);
  });
});

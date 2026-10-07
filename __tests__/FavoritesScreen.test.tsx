import React from 'react';
import { Alert } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { FavoritesScreen } from '../src/examples/favorites/FavoritesScreen';
import { StoryService } from '../src/sdk';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  };
});

describe('FavoritesScreen Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all key sections and elements', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    // Verify main screen container
    expect(root.findByProps({ testID: 'favorites-screen' })).toBeDefined();

    // Verify Main Feed
    expect(root.findByProps({ testID: 'favorites-main-feed' })).toBeDefined();

    // Verify Count section
    expect(root.findByProps({ testID: 'favorites-count-section' })).toBeDefined();
    const countValue = root.findByProps({ testID: 'favorites-count-value' });
    expect(countValue.props.children).toBe('Current favorites: 3');

    // Verify Buttons
    expect(root.findByProps({ testID: 'refresh-count-button' })).toBeDefined();
    expect(root.findByProps({ testID: 'open-favorites-feed-button' })).toBeDefined();
    expect(root.findByProps({ testID: 'remove-story-id-input' })).toBeDefined();
    expect(root.findByProps({ testID: 'remove-one-favorite-button' })).toBeDefined();
    expect(root.findByProps({ testID: 'remove-all-favorites-button' })).toBeDefined();

    // Verify Custom cell toggle
    expect(root.findByProps({ testID: 'custom-favorite-cell-toggle' })).toBeDefined();

    // Verify Events box
    expect(root.findByProps({ testID: 'favorites-last-event-box' })).toBeDefined();
  });

  it('refreshes favorites count when Refresh button is pressed', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const countSpy = jest.spyOn(manager, 'favoritesCount').mockResolvedValueOnce(5);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    const root = renderer!.root;
    const refreshButton = root.findByProps({ testID: 'refresh-count-button' });

    await ReactTestRenderer.act(async () => {
      refreshButton.props.onPress();
    });

    expect(countSpy).toHaveBeenCalled();
  });

  it('navigates to FavoritesFeed when Open Favorites Feed button is pressed', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    const root = renderer!.root;
    const openFeedButton = root.findByProps({ testID: 'open-favorites-feed-button' });

    await ReactTestRenderer.act(async () => {
      openFeedButton.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('FavoritesFeed');
  });

  it('registers onFavoriteCell and navigates to FavoritesFeed when callback is triggered', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    let cellListener: (() => void) | null = null;
    jest.spyOn(manager, 'onFavoriteCell').mockImplementation((fn: any) => {
      cellListener = fn;
    });

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<FavoritesScreen />);
    });

    expect(cellListener).toBeDefined();
    expect(typeof cellListener).toBe('function');

    // Simulate favorite cell tap in SDK
    await ReactTestRenderer.act(async () => {
      cellListener!();
    });

    expect(mockNavigate).toHaveBeenCalledWith('FavoritesFeed');
  });

  it('removes a single story when Remove from Favorites is pressed', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const removeSpy = jest.spyOn(manager, 'removeFromFavorite');
    const countSpy = jest.spyOn(manager, 'favoritesCount').mockResolvedValue(2);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    const root = renderer!.root;
    const removeButton = root.findByProps({ testID: 'remove-one-favorite-button' });

    await ReactTestRenderer.act(async () => {
      removeButton.props.onPress();
    });

    expect(removeSpy).toHaveBeenCalledWith('demo_story_1');
    expect(countSpy).toHaveBeenCalled();

    const feedback = root.findByProps({ testID: 'favorites-mutation-feedback' });
    expect(feedback.props.children).toContain('removed from favorites');
  });

  it('shows confirmation alert and removes all favorites when confirmed', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const removeAllSpy = jest.spyOn(manager, 'removeAllFavorites');
    const alertSpy = jest.spyOn(Alert, 'alert');

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    const root = renderer!.root;
    const removeAllButton = root.findByProps({ testID: 'remove-all-favorites-button' });

    await ReactTestRenderer.act(async () => {
      removeAllButton.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Remove All Favorites',
      expect.any(String),
      expect.any(Array)
    );

    // Extract the destructive button handler from the Alert call
    const buttons = alertSpy.mock.calls[0][2] as any[];
    const destructiveAction = buttons.find((b) => b.style === 'destructive');
    expect(destructiveAction).toBeDefined();

    await ReactTestRenderer.act(async () => {
      await destructiveAction.onPress();
    });

    expect(removeAllSpy).toHaveBeenCalledTimes(1);
    const feedback = root.findByProps({ testID: 'favorites-mutation-feedback' });
    expect(feedback.props.children).toContain('All favorites have been removed');
  });

  it('subscribes to onFavoriteStory and displays last event info', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    let eventListener: ((e: any) => void) | null = null;
    jest.spyOn(manager, 'onFavoriteStory').mockImplementation((fn: any) => {
      eventListener = fn;
    });

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    expect(eventListener).toBeDefined();

    // Trigger favorite event from reader
    await ReactTestRenderer.act(async () => {
      eventListener!({
        body: {
          id: 'test_story_77',
          value: true,
          feed: 'promo_feed',
        },
      });
    });

    const root = renderer!.root;
    const eventText = root.findByProps({ testID: 'favorites-last-event-text' });
    const renderedText = Array.isArray(eventText.props.children)
      ? eventText.props.children.join('')
      : String(eventText.props.children);
    expect(renderedText).toContain('Story ID: test_story_77');
    expect(renderedText).toContain('Favorite: true');
    expect(renderedText).toContain('Feed: promo_feed');
  });

  it('toggles Custom Favorite Cell on and off', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    const root = renderer!.root;
    const toggleButton = root.findByProps({ testID: 'custom-favorite-cell-toggle' });

    // Initially custom cell is off
    expect(root.findAllByProps({ testID: 'custom-favorite-cell-card' })).toHaveLength(0);

    // Toggle on
    await ReactTestRenderer.act(async () => {
      toggleButton.props.onPress();
    });

    expect(root.findAllByProps({ testID: 'custom-favorite-cell-card' }).length).toBeGreaterThan(0);

    // Toggle off
    await ReactTestRenderer.act(async () => {
      toggleButton.props.onPress();
    });

    expect(root.findAllByProps({ testID: 'custom-favorite-cell-card' })).toHaveLength(0);
  });


  it('handles favoritesCount error gracefully without crashing', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'favoritesCount').mockRejectedValueOnce(new Error('Network error'));

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<FavoritesScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;
    expect(root.findByProps({ testID: 'favorites-screen' })).toBeDefined();
  });
});

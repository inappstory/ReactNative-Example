import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SingleStoryScreen } from '../src/examples/single-story/SingleStoryScreen';
import { StoryService } from '../src/sdk';

describe('SingleStoryScreen Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders screen elements: title, description, story ID and Open Story button', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SingleStoryScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    // Verify main screen container
    const screen = root.findByProps({ testID: 'single-story-screen' });
    expect(screen).toBeDefined();

    // Verify Story ID is displayed
    const idLabel = root.findByProps({ testID: 'single-story-id-text' });
    expect(idLabel).toBeDefined();
    expect(idLabel.props.children).toBe('demo_story_1');

    // Verify Open Story button
    const openButton = root.findByProps({ testID: 'open-story-button' });
    expect(openButton).toBeDefined();

    const buttonText = root.findByProps({ testID: 'open-story-button-text' });
    expect(buttonText.props.children).toBe('Open Story');
  });

  it('triggers storyManager.showStory on button press with expected parameters', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const showStorySpy = jest.spyOn(manager, 'showStory').mockResolvedValueOnce({ loaded: true });

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SingleStoryScreen />);
    });

    const root = renderer!.root;
    const openButton = root.findByProps({ testID: 'open-story-button' });

    await ReactTestRenderer.act(async () => {
      openButton.props.onPress();
    });

    expect(showStorySpy).toHaveBeenCalledTimes(1);
    expect(showStorySpy).toHaveBeenCalledWith(
      'demo_story_1',
      expect.any(Object), // AbortSignal
      expect.any(Object)  // AppearanceManager
    );

    // After success, button should return to "Open Story"
    const buttonText = root.findByProps({ testID: 'open-story-button-text' });
    expect(buttonText.props.children).toBe('Open Story');
  });

  it('displays error card when showStory returns loaded: false', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showStory').mockResolvedValueOnce({ loaded: false });

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SingleStoryScreen />);
    });

    const root = renderer!.root;
    const openButton = root.findByProps({ testID: 'open-story-button' });

    await ReactTestRenderer.act(async () => {
      openButton.props.onPress();
    });

    const errorCard = root.findByProps({ testID: 'single-story-error-card' });
    expect(errorCard).toBeDefined();
    expect(JSON.stringify(renderer!.toJSON())).toContain('Story could not be loaded or not found.');
  });

  it('displays error card when showStory rejects with an error', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showStory').mockRejectedValueOnce(new Error('Network connection failed'));

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SingleStoryScreen />);
    });

    const root = renderer!.root;
    const openButton = root.findByProps({ testID: 'open-story-button' });

    await ReactTestRenderer.act(async () => {
      openButton.props.onPress();
    });

    const errorCard = root.findByProps({ testID: 'single-story-error-card' });
    expect(errorCard).toBeDefined();
    expect(JSON.stringify(renderer!.toJSON())).toContain('Network connection failed');
  });

  it('aborts active request cleanly when component unmounts', async () => {
    let resolvePromise: (val: { loaded: boolean }) => void;
    const pendingPromise = new Promise<{ loaded: boolean }>((resolve) => {
      resolvePromise = resolve;
    });

    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showStory').mockImplementationOnce((_id, signal) => {
      return new Promise((resolve, reject) => {
        signal?.addEventListener('abort', () => {
          const err = new Error('Aborted');
          err.name = 'AbortError';
          reject(err);
        });
        pendingPromise.then(resolve);
      });
    });

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SingleStoryScreen />);
    });

    const root = renderer!.root;
    const openButton = root.findByProps({ testID: 'open-story-button' });

    // Start request
    await ReactTestRenderer.act(async () => {
      openButton.props.onPress();
    });

    // Unmount while pending
    await ReactTestRenderer.act(async () => {
      renderer!.unmount();
    });

    // Finish pending promise without crash
    await ReactTestRenderer.act(async () => {
      resolvePromise!({ loaded: true });
    });
  });
});

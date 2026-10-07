import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { OnboardingScreen } from '../src/examples/onboarding/OnboardingScreen';
import { StoryService } from '../src/sdk';

describe('OnboardingScreen Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders screen elements: title, description, feed name, user ID and Show Onboardings button', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<OnboardingScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    // Verify main screen container
    const screen = root.findByProps({ testID: 'onboarding-screen' });
    expect(screen).toBeDefined();

    // Verify feed and user labels
    const feedLabel = root.findByProps({ testID: 'onboarding-feed-text' });
    expect(feedLabel).toBeDefined();
    expect(feedLabel.props.children).toBe('onboarding');

    const userLabel = root.findByProps({ testID: 'onboarding-user-text' });
    expect(userLabel).toBeDefined();
    expect(userLabel.props.children).toBe('demo_user');

    // Verify action button
    const actionButton = root.findByProps({ testID: 'show-onboardings-button' });
    expect(actionButton).toBeDefined();

    const buttonText = root.findByProps({ testID: 'show-onboardings-button-text' });
    expect(buttonText.props.children).toBe('Show Onboardings');
  });

  it('triggers storyManager.showOnboardings on button press and displays opened status on true', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const showOnboardingsSpy = jest.spyOn(manager, 'showOnboardings').mockResolvedValueOnce(true);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<OnboardingScreen />);
    });

    const root = renderer!.root;
    const actionButton = root.findByProps({ testID: 'show-onboardings-button' });

    await ReactTestRenderer.act(async () => {
      actionButton.props.onPress();
    });

    expect(showOnboardingsSpy).toHaveBeenCalledTimes(1);
    expect(showOnboardingsSpy).toHaveBeenCalledWith(
      'onboarding',
      1000,
      ['showcase', 'react-native'],
      expect.any(Object) // AbortSignal
    );

    // Verify opened status card
    const openedStatus = root.findByProps({ testID: 'onboarding-opened-status' });
    expect(openedStatus).toBeDefined();
    expect(JSON.stringify(renderer!.toJSON())).toContain('Onboarding flow opened');
  });

  it('displays info box when showOnboardings returns false (no unseen stories)', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showOnboardings').mockResolvedValueOnce(false);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<OnboardingScreen />);
    });

    const root = renderer!.root;
    const actionButton = root.findByProps({ testID: 'show-onboardings-button' });

    await ReactTestRenderer.act(async () => {
      actionButton.props.onPress();
    });

    const noUnseenStatus = root.findByProps({ testID: 'onboarding-no-unseen-status' });
    expect(noUnseenStatus).toBeDefined();
    expect(JSON.stringify(renderer!.toJSON())).toContain('No unseen onboarding stories');
  });

  it('displays error card when showOnboardings rejects with an error', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showOnboardings').mockRejectedValueOnce(new Error('Network request failed'));

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<OnboardingScreen />);
    });

    const root = renderer!.root;
    const actionButton = root.findByProps({ testID: 'show-onboardings-button' });

    await ReactTestRenderer.act(async () => {
      actionButton.props.onPress();
    });

    const errorCard = root.findByProps({ testID: 'onboarding-error-card' });
    expect(errorCard).toBeDefined();
    expect(JSON.stringify(renderer!.toJSON())).toContain('Network request failed');
  });

  it('aborts active request cleanly when component unmounts', async () => {
    let resolvePromise: (val: boolean) => void;
    const pendingPromise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });

    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showOnboardings').mockImplementationOnce((_feed, _limit, _tags, signal) => {
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
      renderer = ReactTestRenderer.create(<OnboardingScreen />);
    });

    const root = renderer!.root;
    const actionButton = root.findByProps({ testID: 'show-onboardings-button' });

    // Start request
    await ReactTestRenderer.act(async () => {
      actionButton.props.onPress();
    });

    // Unmount while pending
    await ReactTestRenderer.act(async () => {
      renderer!.unmount();
    });

    // Finish pending promise without crash
    await ReactTestRenderer.act(async () => {
      resolvePromise!(true);
    });
  });
});

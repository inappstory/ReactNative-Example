import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { IAMScreen } from '../src/examples/iam/IAMScreen';
import { StoryService } from '../src/sdk';

describe('IAMScreen Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all key elements: title, description, ID, Event, toggle, and action buttons', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    expect(renderer).not.toBeNull();
    const root = renderer!.root;

    // Verify main screen container
    expect(root.findByProps({ testID: 'iam-screen' })).toBeDefined();

    // Verify ID and Event labels
    const idLabel = root.findByProps({ testID: 'iam-id-text' });
    expect(idLabel.props.children).toBe('welcome_message');

    const eventLabel = root.findByProps({ testID: 'iam-event-text' });
    expect(eventLabel.props.children).toBe('user_registered');

    // Verify Only Preloaded toggle
    const toggle = root.findByProps({ testID: 'only-preloaded-toggle' });
    const toggleText = root.findByProps({ testID: 'only-preloaded-toggle-text' });
    expect(toggle).toBeDefined();
    expect(toggleText.props.children).toBe('OFF');

    // Verify buttons
    expect(root.findByProps({ testID: 'show-iam-by-id-button' })).toBeDefined();
    expect(root.findByProps({ testID: 'show-iam-by-event-button' })).toBeDefined();
    expect(root.findByProps({ testID: 'preload-iam-button' })).toBeDefined();

    // Verify Events box
    expect(root.findByProps({ testID: 'iam-last-event-box' })).toBeDefined();
    const eventName = root.findByProps({ testID: 'iam-last-event-name' });
    expect(eventName.props.children).toBe('No events yet');
  });

  it('toggles onlyPreloaded between OFF and ON', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    const root = renderer!.root;
    const toggle = root.findByProps({ testID: 'only-preloaded-toggle' });
    const toggleText = root.findByProps({ testID: 'only-preloaded-toggle-text' });

    expect(toggleText.props.children).toBe('OFF');

    await ReactTestRenderer.act(async () => {
      toggle.props.onPress();
    });

    expect(toggleText.props.children).toBe('ON');

    await ReactTestRenderer.act(async () => {
      toggle.props.onPress();
    });

    expect(toggleText.props.children).toBe('OFF');
  });

  it('triggers showIAMById and displays shown status on success', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const showByIdSpy = jest.spyOn(manager, 'showIAMById').mockResolvedValueOnce(true);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    const root = renderer!.root;
    const button = root.findByProps({ testID: 'show-iam-by-id-button' });

    await ReactTestRenderer.act(async () => {
      button.props.onPress();
    });

    expect(showByIdSpy).toHaveBeenCalledTimes(1);
    expect(showByIdSpy).toHaveBeenCalledWith(
      'welcome_message',
      false,
      expect.any(Object)
    );

    const shownStatus = root.findByProps({ testID: 'iam-status-shown' });
    expect(shownStatus).toBeDefined();
  });

  it('displays not-shown status when showIAMById resolves or rejects with false', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showIAMById').mockRejectedValueOnce(false);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    const root = renderer!.root;
    const button = root.findByProps({ testID: 'show-iam-by-id-button' });

    await ReactTestRenderer.act(async () => {
      button.props.onPress();
    });

    const notShownStatus = root.findByProps({ testID: 'iam-status-not-shown' });
    expect(notShownStatus).toBeDefined();
  });

  it('triggers showIAMByEvent with onlyPreloaded flag', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const showByEventSpy = jest.spyOn(manager, 'showIAMByEvent').mockResolvedValueOnce(true);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    const root = renderer!.root;
    const toggle = root.findByProps({ testID: 'only-preloaded-toggle' });

    // Enable onlyPreloaded
    await ReactTestRenderer.act(async () => {
      toggle.props.onPress();
    });

    const button = root.findByProps({ testID: 'show-iam-by-event-button' });
    await ReactTestRenderer.act(async () => {
      button.props.onPress();
    });

    expect(showByEventSpy).toHaveBeenCalledTimes(1);
    expect(showByEventSpy).toHaveBeenCalledWith(
      'user_registered',
      true,
      expect.any(Object)
    );

    const shownStatus = root.findByProps({ testID: 'iam-status-shown' });
    expect(shownStatus).toBeDefined();
  });

  it('triggers preloadIAM and displays preloaded status', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    const preloadSpy = jest.spyOn(manager, 'preloadIAM').mockResolvedValueOnce(true);

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    const root = renderer!.root;
    const preloadButton = root.findByProps({ testID: 'preload-iam-button' });

    await ReactTestRenderer.act(async () => {
      preloadButton.props.onPress();
    });

    expect(preloadSpy).toHaveBeenCalledTimes(1);
    const preloadedStatus = root.findByProps({ testID: 'iam-status-preloaded' });
    expect(preloadedStatus).toBeDefined();
  });

  it('receives events via onIamEvent and displays last event in UI', async () => {
    let capturedListener: ((event: any) => void) | null = null;
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'onIamEvent').mockImplementationOnce((listener) => {
      capturedListener = listener;
    });

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    expect(capturedListener).not.toBeNull();

    await ReactTestRenderer.act(async () => {
      capturedListener!({
        event: 'showInAppMessage',
        body: { id: 101, title: 'Welcome Voucher', event: 'user_registered' },
      });
    });

    const root = renderer!.root;
    const eventName = root.findByProps({ testID: 'iam-last-event-name' });
    expect(eventName.props.children).toBe('showInAppMessage');
    expect(JSON.stringify(renderer!.toJSON())).toContain('Welcome Voucher');
  });

  it('displays error card when showIAMById rejects with an Error', async () => {
    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showIAMById').mockRejectedValueOnce(new Error('SDK Internal Error'));

    let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    const root = renderer!.root;
    const button = root.findByProps({ testID: 'show-iam-by-id-button' });

    await ReactTestRenderer.act(async () => {
      button.props.onPress();
    });

    const errorCard = root.findByProps({ testID: 'iam-error-card' });
    expect(errorCard).toBeDefined();
    expect(JSON.stringify(renderer!.toJSON())).toContain('SDK Internal Error');
  });

  it('aborts active request cleanly on component unmount', async () => {
    let resolvePromise: (val: boolean) => void;
    const pendingPromise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });

    const manager = await StoryService.getOrInitStoryManager();
    jest.spyOn(manager, 'showIAMById').mockImplementationOnce((_id, _onlyPreloaded, signal) => {
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
      renderer = ReactTestRenderer.create(<IAMScreen />);
    });

    const root = renderer!.root;
    const button = root.findByProps({ testID: 'show-iam-by-id-button' });

    // Start request
    await ReactTestRenderer.act(async () => {
      button.props.onPress();
    });

    // Unmount while pending
    await ReactTestRenderer.act(async () => {
      renderer!.unmount();
    });

    // Complete pending promise without crash
    await ReactTestRenderer.act(async () => {
      resolvePromise!(true);
    });
  });
});

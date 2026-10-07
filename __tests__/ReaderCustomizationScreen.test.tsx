import React from 'react';
import { create, act } from 'react-test-renderer';
import { ReaderCustomizationScreen } from '../src/examples/reader-customization/ReaderCustomizationScreen';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@inappstory/react-native-sdk', () => {
  const mockReact = require('react');
  return {
    StoriesList: (props: any) => mockReact.createElement('StoriesList', props),
    AppearanceManager: jest.fn().mockImplementation(() => ({
      setCommonOptions: jest.fn().mockReturnThis(),
      setStoryReaderOptions: jest.fn().mockReturnThis(),
      setStoriesListOptions: jest.fn().mockReturnThis(),
    })),
    StoryManager: jest.fn(),
    StoryReaderCloseButtonPosition: { RIGHT: 'RIGHT' },
    StoryReaderSwipeStyle: { FLAT: 'FLAT' },
  };
});

jest.mock('../src/sdk', () => ({
  StoryService: {
    getOrInitStoryManager: jest.fn().mockResolvedValue({}),
  },
}));

describe('ReaderCustomizationScreen', () => {
  it('renders correctly', async () => {
    let tree: any;
    await act(async () => {
      tree = create(
        <NavigationContainer>
          <ReaderCustomizationScreen />
        </NavigationContainer>
      );
    });
    expect(tree.toJSON()).toBeTruthy();
  });
});

/* eslint-disable no-undef */
// Global Jest Setup for ReactNativeExample

// Mock @inappstory/react-native-sdk with deterministic offline mock
jest.mock('@inappstory/react-native-sdk', () =>
  require('./__tests__/mocks/inappstoryMock')
);

// Mock react-native-safe-area-context with full esModule export
jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock').default;
  return {
    __esModule: true,
    ...mock,
    default: mock,
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Dummy = ({ children, ...props }: any) =>
    React.createElement(View, props, children);

  return {
    __esModule: true,
    enableScreens: jest.fn(),
    screensEnabled: jest.fn(() => false),
    Screen: Dummy,
    ScreenContainer: Dummy,
    NativeScreen: Dummy,
    NativeScreenContainer: Dummy,
    ScreenStack: Dummy,
    ScreenStackItem: Dummy,
    ScreenStackHeaderConfig: Dummy,
    ScreenStackHeaderBackButtonImage: Dummy,
    ScreenStackHeaderLeftView: Dummy,
    ScreenStackHeaderRightView: Dummy,
    ScreenStackHeaderCenterView: Dummy,
    ScreenStackHeaderSearchBarView: Dummy,
    SearchBar: Dummy,
    ScreenFooter: Dummy,
    compatibilityFlags: {},
    isSearchBarAvailableForCurrentPlatform: false,
    shouldUseActivityState: true,
  };
});

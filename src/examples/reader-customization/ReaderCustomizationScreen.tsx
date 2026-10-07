import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StoriesList,
  AppearanceManager,
  StoryManager,
  StoryReaderCloseButtonPosition,
  StoryReaderSwipeStyle,
  type StoriesListRef
} from '@inappstory/react-native-sdk';
import { StoryService } from '../../sdk';
import { config } from '../../config';

export const ReaderCustomizationScreen: React.FC = () => {
  const storiesListRef = useRef<StoriesListRef>(null);
  const [manager, setManager] = useState<StoryManager | null>(null);

  // Local AppearanceManager to only affect this screen
  const appearanceManager = new AppearanceManager()
    .setCommonOptions({
      hasLike: true,
      hasLikeButton: true,
      hasDislikeButton: false,
      hasFavorite: true,
      hasShare: true,
    })
    .setStoryReaderOptions({
      closeButtonPosition: StoryReaderCloseButtonPosition.RIGHT,
      scrollStyle: StoryReaderSwipeStyle.FLAT,
      slideBorderRadius: 8,
    });

  useEffect(() => {
    let active = true;
    StoryService.getOrInitStoryManager()
      .then((mgr) => {
        if (active) setManager(mgr);
      })
      .catch((e) => {
        console.error('Failed to init StoryManager:', e);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleReload = () => {
    storiesListRef.current?.reload();
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.storiesContainer}>
          {!manager ? (
            <ActivityIndicator size="small" color="#0052CC" />
          ) : (
            <StoriesList
              ref={storiesListRef}
              storyManager={manager}
              appearanceManager={appearanceManager}
              feed={config.feed || 'default'}
              onLoadStart={() => {}}
              onLoadEnd={() => {}}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleReload}
          activeOpacity={0.7}
          testID="reload-feed-button"
        >
          <Text style={styles.buttonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  content: {
    padding: 16,
  },
  storiesContainer: {
    minHeight: 160,
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0052CC',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});

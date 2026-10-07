import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoriesList, type StoriesListRef, type StoryManager } from '@inappstory/react-native-sdk';
import { StoryService } from '../../sdk';
import { config } from '../../config';

export const SimpleIntegrationScreen: React.FC = () => {
  const storiesListRef = useRef<StoriesListRef>(null);
  const [manager, setManager] = useState<StoryManager | null>(null);

  const appearanceManager = StoryService.getAppearanceManager();

  useEffect(() => {
    let active = true;
    StoryService.getOrInitStoryManager()
      .then((mgr) => {
        if (active) setManager(mgr);
      })
      .catch(() => {});
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

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StoriesList, type AppearanceManager, type StoryManager } from '@inappstory/react-native-sdk';
import { useNavigation } from '@react-navigation/native';
import { StoryService } from '../../sdk';
import { config } from '../../config';
import type { RootNavigationProp } from '../../navigation/types';

/**
 * Dedicated Favorites Feed Screen
 * Demonstrates a feed displaying ONLY stories favorited by the current user:
 * `<StoriesList feed={feed} favoritesOnly={true} />`
 */
export const FavoritesFeedScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const [storyManager, setStoryManager] = useState<StoryManager | null>(null);
  const [appearanceManager] = useState<AppearanceManager>(() =>
    StoryService.getAppearanceManager()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  useEffect(() => {
    let active = true;

    StoryService.getOrInitStoryManager()
      .then((mgr) => {
        if (!active) return;
        setStoryManager(mgr);
      })
      .catch((err) => {
        if (!active) return;
        console.error('[FavoritesFeedScreen] Failed to init storyManager:', err);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = (status: any) => {
    setIsLoading(false);
    setFavoriteCount(status?.favoriteListLength ?? 0);
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container} testID="favorites-feed-screen">
      {storyManager && (
        <View style={styles.feedWrapper} testID="favorites-only-feed">
          <StoriesList
            storyManager={storyManager}
            appearanceManager={appearanceManager}
            feed={config.feed || 'default'}
            favoritesOnly={true}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
          />
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0052CC" />
          <Text style={styles.loadingText}>Loading favorites feed...</Text>
        </View>
      )}

      {!isLoading && favoriteCount === 0 && (
        <View style={styles.emptyContainer} testID="favorites-empty-state">
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>No favorite stories yet</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        testID="favorites-feed-back-button"
      >
        <Text style={styles.backButtonText}>← Back to Showcase</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#6B778C',
    lineHeight: 20,
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#0052CC',
  },
  feedWrapper: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B778C',
  },
  emptyContainer: {
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#DFE1E6',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B778C',
    textAlign: 'center',
    lineHeight: 18,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
  },
});

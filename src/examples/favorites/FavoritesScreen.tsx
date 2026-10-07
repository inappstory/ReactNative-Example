import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StoriesList, type AppearanceManager, type StoryManager } from '@inappstory/react-native-sdk';
import { useNavigation } from '@react-navigation/native';
import { StoryService } from '../../sdk';
import { config } from '../../config';
import type { RootNavigationProp } from '../../navigation/types';
import { CustomFavoriteCard } from './CustomFavoriteCard';

interface LastFavoriteEvent {
  id: string;
  value: boolean;
  feed: string;
}

/**
 * Favorites Showcase Screen
 * Demonstrates:
 * 1. Main Stories Feed with embedded Favorites Cell (`showFavorites={true}`).
 * 2. Dedicated Favorites Feed navigation via button and `storyManager.onFavoriteCell(...)`.
 * 3. Querying favorites count via `storyManager.favoritesCount()`.
 * 4. Programmatic removal via `storyManager.removeFromFavorite(id)` and `storyManager.removeAllFavorites()`.
 * 5. Event subscription via `storyManager.onFavoriteStory(...)` reading `event.body`.
 * 6. Custom favorite cell rendering demo via `renderFavoriteCell`.
 */
export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const [storyManager, setStoryManager] = useState<StoryManager | null>(null);
  const [appearanceManager] = useState<AppearanceManager>(() =>
    StoryService.getAppearanceManager()
  );

  // Favorites Count State
  const [count, setCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState<boolean>(true);
  const [countError, setCountError] = useState<string | null>(null);

  // Management State
  const [storyIdInput, setStoryIdInput] = useState<string>(
    config.demoFavoriteStoryId || 'demo_story_1'
  );
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [mutationFeedback, setMutationFeedback] = useState<string | null>(null);

  // Custom Favorite Cell Toggle
  const [useCustomCell, setUseCustomCell] = useState<boolean>(false);

  // Last Event State
  const [lastEvent, setLastEvent] = useState<LastFavoriteEvent | null>(null);

  const isMountedRef = useRef<boolean>(true);

  const fetchFavoritesCount = useCallback(async (mgr: StoryManager) => {
    setCountLoading(true);
    setCountError(null);
    try {
      const result = await mgr.favoritesCount();
      if (isMountedRef.current) {
        setCount(result);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setCountError(err?.message || 'Failed to fetch favorites count');
      }
    } finally {
      if (isMountedRef.current) {
        setCountLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let activeManager: StoryManager | null = null;

    StoryService.getOrInitStoryManager()
      .then((mgr) => {
        if (!isMountedRef.current) return;
        activeManager = mgr;
        setStoryManager(mgr);

        // Fetch initial favorites count
        fetchFavoritesCount(mgr);

        // Intercept Favorites Cell tap to open dedicated favorites feed
        mgr.onFavoriteCell(() => {
          if (isMountedRef.current) {
            navigation.navigate('FavoritesFeed');
          }
        });

        // Subscribe to favorite state changes from the reader
        mgr.onFavoriteStory((event: any) => {
          if (!isMountedRef.current) return;
          const body = event?.body ?? event;
          const eventId = String(body?.id ?? '');
          const eventVal = Boolean(body?.value);
          const eventFeed = String(body?.feed || config.feed || 'default');

          setLastEvent({
            id: eventId,
            value: eventVal,
            feed: eventFeed,
          });

          // Synchronize count after mutation
          fetchFavoritesCount(mgr);
        });
      })
      .catch((err) => {
        if (!isMountedRef.current) return;
        console.error('[FavoritesScreen] Failed to init StoryManager:', err);
        setCountLoading(false);
        setCountError('Failed to initialize StoryManager');
      });

    return () => {
      isMountedRef.current = false;
      if (activeManager) {
        // Clear favorite cell listener
        activeManager.onFavoriteCell(undefined);
      }
    };
  }, [fetchFavoritesCount, navigation]);

  const handleRefreshCount = () => {
    if (storyManager && !countLoading) {
      fetchFavoritesCount(storyManager);
    }
  };

  const handleRemoveSingle = async () => {
    const trimmedId = storyIdInput.trim();
    if (!trimmedId) {
      setMutationFeedback('Please enter a valid Story ID.');
      return;
    }
    if (!storyManager || isMutating) return;

    setIsMutating(true);
    setMutationFeedback(null);
    try {
      storyManager.removeFromFavorite(trimmedId);
      setMutationFeedback(`Story ${trimmedId} removed from favorites.`);
      await fetchFavoritesCount(storyManager);
    } catch (err: any) {
      setMutationFeedback(err?.message || 'Failed to remove story.');
    } finally {
      if (isMountedRef.current) {
        setIsMutating(false);
      }
    }
  };

  const handleRemoveAll = () => {
    if (!storyManager || isMutating) return;

    Alert.alert(
      'Remove All Favorites',
      'Are you sure you want to remove all stories from favorites? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove All',
          style: 'destructive',
          onPress: async () => {
            setIsMutating(true);
            setMutationFeedback(null);
            try {
              storyManager.removeAllFavorites();
              setMutationFeedback('All favorites have been removed.');
              await fetchFavoritesCount(storyManager);
            } catch (err: any) {
              setMutationFeedback(err?.message || 'Failed to clear favorites.');
            } finally {
              if (isMountedRef.current) {
                setIsMutating(false);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container} testID="favorites-screen">
      {/* 1. Main Stories Feed */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Main Stories Feed</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setUseCustomCell((prev) => !prev)}
            activeOpacity={0.7}
            testID="custom-favorite-cell-toggle"
          >
            <Text style={styles.toggleButtonText}>
              Custom Cell: {useCustomCell ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {storyManager && (
          <View style={styles.feedWrapper} testID="favorites-main-feed">
            <StoriesList
              storyManager={storyManager}
              appearanceManager={appearanceManager}
              feed={config.feed || 'default'}
              showFavorites={true}
              renderFavoriteCell={
                useCustomCell
                  ? (stories) => <CustomFavoriteCard count={stories?.length ?? 0} />
                  : undefined
              }
              onLoadStart={() => {}}
              onLoadEnd={() => {}}
            />
          </View>
        )}
      </View>

      {/* 2. Favorites Count & Feed Navigation */}
      <View style={styles.card} testID="favorites-count-section">
        <Text style={styles.cardTitle}>Favorites Count & Feed</Text>

        <View style={styles.countRow}>
          <View style={styles.countBadge}>
            {countLoading ? (
              <ActivityIndicator
                size="small"
                color="#0052CC"
                testID="favorites-count-loader"
              />
            ) : (
              <Text style={styles.countValue} testID="favorites-count-value">
                {count !== null ? `Current favorites: ${count}` : 'Current favorites: —'}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.smallButton, countLoading && styles.buttonDisabled]}
            onPress={handleRefreshCount}
            disabled={countLoading}
            activeOpacity={0.7}
            testID="refresh-count-button"
          >
            <Text style={styles.smallButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {countError && <Text style={styles.errorText}>{countError}</Text>}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('FavoritesFeed')}
          activeOpacity={0.7}
          testID="open-favorites-feed-button"
        >
          <Text style={styles.actionButtonText}>Open Favorites Feed →</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Favorite Management */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Management</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={storyIdInput}
            onChangeText={setStoryIdInput}
            placeholder="Story ID"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            testID="remove-story-id-input"
          />
          <TouchableOpacity
            style={[styles.primaryButton, isMutating && styles.buttonDisabled]}
            onPress={handleRemoveSingle}
            disabled={isMutating}
            activeOpacity={0.7}
            testID="remove-one-favorite-button"
          >
            <Text style={styles.primaryButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.destructiveButton, isMutating && styles.buttonDisabled]}
          onPress={handleRemoveAll}
          disabled={isMutating}
          activeOpacity={0.7}
          testID="remove-all-favorites-button"
        >
          <Text style={styles.destructiveButtonText}>Remove All Favorites</Text>
        </TouchableOpacity>

        {mutationFeedback && (
          <Text style={styles.feedbackText} testID="favorites-mutation-feedback">
            {mutationFeedback}
          </Text>
        )}
      </View>

      {/* 4. Events */}
      <View style={styles.card} testID="favorites-last-event-box">
        <Text style={styles.cardTitle}>Favorite Events</Text>

        {lastEvent ? (
          <View style={styles.eventDataBox}>
            <Text style={styles.eventDataText} testID="favorites-last-event-text">
              Story ID: {lastEvent.id} | Favorite: {String(lastEvent.value)} | Feed: {lastEvent.feed}
            </Text>
          </View>
        ) : (
          <View style={styles.eventPlaceholderBox}>
            <Text style={styles.eventPlaceholderText}>No events yet</Text>
          </View>
        )}
      </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DFE1E6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B778C',
    lineHeight: 18,
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#0052CC',
  },
  toggleButton: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DFE1E6',
  },
  toggleButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#172B4D',
  },
  feedWrapper: {
    marginHorizontal: -16,
    marginTop: 4,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  countBadge: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
  },
  countValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172B4D',
  },
  smallButton: {
    backgroundColor: '#0052CC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052CC',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#172B4D',
    backgroundColor: '#FAFBFC',
    marginRight: 10,
  },
  primaryButton: {
    backgroundColor: '#0052CC',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  destructiveButton: {
    backgroundColor: '#FFEBE6',
    borderWidth: 1,
    borderColor: '#FFBDAD',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  destructiveButtonText: {
    color: '#DE350B',
    fontWeight: '600',
    fontSize: 13,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  feedbackText: {
    marginTop: 10,
    fontSize: 13,
    color: '#00875A',
    fontWeight: '500',
  },
  errorText: {
    marginBottom: 10,
    fontSize: 13,
    color: '#DE350B',
    fontWeight: '500',
  },
  eventDataBox: {
    backgroundColor: '#EAE6FF',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6554C0',
  },
  eventDataText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#403294',
    lineHeight: 18,
  },
  eventPlaceholderBox: {
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    padding: 12,
  },
  eventPlaceholderText: {
    fontSize: 13,
    color: '#6B778C',
    fontStyle: 'italic',
  },
});

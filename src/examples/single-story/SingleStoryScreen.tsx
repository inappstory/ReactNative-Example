import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryService } from '../../sdk';
import { config } from '../../config';

/**
 * Single Story Showcase
 * Demonstrates direct opening of a specific story via `storyManager.showStory()`.
 */
export const SingleStoryScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const targetStoryId = config.storyId || 'demo_story_1';

  useEffect(() => {
    return () => {
      // Abort in-flight request when leaving screen to prevent leaks
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleOpenStory = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const manager = await StoryService.getOrInitStoryManager();
      const appearance = StoryService.getAppearanceManager();
      // Official SDK call: showStory(storyId, signal, appearanceManager)
      const result = await manager.showStory(targetStoryId, controller.signal, appearance);
      if (result && result.loaded === false) {
        setError('Story could not be loaded or not found.');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError' && !controller.signal.aborted) {
        setError(err?.message || 'Failed to open story.');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container} testID="single-story-screen">
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Story ID</Text>
            <Text style={styles.value} testID="single-story-id-text">{targetStoryId}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleOpenStory}
            disabled={loading}
            activeOpacity={0.7}
            testID="open-story-button"
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" testID="single-story-loading" />
                <Text style={styles.buttonText} testID="open-story-button-text">Opening...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText} testID="open-story-button-text">Open Story</Text>
            )}
          </TouchableOpacity>

          {error && (
            <View style={styles.errorBox} testID="single-story-error-card">
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  content: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, elevation: 2 },
  infoRow: { backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: '#7A869A', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 15, fontWeight: '500', color: '#091E42' },
  button: { backgroundColor: '#0052CC', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  errorBox: { marginTop: 16, padding: 12, backgroundColor: '#FFEBE6', borderRadius: 8, borderWidth: 1, borderColor: '#FFBDAD' },
  errorText: { color: '#BF2600', fontSize: 13 },
});

import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryService } from '../../sdk';
import { config } from '../../config';

type OnboardingStatus = 'idle' | 'opened' | 'no_unseen' | 'error';

/**
 * Onboarding Showcase
 * Demonstrates developer-controlled launching of onboarding stories via `storyManager.showOnboardings()`.
 * Pattern: Developer UI → storyManager.showOnboardings → Story Reader → unseen onboarding stories.
 */
export const OnboardingScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<OnboardingStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const targetFeed = config.onboardingFeed || 'onboarding';
  const targetUser = config.userId || 'demo_user';

  useEffect(() => {
    return () => {
      // Abort in-flight request when leaving screen to prevent memory leaks
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleShowOnboardings = async () => {
    if (loading) return;
    setStatus('idle');
    setErrorMessage(null);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const manager = await StoryService.getOrInitStoryManager();
      const limit = 1000;
      const tags = config.tags;

      // Official SDK call: showOnboardings(feed, limit, tags, signal)
      const shown = await manager.showOnboardings(
        targetFeed,
        limit,
        tags,
        controller.signal
      );

      if (shown) {
        setStatus('opened');
      } else {
        setStatus('no_unseen');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError' && !controller.signal.aborted) {
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to open onboarding stories.');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container} testID="onboarding-screen">
      <View style={styles.content}>
        <View style={styles.card}>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Onboarding Feed</Text>
              <Text style={styles.value} testID="onboarding-feed-text">{targetFeed}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>User ID</Text>
              <Text style={styles.value} testID="onboarding-user-text">{targetUser}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleShowOnboardings}
            disabled={loading}
            activeOpacity={0.7}
            testID="show-onboardings-button"
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" testID="onboarding-loading-indicator" />
                <Text style={styles.buttonText} testID="show-onboardings-button-text">Loading...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText} testID="show-onboardings-button-text">Show Onboardings</Text>
            )}
          </TouchableOpacity>

          {status === 'opened' && (
            <View style={styles.successBox} testID="onboarding-opened-status">
              <Text style={styles.successTitle}>Onboarding flow opened</Text>
            </View>
          )}

          {status === 'no_unseen' && (
            <View style={styles.infoBox} testID="onboarding-no-unseen-status">
              <Text style={styles.infoTitle}>No unseen onboarding stories</Text>
            </View>
          )}

          {status === 'error' && errorMessage && (
            <View style={styles.errorBox} testID="onboarding-error-card">
              <Text style={styles.errorText}>{errorMessage}</Text>
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
  infoRow: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, marginBottom: 20, gap: 16 },
  infoCol: { flex: 1 },
  label: { fontSize: 11, fontWeight: '600', color: '#7A869A', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 14, fontWeight: '600', color: '#091E42' },
  button: { backgroundColor: '#0052CC', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  successBox: { marginTop: 16, padding: 12, backgroundColor: '#E3FCEF', borderRadius: 8, borderWidth: 1, borderColor: '#ABF5D1' },
  successTitle: { color: '#006644', fontWeight: '700', fontSize: 14 },
  infoBox: { marginTop: 16, padding: 12, backgroundColor: '#DEEBFF', borderRadius: 8, borderWidth: 1, borderColor: '#B3D4FF' },
  infoTitle: { color: '#0747A6', fontWeight: '700', fontSize: 14 },
  errorBox: { marginTop: 16, padding: 12, backgroundColor: '#FFEBE6', borderRadius: 8, borderWidth: 1, borderColor: '#FFBDAD' },
  errorText: { color: '#BF2600', fontSize: 13 },
});

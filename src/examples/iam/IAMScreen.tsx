import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StoryService } from '../../sdk';
import { config } from '../../config';

type IAMStatus = 'idle' | 'shown' | 'not_shown' | 'preloaded' | 'error';

interface LastEventData {
  name: string;
  body: any;
}

/**
 * In-App Messaging (IAM) Showcase
 * Demonstrates developer-controlled presentation of In-App Messages via InAppStory SDK.
 * Supports:
 * - showIAMById(id, onlyPreloaded, signal)
 * - showIAMByEvent(event, onlyPreloaded, signal)
 * - preloadIAM()
 * - onIamEvent(listener)
 *
 * Presentation styles (fullScreen, bottomSheet, popUp, toast) are defined
 * on the InAppStory platform/backend per message.
 */
export const IAMScreen: React.FC = () => {
  const [loadingById, setLoadingById] = useState<boolean>(false);
  const [loadingByEvent, setLoadingByEvent] = useState<boolean>(false);
  const [loadingPreload, setLoadingPreload] = useState<boolean>(false);
  const [onlyPreloaded, setOnlyPreloaded] = useState<boolean>(false);
  const [status, setStatus] = useState<IAMStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<LastEventData | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const iamId = config.iamId || 'welcome_message';
  const iamEvent = config.iamEvent || 'user_registered';

  useEffect(() => {
    let active = true;

    StoryService.getOrInitStoryManager()
      .then((manager) => {
        if (!active) return;
        manager.onIamEvent((event: any) => {
          if (!active) return;
          const eventName =
            event?.event || event?.name || 'iamEvent';
          setLastEvent({
            name: eventName,
            body: event?.body ?? event,
          });
        });
      })
      .catch((err) => {
        if (active) {
          console.warn('[InAppStory] Failed to subscribe to IAM events:', err);
        }
      });

    return () => {
      active = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleShowById = async () => {
    if (loadingById || loadingByEvent || loadingPreload) return;
    setStatus('idle');
    setErrorMessage(null);
    setLoadingById(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const manager = await StoryService.getOrInitStoryManager();
      const shown = await manager.showIAMById(
        iamId,
        onlyPreloaded,
        controller.signal
      );
      if (shown) {
        setStatus('shown');
      } else {
        setStatus('not_shown');
      }
    } catch (err: any) {
      if (err === false) {
        if (!controller.signal.aborted) setStatus('not_shown');
      } else if (err?.name !== 'AbortError' && !controller.signal.aborted) {
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to display In-App Message.');
      }
    } finally {
      if (!controller.signal.aborted) setLoadingById(false);
    }
  };

  const handleShowByEvent = async () => {
    if (loadingById || loadingByEvent || loadingPreload) return;
    setStatus('idle');
    setErrorMessage(null);
    setLoadingByEvent(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const manager = await StoryService.getOrInitStoryManager();
      const shown = await manager.showIAMByEvent(
        iamEvent,
        onlyPreloaded,
        controller.signal
      );
      if (shown) {
        setStatus('shown');
      } else {
        setStatus('not_shown');
      }
    } catch (err: any) {
      if (err === false) {
        if (!controller.signal.aborted) setStatus('not_shown');
      } else if (err?.name !== 'AbortError' && !controller.signal.aborted) {
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to trigger In-App Message event.');
      }
    } finally {
      if (!controller.signal.aborted) setLoadingByEvent(false);
    }
  };

  const handlePreload = async () => {
    if (loadingById || loadingByEvent || loadingPreload) return;
    setStatus('idle');
    setErrorMessage(null);
    setLoadingPreload(true);

    try {
      const manager = await StoryService.getOrInitStoryManager();
      await manager.preloadIAM();
      setStatus('preloaded');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to preload In-App Messages.');
    } finally {
      setLoadingPreload(false);
    }
  };

  const isBusy = loadingById || loadingByEvent || loadingPreload;

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container} testID="iam-screen">
      <View style={styles.content}>
        <View style={styles.card}>
          {/* Toggle Only Preloaded */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelCol}>
              <Text style={styles.sectionLabel}>Only Preloaded</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggleButton, onlyPreloaded && styles.toggleButtonActive]}
              onPress={() => setOnlyPreloaded(!onlyPreloaded)}
              activeOpacity={0.7}
              testID="only-preloaded-toggle"
            >
              <Text
                style={[styles.toggleText, onlyPreloaded && styles.toggleTextActive]}
                testID="only-preloaded-toggle-text"
              >
                {onlyPreloaded ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section: By ID */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>By ID</Text>
            <View style={styles.paramRow}>
              <Text style={styles.paramLabel}>IAM ID:</Text>
              <Text style={styles.paramValue} testID="iam-id-text">{iamId}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, isBusy && styles.buttonDisabled]}
              onPress={handleShowById}
              disabled={isBusy}
              activeOpacity={0.7}
              testID="show-iam-by-id-button"
            >
              {loadingById ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.buttonText} testID="show-iam-by-id-text">Loading...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText} testID="show-iam-by-id-text">Show IAM</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Section: By Event */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>By Event</Text>
            <View style={styles.paramRow}>
              <Text style={styles.paramLabel}>Event Name:</Text>
              <Text style={styles.paramValue} testID="iam-event-text">{iamEvent}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, isBusy && styles.buttonDisabled]}
              onPress={handleShowByEvent}
              disabled={isBusy}
              activeOpacity={0.7}
              testID="show-iam-by-event-button"
            >
              {loadingByEvent ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.buttonText} testID="show-iam-by-event-text">Loading...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText} testID="show-iam-by-event-text">Trigger Event</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Section: Preloading */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Preloading</Text>
            <TouchableOpacity
              style={[styles.secondaryButton, isBusy && styles.buttonDisabled]}
              onPress={handlePreload}
              disabled={isBusy}
              activeOpacity={0.7}
              testID="preload-iam-button"
            >
              {loadingPreload ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#0052CC" />
                  <Text style={styles.secondaryButtonText} testID="preload-iam-text">Preloading...</Text>
                </View>
              ) : (
                <Text style={styles.secondaryButtonText} testID="preload-iam-text">Preload IAM</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Section: Events Log */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Events</Text>
            <View style={styles.eventBox} testID="iam-last-event-box">
              <Text style={styles.eventLabel}>Last IAM Event:</Text>
              <Text style={styles.eventName} testID="iam-last-event-name">
                {lastEvent ? lastEvent.name : 'No events yet'}
              </Text>
              {lastEvent?.body && (
                <Text style={styles.eventBody}>
                  {typeof lastEvent.body === 'object'
                    ? JSON.stringify(lastEvent.body)
                    : String(lastEvent.body)}
                </Text>
              )}
            </View>
          </View>

          {/* Status Feedback Boxes */}
          {status === 'shown' && (
            <View style={styles.successBox} testID="iam-status-shown">
              <Text style={styles.successTitle}>In-App Message Shown</Text>
            </View>
          )}

          {status === 'not_shown' && (
            <View style={styles.infoBox} testID="iam-status-not-shown">
              <Text style={styles.infoTitle}>Message Not Shown</Text>
            </View>
          )}

          {status === 'preloaded' && (
            <View style={styles.successBox} testID="iam-status-preloaded">
              <Text style={styles.successTitle}>IAM Preloaded</Text>
            </View>
          )}

          {status === 'error' && errorMessage && (
            <View style={styles.errorBox} testID="iam-error-card">
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggleLabelCol: { flex: 1 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#172B4D', marginBottom: 2 },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#EBECF0',
  },
  toggleButtonActive: { backgroundColor: '#0052CC' },
  toggleText: { fontSize: 12, fontWeight: '700', color: '#42526E' },
  toggleTextActive: { color: '#FFFFFF' },
  sectionBox: {
    borderTopWidth: 1,
    borderTopColor: '#EBECF0',
    paddingTop: 12,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#172B4D', marginBottom: 8 },
  paramRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  paramLabel: { fontSize: 12, color: '#7A869A', fontWeight: '600' },
  paramValue: { fontSize: 13, color: '#091E42', fontWeight: '600' },
  button: {
    backgroundColor: '#0052CC',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#DEEBFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  secondaryButtonText: { color: '#0052CC', fontWeight: '600', fontSize: 14 },
  eventBox: { backgroundColor: '#F8F9FA', borderRadius: 8, padding: 10 },
  eventLabel: { fontSize: 11, fontWeight: '600', color: '#7A869A', textTransform: 'uppercase' },
  eventName: { fontSize: 13, fontWeight: '700', color: '#091E42', marginTop: 2 },
  eventBody: { fontSize: 11, color: '#42526E', marginTop: 4, fontFamily: 'monospace' },
  successBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E3FCEF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ABF5D1',
  },
  successTitle: { color: '#006644', fontWeight: '700', fontSize: 13, marginBottom: 2 },
  successText: { color: '#006644', fontSize: 12 },
  infoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#DEEBFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B3D4FF',
  },
  infoTitle: { color: '#0747A6', fontWeight: '700', fontSize: 13, marginBottom: 2 },
  infoText: { color: '#0747A6', fontSize: 12 },
  errorBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFEBE6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFBDAD',
  },
  errorText: { color: '#BF2600', fontSize: 12 },
});

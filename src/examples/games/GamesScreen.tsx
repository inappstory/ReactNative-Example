import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StoryManager, CTASource } from '@inappstory/react-native-sdk';
import { DEMO_GAME_ID } from '../registry';

const getStoryManager = (): any => {
  if (typeof (StoryManager as any).getInstance === 'function') {
    return (StoryManager as any).getInstance();
  }
  try {
    const { StoryService } = require('../../sdk');
    return StoryService.getStoryManager();
  } catch {
    return null;
  }
};

const getOrInitStoryManager = async (): Promise<any> => {
  const existing = getStoryManager();
  if (existing) return existing;
  try {
    const { StoryService } = require('../../sdk');
    return await StoryService.getOrInitStoryManager();
  } catch {
    return null;
  }
};

export const GamesScreen: React.FC = () => {
  const [ctaUrl, setCtaUrl] = useState<string | null>(null);
  const [gameInstanceId, setGameInstanceId] = useState<string | null>(null);
  const [preloadStatus, setPreloadStatus] = useState<'Idle' | 'Loading...' | 'Ready' | 'Error'>('Idle');
  const [lastGameEvent, setLastGameEvent] = useState<any>(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const storyManager = await getOrInitStoryManager();
      if (!active || !storyManager) return;
      
      // Subscribe to CTA clicks
      storyManager.storyLinkClickHandler = (payload: any) => {
        if (payload.src === CTASource.GAME_READER) {
          setCtaUrl(payload.url);
          setGameInstanceId(payload.gameInstanceId || 'N/A');
        } else {
          Alert.alert('Story CTA Clicked', payload.url);
        }
      };

      // Subscribe to Game Events
      const handleGameEvent = (event: any) => {
        setLastGameEvent(event?.body ?? event);
      };

      if (typeof storyManager.on === 'function') {
        storyManager.on('gameEvent', handleGameEvent);
      } else if (typeof storyManager.onGameEvent === 'function') {
        storyManager.onGameEvent(handleGameEvent);
      }

      return () => {
        storyManager.storyLinkClickHandler = undefined;
        if (typeof storyManager.off === 'function') {
          storyManager.off('gameEvent', handleGameEvent);
        }
      };
    };

    const cleanupPromise = init();

    return () => {
      active = false;
      cleanupPromise.then(cleanup => cleanup?.());
    };
  }, []);

  const handlePreloadGames = async () => {
    setPreloadStatus('Loading...');
    try {
      const storyManager = await getOrInitStoryManager();
      await storyManager?.preloadGames();
      setPreloadStatus('Ready');
    } catch (e) {
      setPreloadStatus('Error');
    }
  };

  const handleOpenGame = async () => {
    try {
      const storyManager = await getOrInitStoryManager();
      storyManager?.showGame(DEMO_GAME_ID);
    } catch (e) {
      Alert.alert('Error', 'Failed to open game');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity testID="open-game-button" style={styles.button} onPress={handleOpenGame}>
          <Text style={styles.buttonText}>Open Demo Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TouchableOpacity testID="preload-button" style={styles.button} onPress={handlePreloadGames}>
          <Text style={styles.buttonText}>Preload Games</Text>
        </TouchableOpacity>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status: {preloadStatus}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.logContainer}>
          <Text style={styles.logText}>Last Game CTA URL: {ctaUrl || 'None'}</Text>
          <Text style={styles.logText}>Game Instance ID: {gameInstanceId || 'None'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.logContainer}>
          <Text style={styles.logText}>
            Last Game Event: {lastGameEvent ? lastGameEvent.name || 'Unknown' : 'None'}
          </Text>
          <Text style={styles.logText}>
            Payload: {lastGameEvent ? JSON.stringify(lastGameEvent.payload || {}) : 'N/A'}
          </Text>
          <Text style={styles.logText}>
            Error: {lastGameEvent?.message || 'N/A'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F6F8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  button: {
    backgroundColor: '#0052CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  logContainer: {
    backgroundColor: '#F4F5F7',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DFE1E6',
  },
  logText: {
    fontSize: 13,
    color: '#172B4D',
    fontFamily: 'Courier',
    marginBottom: 4,
  },
  statusRow: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0052CC',
  },
});

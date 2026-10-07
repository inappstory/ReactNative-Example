import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { StoriesList, type StoryManager } from '@inappstory/react-native-sdk';
import { StoryService } from '../../sdk/StoryService';
import { config } from '../../config';

export const UserSwitchingScreen: React.FC = () => {
  const [activeUser, setActiveUser] = useState<string | null>(config.userId);
  const [manager, setManager] = useState<StoryManager | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure StoryManager is initialized before showing the screen
    StoryService.getOrInitStoryManager().then((mgr) => {
      setManager(mgr);
      setIsReady(true);
    });
  }, []);

  const switchUser = useCallback((newUserId: string) => {
    const mgr = manager ?? StoryService.getStoryManager();
    if (mgr) {
      mgr.setUserId(newUserId, null);
      setActiveUser(newUserId);
    }
  }, [manager]);

  const logout = useCallback(() => {
    const mgr = manager ?? StoryService.getStoryManager();
    if (mgr) {
      mgr.logout();
      setActiveUser(null);
    }
  }, [manager]);

  if (!isReady || !manager) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0052CC" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>User: {activeUser || 'None (Logged Out)'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => switchUser('user-a')}>
          <Text style={styles.buttonText}>user-a</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => switchUser('user-b')}>
          <Text style={styles.buttonText}>user-b</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feedContainer}>
        <StoriesList
          storyManager={manager}
          appearanceManager={StoryService.getAppearanceManager()}
          feed={config.feed || 'default'}
          onLoadStart={() => {}}
          onLoadEnd={() => {}}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  subtitle: {
    fontSize: 16,
    color: '#5E6C84',
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    backgroundColor: '#0052CC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#DE350B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  feedContainer: {
    marginTop: 16,
  },
});

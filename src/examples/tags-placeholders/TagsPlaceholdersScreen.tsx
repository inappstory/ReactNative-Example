import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StoriesList, type StoriesListRef, type StoryManager } from '@inappstory/react-native-sdk';
import { StoryService } from '../../sdk';
import { config } from '../../config';

export const TagsPlaceholdersScreen: React.FC = () => {
  const [manager, setManager] = useState<StoryManager | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');

  // We need a ref to StoriesListRef to reload the feed when session parameters change
  const storiesListRef = useRef<StoriesListRef>(null);
  const appearanceManager = StoryService.getAppearanceManager();

  useEffect(() => {
    let active = true;
    StoryService.getOrInitStoryManager()
      .then((storyMgr) => {
        if (active) setManager(storyMgr);
      })
      .catch((err) => {
        console.error('[TagsPlaceholdersScreen] Failed to init StoryManager:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleApplyParams = () => {
    if (!manager) return;

    // 1. Process Tags
    // Split by comma, trim whitespace, remove empty strings
    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Apply tags filtering to the session
    manager.setTags(tagsArray);

    // 2. Process Text Placeholders
    // In a real app, this might come from your user profile state
    const placeholders: Record<string, string> = {};
    if (usernameInput.trim()) {
      placeholders['username'] = usernameInput.trim();
    }
    
    // Apply text placeholders to the session
    manager.setPlaceholders(placeholders);

    // 3. Process Image Placeholders
    // Replace default avatar with user's specific avatar URL
    const imagePlaceholders: Record<string, string> = {};
    if (avatarInput.trim()) {
      imagePlaceholders['avatar'] = avatarInput.trim();
    }
    
    // Apply image placeholders to the session
    manager.setImagePlaceholders(imagePlaceholders);

    // 4. Reload the feed to fetch targeted content and apply personalization
    storiesListRef.current?.reload();
  };

  const handleClear = () => {
    setTagsInput('');
    setUsernameInput('');
    setAvatarInput('');
    
    if (manager) {
      manager.setTags([]);
      manager.setPlaceholders({});
      manager.setImagePlaceholders({});
    }
    
    storiesListRef.current?.reload();
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Targeting Tags</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. promo, premium_user"
              placeholderTextColor="#97A0AF"
              value={tagsInput}
              onChangeText={setTagsInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Text Placeholders</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#97A0AF"
              value={usernameInput}
              onChangeText={setUsernameInput}
              autoCorrect={false}
            />

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Image Placeholders</Text>
            <TextInput
              style={styles.input}
              placeholder="Avatar URL"
              placeholderTextColor="#97A0AF"
              value={avatarInput}
              onChangeText={setAvatarInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyParams}>
                <Text style={styles.applyButtonText}>Apply Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.feedContainer}>
            {!manager ? (
              <ActivityIndicator size="small" color="#0052CC" />
            ) : (
              <StoriesList
                ref={storiesListRef}
                storyManager={manager}
                appearanceManager={appearanceManager}
                feed={config.feed || 'tags-placeholders-demo'}
                onLoadStart={() => {}}
                onLoadEnd={() => {}}
              />
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E9EBEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#172B4D',
    backgroundColor: '#FAFBFC',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    color: '#5E6C84',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#0052CC',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  feedContainer: {
    marginTop: 12,
  },
});

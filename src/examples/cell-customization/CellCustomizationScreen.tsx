import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  StoriesList,
  type StoriesListRef,
  type StoryManager,
} from '@inappstory/react-native-sdk';
import { StoryService } from '../../sdk';
import { config } from '../../config';
import {
  PRESETS,
  PRESET_LIST,
  createAppearanceManagerForPreset,
  type PresetId,
} from './presets';

export const CellCustomizationScreen: React.FC = () => {
  const storiesListRef = useRef<StoriesListRef>(null);
  const [manager, setManager] = useState<StoryManager | null>(null);
  const [activePresetId, setActivePresetId] = useState<PresetId>('rectangle');

  const activePreset = PRESETS[activePresetId];
  const appearanceManager = createAppearanceManagerForPreset(activePresetId);

  useEffect(() => {
    StoryService.getOrInitStoryManager().then(setManager).catch(() => { });
  }, []);



  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container} testID="cell-customization-screen">
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.chipsContainer}>
          {PRESET_LIST.map((preset) => {
            const isSelected = preset.id === activePresetId;
            return (
              <TouchableOpacity
                key={preset.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setActivePresetId(preset.id)}
                activeOpacity={0.7}
                testID={`preset-chip-${preset.id}`}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {preset.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.storiesContainer} testID="stories-list-cell-customization">
          {!manager ? (
            <ActivityIndicator size="small" color="#0052CC" />
          ) : (
            <StoriesList
              key={activePresetId}
              ref={storiesListRef}
              storyManager={manager}
              appearanceManager={appearanceManager}
              feed={config.feed || 'default'}
              onLoadStart={() => { }}
              onLoadEnd={() => { }}
            />
          )}
        </View>

        <View style={styles.highlightsCard} testID="active-preset-highlights">
          <View style={styles.propertiesGrid}>
            {activePreset.highlights.map((item, index) => (
              <View key={index} style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>{item.label}:</Text>
                <Text style={styles.propertyValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => storiesListRef.current?.reload()}
          activeOpacity={0.7}
          testID="reload-feed-button"
        >
          <Text style={styles.reloadButtonText}>Reload Feed</Text>
        </TouchableOpacity>
      </ScrollView>
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: '#0052CC',
    borderColor: '#0052CC',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#172B4D',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  storiesContainer: {
    minHeight: 160,
    justifyContent: 'center',
    marginBottom: 16,
  },
  highlightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBECF0',
    marginBottom: 16,
  },
  propertiesGrid: {
    gap: 6,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F7',
  },
  propertyLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#091E42',
    fontWeight: '600',
  },
  propertyValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#0052CC',
    fontWeight: '700',
  },
  reloadButton: {
    backgroundColor: '#0052CC',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});

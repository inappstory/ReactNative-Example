import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryManager } from '@inappstory/react-native-sdk';
import { StoryService } from '../../sdk';
import { DEMO_GOODS_CATALOG } from './goodsData';
import { config } from '../../config';

export const CustomGoodsWidgetScreen: React.FC = () => {
  const [manager, setManager] = useState<StoryManager | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    StoryService.getOrInitStoryManager()
      .then((mgr) => {
        if (!active) return;

        // Platform capability note:
        // "Full Goods widget override" and "Custom Goods cell" are not currently supported 
        // in the React Native SDK API. This example uses the supported integration method:
        // providing product data via `getGoods` and handling selection via `onGoodItemSelected`.
        
        // Register the goods data provider callback
        mgr.getGoods(async (skus: string[]) => {
          console.log('SDK requested Goods SKUs:', skus);
          const products = skus
            .map(sku => DEMO_GOODS_CATALOG[sku])
            .filter(Boolean); // Filter out unknown SKUs to avoid crashes
          return products;
        });

        // Register the product selection callback
        mgr.onGoodItemSelected((event: any) => {
          if (event && event.body && event.body.sku) {
            console.log('User selected product SKU:', event.body.sku);
            setSelectedSku(event.body.sku);
          }
        });

        setManager(mgr);
      })
      .catch((e) => {
        console.error('Failed to init StoryManager:', e);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOpenStory = () => {
    if (manager && config.storyId) {
      manager.showStory(config.storyId);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.statusBox}>
          <Text style={styles.sectionTitle}>Selected Product:</Text>
          <Text style={styles.statusText} testID="selected-sku-text">
            {selectedSku ? `SKU: ${selectedSku}` : 'None'}
          </Text>
        </View>

        {!manager ? (
          <ActivityIndicator size="small" color="#0052CC" />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleOpenStory}
            activeOpacity={0.7}
            testID="open-goods-story-button"
          >
            <Text style={styles.buttonText}>Open Goods Story</Text>
          </TouchableOpacity>
        )}
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
  statusBox: {
    backgroundColor: '#EAE6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#403294',
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#172B4D',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#403294',
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

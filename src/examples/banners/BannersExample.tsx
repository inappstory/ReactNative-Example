import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerCarousel, BannerViewRef } from '@inappstory/react-native-sdk';
import { useFocusEffect } from '@react-navigation/native';
import { config } from '../../config';
import { StoryService } from '../../sdk';

export const BannersExample: React.FC = () => {
  const bannerRef = useRef<BannerViewRef>(null);
  const placeId = config.bannersPlace || 'default';

  // T014: Preload banners on mount
  useEffect(() => {
    StoryService.getOrInitStoryManager().then(manager => {
      manager.preloadBannerPlace(placeId).catch(err => {
        console.warn('[BannersExample] Failed to preload banners:', err);
      });
    });
  }, [placeId]);

  // T010: Pause on blur, resume on focus
  useFocusEffect(
    useCallback(() => {
      bannerRef.current?.resume();
      return () => {
        bannerRef.current?.pause();
      };
    }, [])
  );

  // T011, T013: Global event handling
  useEffect(() => {
    StoryService.getOrInitStoryManager().then(manager => {
      manager.onBannerWidgetEvent((event: any) => {
         const { bannerData, name, data } = event.body;
         console.log('[BannersExample] Widget event from banner:', bannerData?.id, name, data);
      });
    });
  }, []);

  // T007: Place loaded handler
  const handlePlaceLoaded = (size: number, widgetHeight: number) => {
    console.log('[BannersExample] Loaded banners, count:', size, 'widgetHeight:', widgetHeight);
  };

  // T012: Scroll handler
  const handleScroll = (index: number) => {
    console.log('[BannersExample] Active banner index:', index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BannerCarousel
          placeId={placeId}
          ref={bannerRef}
          cornerRadius={16}
          sideInset={16}
          interItemSpacing={8}
          height={150}
          onPlaceLoaded={handlePlaceLoaded}
          onScroll={handleScroll}
        />

        {/* T009: UI controls for Ref API */}
        <View style={styles.controls}>
          <Button title="Previous" onPress={() => bannerRef.current?.showPrevious()} />
          <Button title="Refresh" onPress={() => bannerRef.current?.refresh()} />
          <Button title="Next" onPress={() => bannerRef.current?.showNext()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    paddingHorizontal: 16,
  },
});

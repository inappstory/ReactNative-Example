import {
  StoryManager,
  AppearanceManager,
  StoriesListCardTitlePosition,
  StoriesListCardViewVariant,
  StoriesListCardTitleTextAlign,
  StoryReaderCloseButtonPosition,
  StoryReaderSwipeStyle,
} from '@inappstory/react-native-sdk';
import { Linking, Platform } from 'react-native';
import { config, type IasAppConfig } from '../config';

const appearance = new AppearanceManager()
  .setCommonOptions({
    hasLike: true,
    hasLikeButton: true,
    hasDislikeButton: false,
    hasFavorite: true,
    hasShare: true,
  })
  .setStoriesListOptions({
    card: {
      title: {
        fontSize: 12,
        fontWeight: 600,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        lineHeight: 14,
        lineClamp: 2,
        textAlign: StoriesListCardTitleTextAlign.LEFT,
        position: StoriesListCardTitlePosition.CARD_INSIDE_BOTTOM,
      },
      gap: 8,
      height: 150,
      variant: StoriesListCardViewVariant.RECTANGLE,
    },
    sidePadding: 16,
  })
  .setStoryReaderOptions({
    closeButtonPosition: StoryReaderCloseButtonPosition.RIGHT,
    scrollStyle: StoryReaderSwipeStyle.FLAT,
    slideBorderRadius: 8,
  });

let storyManager: StoryManager | null = null;
let initPromise: Promise<StoryManager> | null = null;

export const StoryService = {
  getAppearanceManager: () => appearance,
  getStoryManager: () => storyManager,


  async getOrInitStoryManager(customConfig?: IasAppConfig): Promise<StoryManager> {
    if (storyManager) return storyManager;
    if (initPromise) return initPromise;

    const appConfig = customConfig ?? config;
    initPromise = StoryManager.create({
      apiKey: appConfig.apiKey,
      userId: appConfig.userId,
      tags: appConfig.tags,
      placeholders: appConfig.placeholders,
      lang: appConfig.lang,
      defaultMuted: appConfig.defaultMuted,
    })
      .then((mgr) => {
        storyManager = mgr;
        mgr.storyLinkClickHandler = (payload: any) => {
          if (payload?.data?.url) {
            Linking.openURL(payload.data.url).catch((err) => {
              console.warn('[InAppStory] Failed to open story URL:', err);
            });
          }
        };
        return mgr;
      })
      .catch((err) => {
        initPromise = null;
        console.error('[InAppStory] Failed to initialize StoryManager:', err);
        throw err;
      });

    return initPromise;
  },
};

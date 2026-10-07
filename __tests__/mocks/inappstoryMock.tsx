import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text } from 'react-native';

export const StoriesListCardTitlePosition = {
  CARD_INSIDE_BOTTOM: 'cardInsideBottom',
  CARD_OUTSIDE_TOP: 'cardOutsideTop',
  CARD_OUTSIDE_BOTTOM: 'cardOutsideBottom',
};

export const StoriesListCardViewVariant = {
  CIRCLE: 'circle',
  QUAD: 'quad',
  RECTANGLE: 'rectangle',
};

export const StoriesListCardTitleTextAlign = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};

export const StoryReaderCloseButtonPosition = {
  LEFT: 'left',
  RIGHT: 'right',
};

export const StoryReaderSwipeStyle = {
  FLAT: 'flat',
  COVER: 'cover',
  CUBE: 'cube',
};

export class AppearanceManager {
  public setCommonOptions = jest.fn().mockReturnThis();
  public setStoriesListOptions = jest.fn().mockReturnThis();
  public setStoryReaderOptions = jest.fn().mockReturnThis();
  public setHasLike = jest.fn().mockReturnThis();
  public setHasFavorite = jest.fn().mockReturnThis();
}

export class StoryManager {
  public config: any;
  public storyLinkClickHandler: ((payload: any) => void) | null = null;

  constructor(config: any) {
    this.config = config;
  }

  public static create = jest.fn().mockImplementation(async (config: any) => {
    return new StoryManager(config);
  });

  public setApiKey = jest.fn();
  public setUserId = jest.fn();
  public setTags = jest.fn();
  public addTags = jest.fn();
  public removeTags = jest.fn();
  public setLang = jest.fn();
  public setPlaceholders = jest.fn();
  public logout = jest.fn();
  public destroy = jest.fn();
  public onShowStory = jest.fn();
  public onCloseStory = jest.fn();
  public onLog = jest.fn();
  public showStory = jest.fn().mockImplementation(async () => ({ loaded: true }));
  public showOnboardings = jest.fn().mockImplementation(async () => true);
  public showIAMById = jest.fn().mockImplementation(async () => true);
  public showIAMByEvent = jest.fn().mockImplementation(async () => true);
  public preloadIAM = jest.fn().mockImplementation(async () => true);
  public onIamEvent = jest.fn();
  public favoritesCount = jest.fn().mockImplementation(async () => 3);
  public removeFromFavorite = jest.fn();
  public removeAllFavorites = jest.fn();
  public onFavoriteStory = jest.fn();
  public onFavoriteCell = jest.fn();
  public preloadBannerPlace = jest.fn().mockImplementation(async () => {});
  public onBannerWidgetEvent = jest.fn();
  public getGoods = jest.fn();
  public onGoodItemSelected = jest.fn();
}

export interface StoriesListRef {
  reload: () => void;
}

export const StoriesList = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({
    reload: jest.fn(() => {
      props.onLoadStart?.();
      props.onLoadEnd?.({
        feed: props.feed || 'default',
        defaultListLength: 3,
        favoriteListLength: props.favoritesOnly ? 2 : 0,
        success: true,
        list: 'default',
        error: null,
      });
    }),
  }));

  React.useEffect(() => {
    props.onLoadStart?.();
    props.onLoadEnd?.({
      feed: props.feed || 'default',
      defaultListLength: 3,
      favoriteListLength: props.favoritesOnly ? 2 : 0,
      success: true,
      list: 'default',
      error: null,
    });
  }, [props]);

  return (
    <View testID={props.testID || 'stories-list-mock'}>
      <Text testID="stories-list-feed">{props.feed || 'default'}</Text>
      {props.showFavorites && (
        <View testID="stories-list-show-favorites">
          {props.renderFavoriteCell ? (
            props.renderFavoriteCell([
              { storyID: 'fav_1', title: 'Favorite 1' },
              { storyID: 'fav_2', title: 'Favorite 2' },
            ])
          ) : (
            <Text testID="stories-list-favorite-cell">Favorite Cell</Text>
          )}
        </View>
      )}
      {props.favoritesOnly && (
        <Text testID="stories-list-favorites-only">Favorites Only</Text>
      )}
    </View>
  );
});
(StoriesList as any).displayName = 'StoriesList';

export const BannerCarousel = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({
    resume: jest.fn(),
    pause: jest.fn(),
    refresh: jest.fn(),
    showPrevious: jest.fn(),
    showNext: jest.fn(),
  }));
  return <View testID="banner-carousel-mock" />;
});
(BannerCarousel as any).displayName = 'BannerCarousel';


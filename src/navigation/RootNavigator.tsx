import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { CatalogScreen } from '../examples/CatalogScreen';
import { SimpleIntegrationScreen } from '../examples/simple-integration/SimpleIntegrationScreen';
import { CellCustomizationScreen } from '../examples/cell-customization/CellCustomizationScreen';
import { SingleStoryScreen } from '../examples/single-story/SingleStoryScreen';
import { OnboardingScreen } from '../examples/onboarding/OnboardingScreen';
import { IAMScreen } from '../examples/iam/IAMScreen';
import { FavoritesScreen } from '../examples/favorites/FavoritesScreen';
import { FavoritesFeedScreen } from '../examples/favorites/FavoritesFeedScreen';
import { BannersExample } from '../examples/banners/BannersExample';
import { UserSwitchingScreen } from '../examples/user-switching/UserSwitchingScreen';
import { TagsPlaceholdersScreen } from '../examples/tags-placeholders/TagsPlaceholdersScreen';
import { ReaderCustomizationScreen } from '../examples/reader-customization/ReaderCustomizationScreen';
import { CustomGoodsWidgetScreen } from '../examples/custom-goods-widget/CustomGoodsWidgetScreen';
import { GamesScreen } from '../examples/games/GamesScreen';
import { ProductCartScreen } from '../examples/product-cart/ProductCartScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Catalog"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#172B4D',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Catalog"
          component={CatalogScreen}
          options={{ title: 'InAppStory Showcase' }}
        />
        <Stack.Screen
          name="SimpleIntegration"
          component={SimpleIntegrationScreen}
          options={{ title: 'Simple Integration' }}
        />
        <Stack.Screen
          name="CellCustomization"
          component={CellCustomizationScreen}
          options={{ title: 'Cell Customization' }}
        />
        <Stack.Screen
          name="SingleStory"
          component={SingleStoryScreen}
          options={{ title: 'Single Story' }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ title: 'Onboarding' }}
        />
        <Stack.Screen
          name="InAppMessaging"
          component={IAMScreen}
          options={{ title: 'In-App Messaging' }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ title: 'Favorites' }}
        />
        <Stack.Screen
          name="FavoritesFeed"
          component={FavoritesFeedScreen}
          options={{ title: 'Favorite Stories' }}
        />
        <Stack.Screen
          name="Banners"
          component={BannersExample}
          options={{ title: 'Banners' }}
        />
        <Stack.Screen
          name="Games"
          component={GamesScreen}
          options={{ title: 'Games' }}
        />
        <Stack.Screen
          name="UserSwitching"
          component={UserSwitchingScreen}
          options={{ title: 'User Switching' }}
        />
        <Stack.Screen
          name="TagsPlaceholders"
          component={TagsPlaceholdersScreen}
          options={{ title: 'Tags & Placeholders' }}
        />
        <Stack.Screen
          name="ReaderCustomization"
          component={ReaderCustomizationScreen}
          options={{ title: 'Reader Customization' }}
        />
        <Stack.Screen
          name="CustomGoodsWidget"
          component={CustomGoodsWidgetScreen}
          options={{ title: 'Custom GoodsWidget' }}
        />
        <Stack.Screen
          name="ProductCart"
          component={ProductCartScreen}
          options={{ title: 'Product Cart' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

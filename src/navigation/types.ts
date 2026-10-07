import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Catalog: undefined;
  SimpleIntegration: undefined;
  CellCustomization: undefined;
  CustomCell: undefined;
  SingleStory: undefined;
  Onboarding: undefined;
  InAppMessaging: undefined;
  CustomGoodsWidget: undefined;
  Favorites: undefined;
  FavoritesFeed: undefined;
  Banners: undefined;
  Games: undefined;
  MultiFeed: undefined;
  UserSwitching: undefined;
  TagsPlaceholders: undefined;
  ReaderCustomization: undefined;
  ProductCart: undefined;

};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

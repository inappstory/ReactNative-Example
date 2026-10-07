
export interface ExampleItem {
  id: string;
  title: string;
  route: string;
}

export const EXAMPLES_REGISTRY: ExampleItem[] = [
  {
    id: 'simple-integration',
    title: 'Simple Integration',
    route: 'SimpleIntegration',
  },
  {
    id: 'cell-customization',
    title: 'Cell Customization',
    route: 'CellCustomization',
  },
  {
    id: 'single-story',
    title: 'Single Story',
    route: 'SingleStory',
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    route: 'Onboarding',
  },
  {
    id: 'in-app-messaging',
    title: 'In-App Messaging (IAM)',
    route: 'InAppMessaging',
  },
  {
    id: 'custom-goods-widget',
    title: 'Custom GoodsWidget',
    route: 'CustomGoodsWidget',
  },
  {
    id: 'favorites',
    title: 'Favorites',
    route: 'Favorites',
  },
  {
    id: 'banners',
    title: 'Banners',
    route: 'Banners',
  },
  {
    id: 'games',
    title: 'Games',
    route: 'Games',
  },
  {
    id: 'product-cart',
    title: 'Product Cart / Checkout',
    route: 'ProductCart',
  },
  {
    id: 'user-switching',
    title: 'User Switching',
    route: 'UserSwitching',
  },
  {
    id: 'tags-placeholders',
    title: 'Tags & Placeholders',
    route: 'TagsPlaceholders',
  },
  {
    id: 'reader-customization',
    title: 'Reader Customization',
    route: 'ReaderCustomization',
  },
];

export const DEMO_GAME_ID = 'demo-game';

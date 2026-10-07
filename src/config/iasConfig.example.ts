/**
 * InAppStory SDK Configuration Template
 *
 * Instructions:
 * 1. Copy this file to `src/config/iasConfig.ts`:
 *    cp src/config/iasConfig.example.ts src/config/iasConfig.ts
 * 2. Replace `<your-api-key>` with your actual InAppStory API key.
 * 3. `src/config/iasConfig.ts` is gitignored to prevent accidental secret commits.
 */

export interface IasAppConfig {
  /** Project InAppStory API Key */
  apiKey: string;

  /** User Identifier (max 255 chars, no PII) */
  userId: string;

  /** Story Feed slug/id (default: 'default') */
  feed: string;

  /**
   * Specific Story ID for Single Story example.
   * Can be configured via src/config/iasConfig.ts
   * @example 'demo_story_1'
   */
  storyId?: string;

  /**
   * Story Feed slug/id for Onboarding example.
   * Can be configured via src/config/iasConfig.ts
   * @default 'onboarding'
   */
  onboardingFeed?: string;

  /**
   * Default IAM Message ID for In-App Messaging example.
   * Can be configured via src/config/iasConfig.ts
   * @default 'welcome_message'
   */
  iamId?: string;

  /**
   * Default IAM Event Name for In-App Messaging example.
   * Can be configured via src/config/iasConfig.ts
   * @default 'user_registered'
   */
  iamEvent?: string;

  /**
   * Demo Story ID for Favorites example removal action.
   * Can be configured via src/config/iasConfig.ts
   * @default 'demo_story_1'
   */
  demoFavoriteStoryId?: string;

  /**
   * Banner Place ID for Banners example.
   * Can be configured via src/config/iasConfig.ts
   * @default 'default'
   */
  bannersPlace?: string;

  /**
   * Demo Story ID for Product Cart example.
   * Can be configured via src/config/iasConfig.ts
   * @default 'demo_story_1'
   */
  productCartStoryId?: string;

  /** Targeting tags */
  tags?: string[];

  /** Text placeholders for story personalization */
  placeholders?: Record<string, string>;

  /** Language code (e.g. 'en-US', 'ru-RU') */
  lang?: string;

  /** Whether to open story reader muted by default */
  defaultMuted?: boolean;
}

export const iasConfig: IasAppConfig = {
  apiKey: '<your-api-key>',
  userId: 'demo_user',
  feed: 'default',
  storyId: 'demo_story_1',
  onboardingFeed: 'onboarding',
  iamId: 'welcome_message',
  iamEvent: 'user_registered',
  demoFavoriteStoryId: 'demo_story_1',
  bannersPlace: 'default',
  productCartStoryId: 'demo_story_1',
  tags: ['showcase', 'react-native'],
  placeholders: {
    username: 'Developer',
  },
  lang: 'en-US',
  defaultMuted: true,
};


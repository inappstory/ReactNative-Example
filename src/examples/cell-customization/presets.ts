import { Platform } from 'react-native';
import {
  AppearanceManager,
  StoriesListCardViewVariant,
  StoriesListCardTitlePosition,
  StoriesListCardTitleTextAlign,
} from '@inappstory/react-native-sdk';

export type StoriesListOptions = Parameters<AppearanceManager['setStoriesListOptions']>[0];

export type PresetId = 'rectangle' | 'circle' | 'quad';

export interface PresetHighlight {
  label: string;
  value: string;
}

export interface CellCustomizationPreset {
  id: PresetId;
  title: string;
  description: string;
  highlights: PresetHighlight[];
  options: StoriesListOptions;
}

const fontFamily = Platform.select({ ios: 'System', default: 'Roboto' });

export const PRESETS: Record<PresetId, CellCustomizationPreset> = {
  rectangle: {
    id: 'rectangle',
    title: 'Classic Rectangle',
    description: 'Standard rectangle story card with bottom text overlay, subtle mask and rounded border.',
    highlights: [
      { label: 'variant', value: 'RECTANGLE' },
      { label: 'aspectRatio', value: '1.0' },
      { label: 'border.radius', value: '12 dp' },
      { label: 'border.color', value: '#0052CC' },
      { label: 'title.position', value: 'CARD_INSIDE_BOTTOM' },
    ],
    options: {
      card: {
        variant: StoriesListCardViewVariant.RECTANGLE,
        height: 140,
        aspectRatio: 1.0,
        gap: 8,
        border: {
          radius: 12,
          color: '#0052CC',
          width: 2,
          gap: 2,
        },
        mask: {
          color: 'rgba(0, 0, 0, 0.25)',
        },
        title: {
          position: StoriesListCardTitlePosition.CARD_INSIDE_BOTTOM,
          textAlign: StoriesListCardTitleTextAlign.LEFT,
          fontSize: 12,
          fontWeight: 600,
          fontFamily,
          lineHeight: 15,
          lineClamp: 2,
          padding: 8,
        },
        opened: {
          border: {
            radius: 12,
            color: '#8E8E93',
            width: 1.5,
            gap: 2,
          },
          opacity: 0.8,
        },
      },
      sidePadding: 16,
      topPadding: 8,
      bottomPadding: 8,
    },
  },

  circle: {
    id: 'circle',
    title: 'Stories Ring / Circle',
    description: 'Circular avatar-style cell with outside centered title and vibrant Instagram-like ring.',
    highlights: [
      { label: 'variant', value: 'CIRCLE' },
      { label: 'aspectRatio', value: '1.0' },
      { label: 'border.radius', value: '48 dp' },
      { label: 'border.color', value: '#E1306C' },
      { label: 'title.position', value: 'CARD_OUTSIDE_BOTTOM' },
    ],
    options: {
      card: {
        variant: StoriesListCardViewVariant.CIRCLE,
        height: 96,
        aspectRatio: 1.0,
        gap: 12,
        border: {
          radius: 48,
          color: '#E1306C',
          width: 2.5,
          gap: 3,
        },
        title: {
          position: StoriesListCardTitlePosition.CARD_OUTSIDE_BOTTOM,
          textAlign: StoriesListCardTitleTextAlign.CENTER,
          fontSize: 11,
          fontWeight: 500,
          fontFamily,
          lineHeight: 14,
          lineClamp: 1,
        },
        opened: {
          border: {
            radius: 48,
            color: '#C7C7CC',
            width: 1.5,
            gap: 2,
          },
          opacity: 0.75,
        },
      },
      sidePadding: 16,
      topPadding: 8,
      bottomPadding: 8,
    },
  },

  quad: {
    id: 'quad',
    title: 'Compact Quad',
    description: 'Compact card with outside left-aligned title, emerald accent border and custom aspect ratio.',
    highlights: [
      { label: 'variant', value: 'QUAD' },
      { label: 'aspectRatio', value: '0.9' },
      { label: 'border.radius', value: '8 dp' },
      { label: 'border.color', value: '#36B37E' },
      { label: 'title.position', value: 'CARD_OUTSIDE_BOTTOM' },
    ],
    options: {
      card: {
        variant: StoriesListCardViewVariant.QUAD,
        height: 110,
        aspectRatio: 0.9,
        gap: 10,
        border: {
          radius: 8,
          color: '#36B37E',
          width: 2,
          gap: 2,
        },
        title: {
          position: StoriesListCardTitlePosition.CARD_OUTSIDE_BOTTOM,
          textAlign: StoriesListCardTitleTextAlign.LEFT,
          fontSize: 11,
          fontWeight: 600,
          fontFamily,
          lineHeight: 14,
          lineClamp: 2,
        },
        opened: {
          border: {
            radius: 8,
            color: '#A5B2C6',
            width: 1,
            gap: 1,
          },
          opacity: 0.7,
        },
      },
      sidePadding: 16,
      topPadding: 8,
      bottomPadding: 8,
    },
  },
};

export const PRESET_LIST: CellCustomizationPreset[] = [
  PRESETS.rectangle,
  PRESETS.circle,
  PRESETS.quad,
];

export function createAppearanceManagerForPreset(presetId: PresetId): AppearanceManager {
  const preset = PRESETS[presetId];
  return new AppearanceManager().setStoriesListOptions(preset.options);
}

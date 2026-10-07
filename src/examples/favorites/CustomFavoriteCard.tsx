import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CustomFavoriteCardProps {
  count: number;
}

/**
 * Custom Favorite Cell Component
 * Rendered inside StoriesList when `renderFavoriteCell` prop is passed.
 * Demonstrates custom branding/styling for the favorites entry point.
 */
export const CustomFavoriteCard: React.FC<CustomFavoriteCardProps> = ({ count }) => {
  return (
    <View style={styles.card} testID="custom-favorite-cell-card">
      <View style={styles.badge}>
        <Text style={styles.starIcon}>★</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        Favorites
      </Text>
      <Text style={styles.subtitle}>
        {count} {count === 1 ? 'story' : 'stories'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 150,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { RootNavigationProp, RootStackParamList } from '../navigation/types';
import { EXAMPLES_REGISTRY, type ExampleItem } from './registry';

export const CatalogScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {EXAMPLES_REGISTRY.map((item: ExampleItem) => (
          <TouchableOpacity
            key={item.id}
            style={styles.button}
            onPress={() => navigation.navigate(item.route as keyof RootStackParamList)}
            activeOpacity={0.7}
            testID={`example-card-${item.id}`}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  list: {
    padding: 16,
  },
  button: {
    backgroundColor: '#0052CC',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

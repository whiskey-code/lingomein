import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { languages } from '../languages';
import { useLocale } from '../../constants/LocaleContext';
import { useRouter } from 'expo-router';

export default function AppLanguageSelectScreen() {
  const router = useRouter();
  const { setLocale } = useLocale();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select App Language</Text>
      <FlatList
        data={languages}
        keyExtractor={item => item.value}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => {
              console.log('Setting locale to', item.value);
              setLocale(item.value);
              router.back();
            }}
          >
            <Text style={styles.langLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    width: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  langLabel: {
    fontSize: 16,
    color: '#333',
  },
});
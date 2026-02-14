import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { languages } from '../languages';
import { useLanguage } from '../LanguageContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function LanguageSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { sourceLang, setSourceLang, targetLang, setTargetLang } = useLanguage();
  const type = params.type === 'target' ? 'target' : 'source';
  const selectedLang = type === 'target' ? targetLang : sourceLang;

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        keyExtractor={item => item.value}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.langButton, selectedLang === item.value && styles.selected]}
            onPress={() => {
              if (type === 'target') setTargetLang(item.value);
              else setSourceLang(item.value);
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
  selected: {
    borderWidth: 2,
    borderColor: '#00d4d4',
  },
  langLabel: {
    fontSize: 16,
    color: '#333',
  },
});
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function AdsScreen() {
  return (
    <ImageBackground source={require('../../assets/images/lingo me in ads page.png')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="megaphone" size={56} color="#007bff" style={styles.icon} />
          <Text style={styles.title}>Advertise With Us</Text>
          <Text style={styles.subtitle}>Reach a global audience in 175+ countries.</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.email}>Clinton Robinson</Text>
          <Text style={styles.email}>mynfservice@gmail.com</Text>
          <Text style={styles.note}>We welcome business, partnership, and promotional inquiries.</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,247,250,0.2)', // Soft overlay for readability
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  label: {
    fontSize: 15,
    color: '#888',
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },
  note: {
    fontSize: 13,
    color: '#888',
    marginTop: 18,
    textAlign: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// Uncomment after installing: expo install expo-in-app-purchases
// import * as InAppPurchases from 'expo-in-app-purchases';

export default function PaywallScreen() {
  // Placeholder for loading state and subscription status
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // TODO: Fetch products and handle purchase flow with expo-in-app-purchases
  // useEffect(() => {
  //   InAppPurchases.connectAsync();
  //   return () => InAppPurchases.disconnectAsync();
  // }, []);

  const handleSubscribe = () => {
    // TODO: Trigger purchase flow
    Alert.alert('Subscribe', 'Subscription flow will be handled here.');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (subscribed) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thank you for subscribing!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Premium Features</Text>
      <Text style={styles.description}>Free to download.</Text>
      <Text style={styles.description}>
        Upgrade to Pro for $4.99/month to unlock unlimited translation, unlimited text‑to‑speech, and all 175 languages with no limits.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Subscribe Now</Text>
      </TouchableOpacity>
      <Text style={styles.note}>All payments and subscriptions are handled securely by Apple.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f7f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00ffd0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    color: '#888',
    marginTop: 12,
    textAlign: 'center',
  },
});

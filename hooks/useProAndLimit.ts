import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIMIT = 5;
const STORAGE_KEY = 'translation_usage';

export function useProAndLimit() {
  const [isPro, setIsPro] = useState(true); // Always Pro for testing
  const [count, setCount] = useState(0);
  const [lastReset, setLastReset] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const { count, lastReset } = JSON.parse(data);
        // Reset if more than 24h passed
        if (Date.now() - lastReset > 24 * 60 * 60 * 1000) {
          setCount(0);
          setLastReset(Date.now());
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, lastReset: Date.now() }));
        } else {
          setCount(count);
          setLastReset(lastReset);
        }
      }
      setLoading(false);
    })();
  }, []);

  const increment = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ count: newCount, lastReset }));
  };

  const reset = async () => {
    setCount(0);
    setLastReset(Date.now());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, lastReset: Date.now() }));
  };

  return { isPro, setIsPro, count, increment, reset, limit: LIMIT, loading };
}

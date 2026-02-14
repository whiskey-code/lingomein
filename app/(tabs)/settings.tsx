import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, ImageBackground, View, Text, TouchableOpacity, Modal } from 'react-native';
import * as Linking from 'expo-linking';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocale } from '../../constants/LocaleContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();
  const [supportVisible, setSupportVisible] = React.useState(false);
  return (
    <ImageBackground source={require('../../assets/images/settings screen lingomein.png')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <MaterialCommunityIcons name="cog" size={64} color="#007bff" style={{ marginBottom: 24 }} />
        <Text style={styles.title}>{t('settings')}</Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://github.com/whiskey-code/lingomein/blob/main/terms-and-conditions.md')}>
          <Text style={styles.buttonText}>{t('terms')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://github.com/whiskey-code/lingomein/blob/main/privacy-policy.md')}>
          <Text style={styles.buttonText}>{t('privacy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSupportVisible(true)}>
          <Text style={styles.buttonText}>{t('support')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/paywall')}>
          <Text style={styles.buttonText}>{t('upgrade')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/app-language-select')}>
          <Text style={styles.buttonText}>{t('changeLanguage')}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={supportVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Support</Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Email: mynfservice@gmail.com</Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>For technical issues, feature requests, or feedback, please email us or visit our FAQ page.</Text>
            <TouchableOpacity style={{ marginTop: 16 }} onPress={() => setSupportVisible(false)}>
              <Text style={{ color: '#007bff', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.trademark}>{t('trademark')}</Text>
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
    backgroundColor: 'rgba(247,247,250,0.2)', // Further reduced opacity for more visible background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    width: 220,
    backgroundColor: '#00ffd0', // Aqua color
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
});

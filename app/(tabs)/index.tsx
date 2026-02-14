import React, { useState } from 'react';
import axios from 'axios';
import { GOOGLE_TRANSLATE_API_KEY } from '../../apiKeys';
import { useLocale } from '../../constants/LocaleContext';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../LanguageContext';
import { useProAndLimit } from '../../hooks/useProAndLimit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { languages } from '../languages';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { GOOGLE_TTS_API_KEY } from '../../apiKeys';
export default function TranslationScreen() {
  const { t } = useLocale();
  const router = useRouter();
  const { sourceLang, setSourceLang, targetLang, setTargetLang } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const {
    isPro,
    setIsPro,
    count,
    increment,
    limit,
    loading: usageLoading
  } = useProAndLimit();

  // Mic button: record, upload to backend, use transcription
  let recordingInstance = null;
  const handleMicToggle = async () => {
    if (!isPro && count >= limit) {
      router.push('/paywall');
      return;
    }
    if (micActive) {
      if (recordingInstance) {
        await recordingInstance.stopAndUnloadAsync();
      }
      setMicActive(false);
      setRecording(false);
      return;
    }
    setTranslatedText('');
    setTranscribedText('');
    setMicActive(true);
    setRecording(true);
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setTranscribedText('Microphone permission denied.');
        setMicActive(false);
        setRecording(false);
        return;
      }
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingInstance = recording;
      setTimeout(async () => {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          // Play back the recorded audio
          const { sound } = await Audio.Sound.createAsync({ uri });
          await sound.playAsync();
          // Upload to backend for transcription
          const formData = new FormData();
          formData.append('audio', {
            uri,
            name: 'audio.m4a',
            type: 'audio/m4a',
          });
          formData.append('language', sourceLang);
          const response = await axios.post('http://localhost:3001/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const transcription = response.data.transcript || 'No speech detected.';
          setTranscribedText(transcription);
          handleTranslate(transcription);
        } catch (err) {
          setTranscribedText('Speech recognition failed.');
        }
        setMicActive(false);
        setRecording(false);
      }, 20000); // Record for 20 seconds
    } catch (err) {
      setTranscribedText('Speech recognition failed.');
      setMicActive(false);
      setRecording(false);
    }
  };

  // Translation using Google Translate API (replace YOUR_API_KEY)
  const handleTranslate = async (text) => {
    if (!isPro && count >= limit) {
      router.push('/paywall');
      return;
    }
    setLoading(true);
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
      const response = await axios.post(url, {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      });
      const translated = response.data.data.translations[0].translatedText;
      setTranslatedText(translated);
      handleSpeak(translated);
      await increment();
    } catch (error) {
      let errorMsg = 'Translation failed.';
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        errorMsg += `\n${error.response.data.error.message}`;
      } else if (error.message) {
        errorMsg += `\n${error.message}`;
      }
      setTranslatedText(errorMsg);
      console.error('Translation error:', error);
    }
    setLoading(false);
  };

  // Text-to-speech: Use expo-speech for Expo Go testing. Restore Google Cloud TTS logic for production/TestFlight.

  const handleSpeak = async (text) => {
    // Expo Go: Always use expo-speech for TTS
    Speech.speak(text, { language: targetLang });
    // --- To restore Google Cloud TTS, replace this function with the previous version using axios and expo-av ---
  };

  return (
    <ImageBackground source={require('../../assets/images/background lingo me in.png')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        {/* Pro Flag */}
        <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: isPro ? '#00e6e6' : '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, zIndex: 10 }}>
          <Text style={{ color: isPro ? '#fff' : '#333', fontWeight: 'bold' }}>{isPro ? 'PRO' : 'FREE'}</Text>
        </View>
        {/* Usage Counter */}
        {!isPro && (
          <Text style={{ position: 'absolute', top: 80, right: 20, color: '#888', fontSize: 12, zIndex: 10 }}>
            {usageLoading ? '' : `${count} / ${limit} free uses today`}
          </Text>
        )}
        <Text style={styles.title}>
          Lingo
          <Text style={styles.orange}>Me</Text>
          In
        </Text>
        {/* Removed Source Language and Target Language buttons from Home screen */}
        <View style={[styles.card, styles.aquaCard]}>
          <Text style={styles.label}>{t('sourceLanguage') || 'Source Language'}</Text>
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => router.push('/screens/language-select?type=source')}
          >
            <MaterialCommunityIcons name="translate" size={28} color="#007bff" />
            <Text style={styles.langButtonText}>{languages.find(l => l.value === sourceLang)?.label || 'Select Language'}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, styles.aquaCard]}>
          <Text style={styles.label}>{t('targetLanguage') || 'Target Language'}</Text>
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => router.push('/screens/language-select?type=target')}
          >
            <MaterialCommunityIcons name="translate" size={28} color="#007bff" />
            <Text style={styles.langButtonText}>{languages.find(l => l.value === targetLang)?.label || 'Select Language'}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputCard, styles.aquaCard]}>
          <Text style={styles.label}>{t('typePhrase') || 'Type a Phrase'}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text to translate"
            value={typedText}
            onChangeText={setTypedText}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (typedText.trim()) handleTranslate(typedText.trim());
            }}
          />
          <Text style={styles.keyboardHint}>
            {t('keyboardTip') || 'Tip: Switch your keyboard to'} {languages.find(l => l.value === sourceLang)?.label || t('theSourceLanguage') || 'the source language'} {t('forEasierTyping') || 'for easier typing. Use the globe icon on your keyboard to change languages.'}
          </Text>
          <TouchableOpacity
            style={styles.translateButton}
            onPress={() => typedText.trim() && handleTranslate(typedText.trim())}
            disabled={loading || !typedText.trim() || (!isPro && count >= limit)}
          >
            <Text style={styles.translateButtonText}>{t('translate') || 'Translate'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.micButton, styles.aquaMicButton, micActive && styles.micButtonDisabled]} onPress={handleMicToggle} disabled={!isPro && count >= limit}>
          <MaterialCommunityIcons name="microphone" size={36} color={micActive ? '#ff5252' : '#007bff'} />
          <Text style={styles.micLabel}>{micActive ? 'Mic On - Tap to Stop' : 'Tap to Start Mic'}</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#007bff" style={{ margin: 20 }} />}
        {transcribedText ? (
          <View style={[styles.resultCard, styles.aquaCard]}>
            <Text style={styles.resultLabel}>{t('transcribed') || 'Transcribed'}</Text>
            <Text style={styles.transcribed}>{transcribedText}</Text>
          </View>
        ) : null}
        {translatedText ? (
          <View style={[styles.resultCard, styles.lastResultCard, styles.aquaCard]}>
            <Text style={styles.resultLabel}>{t('translated') || 'Translated'}</Text>
            <Text style={styles.translated}>{translatedText}</Text>
          </View>
        ) : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  keyboardHint: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  // removed duplicate inputCard style
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  langButtonText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  textInput: {
    width: '100%',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#f7f7fa',
  },
  translateButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  translateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
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
    padding: 24,
    backgroundColor: 'rgba(247,247,250,0.5)', // Lower opacity for more visible background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 32,
    color: '#222',
    letterSpacing: 1,
  },
  orange: {
    color: 'orange',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  // end of StyleSheet
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  aquaMicButton: {
    backgroundColor: '#00ffd0',
  },
  micButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  micLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 16,
    color: '#007bff',
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  lastResultCard: {
    marginBottom: 24,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
    marginBottom: 6,
  },
  transcribed: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  translated: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 5,
  },
});

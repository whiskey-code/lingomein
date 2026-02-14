import React, { useState } from 'react';
import { View, Text, Button, Picker, StyleSheet, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { LocaleProvider } from './constants/LocaleContext';

const languages = [
  { label: 'Afrikaans', value: 'af' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Amharic', value: 'am' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Armenian', value: 'hy' },
  { label: 'Azerbaijani', value: 'az' },
  { label: 'Basque', value: 'eu' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Bosnian', value: 'bs' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Cebuano', value: 'ceb' },
  { label: 'Chichewa', value: 'ny' },
  { label: 'Chinese (Simplified)', value: 'zh' },
  { label: 'Chinese (Traditional)', value: 'zh-TW' },
  { label: 'Corsican', value: 'co' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dutch', value: 'nl' },
  { label: 'English', value: 'en' },
  { label: 'Esperanto', value: 'eo' },
  { label: 'Estonian', value: 'et' },
  { label: 'Filipino', value: 'tl' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French', value: 'fr' },
  { label: 'Frisian', value: 'fy' },
  { label: 'Galician', value: 'gl' },
  { label: 'Georgian', value: 'ka' },
  { label: 'German', value: 'de' },
  { label: 'Greek', value: 'el' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Haitian Creole', value: 'ht' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Hawaiian', value: 'haw' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hmong', value: 'hmn' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Igbo', value: 'ig' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Irish', value: 'ga' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Javanese', value: 'jw' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Kazakh', value: 'kk' },
  { label: 'Khmer', value: 'km' },
  { label: 'Kinyarwanda', value: 'rw' },
  { label: 'Korean', value: 'ko' },
  { label: 'Kurdish (Kurmanji)', value: 'ku' },
  { label: 'Kyrgyz', value: 'ky' },
  { label: 'Lao', value: 'lo' },
  { label: 'Latin', value: 'la' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Luxembourgish', value: 'lb' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Malagasy', value: 'mg' },
  { label: 'Malay', value: 'ms' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Maltese', value: 'mt' },
  { label: 'Maori', value: 'mi' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Mongolian', value: 'mn' },
  { label: 'Myanmar (Burmese)', value: 'my' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Odia', value: 'or' },
  { label: 'Pashto', value: 'ps' },
  { label: 'Persian', value: 'fa' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Punjabi', value: 'pa' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Russian', value: 'ru' },
  { label: 'Samoan', value: 'sm' },
  { label: 'Scots Gaelic', value: 'gd' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Sesotho', value: 'st' },
  { label: 'Shona', value: 'sn' },
  { label: 'Sindhi', value: 'sd' },
    { label: 'Sinhala', value: 'si' },
    { label: 'Slovak', value: 'sk' },
    { label: 'Slovenian', value: 'sl' },
    { label: 'Somali', value: 'so' },
    { label: 'Spanish', value: 'es' },
  { label: 'Sundanese', value: 'su' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Tajik', value: 'tg' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Tatar', value: 'tt' },
  { label: 'Telugu', value: 'te' },
  { label: 'Thai', value: 'th' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Turkmen', value: 'tk' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Uzbek', value: 'uz' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Welsh', value: 'cy' },
  { label: 'Xhosa', value: 'xh' },
  { label: 'Yiddish', value: 'yi' },
  { label: 'Yoruba', value: 'yo' },
  { label: 'Zulu', value: 'zu' },
];

export default function App() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [recording, setRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  // Placeholder for speech-to-text
  const handleRecord = async () => {
    setRecording(true);
    setTranscribedText('');
    setTranslatedText('');
    // TODO: Integrate real speech-to-text
    // For demo, use prompt
    setTimeout(() => {
      const fakeSpeech = 'Hello, how are you?';
      setTranscribedText(fakeSpeech);
      setRecording(false);
      handleTranslate(fakeSpeech);
    }, 2000);
  };

  // Translation using Google Translate API (replace YOUR_API_KEY)
  const handleTranslate = async (text) => {
    setLoading(true);
    try {
      const apiKey = 'YOUR_API_KEY'; // Replace with your Google Translate API key
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const response = await axios.post(url, {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      });
      const translated = response.data.data.translations[0].translatedText;
      setTranslatedText(translated);
      handleSpeak(translated);
    } catch (error) {
      setTranslatedText('Translation failed.');
    }
    setLoading(false);
  };

  // Text-to-speech
  const handleSpeak = (text) => {
    Speech.speak(text, { language: targetLang });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Translating Headset</Text>
      <Text>Select Source Language:</Text>
      <Picker
        selectedValue={sourceLang}
        style={styles.picker}
        onValueChange={setSourceLang}
      >
        {languages.map(lang => (
          <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
        ))}
      </Picker>
      <Text>Select Target Language:</Text>
      <Picker
        selectedValue={targetLang}
        style={styles.picker}
        onValueChange={setTargetLang}
      >
        {languages.map(lang => (
          <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
        ))}
      </Picker>
      <Button title={recording ? 'Recording...' : 'Record & Translate'} onPress={handleRecord} disabled={recording} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ margin: 20 }} />}
      {transcribedText ? (
        <View style={{ marginTop: 20 }}>
          <Text>Transcribed:</Text>
          <Text style={styles.transcribed}>{transcribedText}</Text>
        </View>
      ) : null}
      {translatedText ? (
        <View style={{ marginTop: 20 }}>
          <Text>Translated:</Text>
          <Text style={styles.translated}>{translatedText}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
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

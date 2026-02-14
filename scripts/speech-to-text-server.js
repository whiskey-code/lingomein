// Simple Node.js Express server for audio conversion and Google Speech-to-Text
const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
const PORT = 3001;

const GOOGLE_TTS_API_KEY = 'AIzaSyDsYnx1QxnhkuF3-DnDu_fk73sgTYvkea8'; // Use your real key

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  console.log('Received /transcribe request:', {
    file: req.file,
    body: req.body
  });
  const inputPath = req.file.path;
  const outputPath = inputPath + '.wav';

  // Convert m4a to wav (LINEAR16)
  ffmpeg(inputPath)
    .output(outputPath)
    .audioCodec('pcm_s16le')
    .audioChannels(1)
    .audioFrequency(16000)
    .on('end', async () => {
      // Read wav file and encode to base64
      const audioBuffer = fs.readFileSync(outputPath);
      const base64Audio = audioBuffer.toString('base64');
      // Send to Google Speech-to-Text
      try {
        const googleResponse = await axios.post(
          `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_TTS_API_KEY}`,
          {
            config: {
              encoding: 'LINEAR16',
              sampleRateHertz: 16000,
              languageCode: req.body.language || 'en-US',
            },
            audio: {
              content: base64Audio,
            },
          }
        );
        const transcription =
          googleResponse.data.results &&
          googleResponse.data.results[0] &&
          googleResponse.data.results[0].alternatives[0]
            ? googleResponse.data.results[0].alternatives[0].transcript
            : '';
        res.json({ transcript: transcription });
      } catch (err) {
        res.status(500).json({ error: 'Google STT failed', details: err.message });
      }
      // Clean up files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Audio conversion failed', details: err.message });
      fs.unlinkSync(inputPath);
    })
    .run();
});

app.listen(PORT, () => {
  console.log(`Speech-to-text server running on port ${PORT}`);
});

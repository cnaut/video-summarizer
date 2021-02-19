// Imports the Google Cloud client library for Beta API
/**
 * TODO(developer): Update client library import to use new
 * version of API when desired features become available
 */
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');
const OpenAI = require('openai-api')

// Creates a client
const client = new speech.SpeechClient();

const openai = new OpenAI(process.env.OPEN_AI_API_KEY);

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const filename = './recording.wav';
const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
//const audio = {
//  uri: gcsUri,
//};
const model = 'default';
const encoding = 'MULAW';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const config = {
 // encoding: encoding,
//  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  model: model,
  audioChannelCount: 2
};

const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};


const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
client.recognize(request).then(function(response) {
  console.log(response.results)

  const transcription = response[0].results
  .map(result => result.alternatives[0].transcript)
  .join('\n');
  console.log('Transcription: ', transcription);
  const prompt = transcription + "\ntl;dr:";
  console.log('Prompt: ', prompt);
  openai.complete({
    engine: 'davinci',
    prompt: prompt
  }).then(function(gptResponse) {
    console.log(gptResponse.data);
  });        
}).catch(function(err) {
  console.log(err)
});
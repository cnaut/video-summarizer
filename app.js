/**
 * TODO(developer): Update client library import to use new
 * version of API when desired features become available
 */
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');
const OpenAI = require('openai-api');
const unirest = require("unirest");

function parseYoutubeId(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length==11) ? match[7] : false;
}

const args = process.argv.slice(2);
const youtubeUrl = args[0];
const youtubeId = parseYoutubeId(youtubeUrl);
console.log(youtubeUrl)
console.log(youtubeId);
const req = unirest("GET", `https://subtitles-for-youtube.p.rapidapi.com/subtitles/${youtubeId}`);

req.headers({
	"x-rapidapi-key": process.env.RAPID_API_KEY,
	"x-rapidapi-host": "subtitles-for-youtube.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

  const captions = res.body;
  console.log(res.body)
  let text = res.body
  .map(result => result.text.trim())
  .join(' ');
	console.log(text);

  text = text.substring(0, 8000);
  console.log(text)

  const openai = new OpenAI(process.env.OPEN_AI_API_KEY);
  const prompt = text + "\ntl;dr:";

  openai.complete({
    engine: 'davinci',
    prompt: prompt
  }).then(function(gptResponse) {
    console.log(gptResponse.data);
  }).catch(function(err) {
    console.log(err)
  });        
  
});

// Creates a client
const client = new speech.SpeechClient();

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
/**
 * 
client.recognize(request).then(function(response) {
  console.log(response.results)

  const transcription = response[0].results
  .map(result => result.alternatives[0].transcript)
  .join('\n');
  console.log('Transcription: ', transcription);
  console.log('Prompt: ', prompt);

}).catch(function(err) {
  console.log(err)
});
 */
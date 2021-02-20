const express = require('express')
const app = express()
const OpenAI = require('openai-api');
const unirest = require("unirest");
const port = process.env.PORT || 3000;


function parseYoutubeId(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length==11) ? match[7] : false;
}

app.get('/', (req, res) => {
  console.log(req);
  const youtubeUrl = req.query.url;
  const youtubeId = parseYoutubeId(youtubeUrl);
  console.log(youtubeUrl)
  console.log(youtubeId);
  const subtitleReq = unirest("GET", `https://subtitles-for-youtube.p.rapidapi.com/subtitles/${youtubeId}`);

  subtitleReq.headers({
    "x-rapidapi-key": process.env.RAPID_API_KEY,
    "x-rapidapi-host": "subtitles-for-youtube.p.rapidapi.com",
    "useQueryString": true
  });

  subtitleReq.end(function (subtitleRes) {
    if (subtitleRes.error) throw new Error(subtitleRes.error);

    const captions = subtitleRes.body;
    console.log(subtitleRes.body)
    let text = subtitleRes.body
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
      res.send(gptResponse.data.choices[0].text)
    }).catch(function(err) {
      console.log(err)
    });        
    
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

const dotenv = require('dotenv')
dotenv.config()
const apiKey = process.env.REACT_APP_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/search-query/:query', async (req, res) => {
  const query = req.params.query
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
  // const url = `https://newsapi.org/v2/top-headlines?q=${query}&sources=abc-news,al-jazeera-english,ars-technica,associated-press,axios,bleacher-report,bloomberg,breitbart-news,business-insider,buzzfeed,cbs-news,cnn,cnn-es,crypto-coins-news,engadget,entertainment-weekly,espn,fortune,fox-news,fox-sports,google-news,hacker-news,ign,mashable,medical-news-today,msnbc,mtv-news,national-geographic,national-review,nbc-news,new-scientist,newsweek,new-york-magazine,next-big-future,nfl-news,nhl-news,politico,polygon,recode,reddit-r-all,reuters,techcrunch,techradar,the-american-conservative,the-hill,the-huffington-post,the-next-web,the-verge,the-wall-street-journal,the-washington-post,the-washington-times,time,usa-today,vice-news,wired&apiKey=${apiKey}`;
  const response = await axios.get(url)
  res.send(response.data)
})

app.get('/search-category/:category', async (req, res) => {
  const category = req.params.category
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${apiKey}`
  const response = await axios.get(url)
  res.send(response.data)
})

app.get('/read', (req, res) => {
  const url = req.query.url;
  axios.get(url)
    .then(function(response) {
      let dom = new JSDOM(response.data, { url: url });
      let article = new Readability(dom.window.document).parse();
      res.json({content: article.textContent});
    })
    .catch(function(error) {
      console.error(error);
    });
});

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`);
});

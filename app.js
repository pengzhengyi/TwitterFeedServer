const express = require("express");
const { startStreamingTweets, stopStreamingTweets, stopAllStreamingTweets } = require("./controllers/streaming.js");
const { randomTweets, sortedTweets, sameTweets } = require("./controllers/feed.js");


// Create Express server
const app = express();

// Express configuration
app.set("port", 3000);

app.get("/", function(req, res) {
  res.status(200).send('<p>Welcome, you have reached Twitter Feed Server. Look at <a href="https://github.com/pengzhengyi/TwitterFeedServer#api-endpoints" target="_blank" rel="noopener noreferrer" title="API Doc"> API Documentation.</p>');
});

app.get("/streaming/start", startStreamingTweets);
app.get("/streaming/stop", stopStreamingTweets);
app.get("/streaming/stopall", stopAllStreamingTweets);

app.get("/feed/random", randomTweets);
app.get("/feed/sorted", sortedTweets);
app.get("/feed/same", sameTweets);

// handle missing pages
app.get("*", function(req, res) {
    res.sendStatus(404);
});

module.exports = app;

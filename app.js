import express from "express";
import * as streamingController from "./controllers/streaming.js";
import * as feedController from "./controllers/feed.js";

// Create Express server
const app = express();

// Express configuration
app.set("port", 3000);

app.get("/streaming/start", streamingController.startStreamingTweets);
app.get("/streaming/stop", streamingController.stopStreamingTweets);
app.get("/streaming/stopall", streamingController.stopAllStreamingTweets);

app.get("/feed/random", feedController.randomTweets);
app.get("/feed/sorted", feedController.sortedTweets);
app.get("/feed/same", feedController.sameTweets);

// handle missing pages
app.get("*", function(req, res) {
  res.sendStatus(404);
});

export default app;

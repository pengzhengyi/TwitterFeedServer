import express from "express";
import * as streamingController from "./controllers/streaming.js";

// Create Express server
const app = express();

// Express configuration
app.set("port", 3000);

app.get("/streaming/start", streamingController.startStreamingTweets);
app.get("/streaming/stop", streamingController.stopStreamingTweets);

// handle missing pages
app.get("*", function(req, res) {
  res.sendStatus(404);
});

export default app;

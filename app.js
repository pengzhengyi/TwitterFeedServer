import express from "express";

import { search } from "./api/search.js";

search("pizza");

// Create Express server
const app = express();

// Express configuration
app.set("port", 3000);

// handle missing pages
app.get("*", function(req, res) {
  res.sendStatus(404);
});

export default app;

"use strict";

import express from "express";

const PORT = 8080;
const HOST = "localhost";

const app = express();

app.get("/api/hello", (req, res) => {
  res.send("Hello World API");
});
app.use(express.static("dist"));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

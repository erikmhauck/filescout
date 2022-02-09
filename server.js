"use strict";

const express = require("express");

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express();
app.get("/api/hello", (req, res) => {
  res.send("Hello World API");
});
app.use(express.static("client"));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

"use strict"; // Defines that JavaScript code should be executed in "strict mode".

const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

app.get("/login", (req, res, next) => {
  res.send("You are logged in!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

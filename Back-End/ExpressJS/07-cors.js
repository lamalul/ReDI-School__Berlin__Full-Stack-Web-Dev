"use strict"; // Defines that JavaScript code should be executed in "strict mode".

const express = require("express"),
  cors = require("cors");

const app = express();
const PORT = 3000;

// Apply cross-origin restriction to HTTP requests
const whitelist = ["http://main-server.com"];
const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Define routes
app
  .route("/private-data") // Route: /private-data
  .get(cors(corsOptions), (req, res, next) => {
    res.send("You are allowed to get the private data!");
  });

// Define the main error handler
app.use((err, req, res, next) => {
  const errorCode = req.errorCode || 400;
  res.status(errorCode).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

"use strict"; // Defines that JavaScript code should be executed in "strict mode".
require("dotenv").config();

const express = require("express"),
  compression = require("compression"),
  debug = require("debug"),
  bunyan = require("bunyan");

const app = express();
const PORT = 3000;

const loggerInfo = debug("express:log-info"),
  loggerError = debug("express:log-error");
// Note: to enable logging, we must set the DEBUG environmental variable to the logger's name, e.g. DEBUG=express:log-info or DEBUG=express:log-error. In this example, to enable all loggers we must set the DEBUG=express:*.

const ringBuffer = new bunyan.RingBuffer({ limit: 100 });
function reqSerializer(req) {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
  };
}
const loggerAppActivity = bunyan.createLogger({
  name: "10-best-practices",
  streams: [
    {
      level: "info",
      stream: process.stdout, // log INFOs and above to stdout
    },
    {
      level: "error",
      path: "./logs/app-errors.log", // log ERRORs and above to a file
    },
    {
      level: "warn",
      path: "./logs/app-warns.log", // log WARNINGs and above to a file
    },
    {
      level: "trace",
      type: "raw", // use 'raw' to get raw log record objects
      stream: ringBuffer,
    },
    {
      type: "rotating-file",
      path: "./logs/app-daily-checks.log",
      period: "1d", // daily rotation
      count: 3, // keep 3 back copies
    },
  ],
  serializers: {
    req: reqSerializer,
  },
});

// Apply the middleware
app.use(compression());

// Define routes
app
  .route("/") // Route: /
  .get((req, res, next) => {
    loggerAppActivity.info("User entered the Welcome page");
    res.status(200).send("Welcome!");
  });

// Run the Server
app.listen(PORT, () => {
  // Trigger a fake error after 3 seconds
  setTimeout(() => {
    loggerError("Fake error triggered!");
  }, 3000);

  loggerInfo(`The server is listening on port ${PORT}`);
});

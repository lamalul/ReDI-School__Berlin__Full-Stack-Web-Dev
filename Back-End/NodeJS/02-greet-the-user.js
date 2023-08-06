const http = require("http"),
  url = require("url"),
  fs = require("fs"),
  events = require("events"),
  userModule = require("./custom-modules/user");

// Define constants
const HOSTNAME = "127.0.0.1",
  PORT = 3000,
  LOG_PATH = "data/log.txt";

// Define an Event Emitter as logger
const logEventEmitter = new events.EventEmitter("logger");
logEventEmitter.on("init-logger", () => {
  const logFileExists = fs.existsSync(LOG_PATH);
  if (logFileExists) {
    fs.unlinkSync(LOG_PATH);
  }
});
logEventEmitter.on("user-logged-in", (fname, lname) => {
  const now = new Date().toLocaleString();
  const logMessage = `${now} \t User logged in \t Info: First name: ${fname}, Last name: ${lname}\n`;
  fs.appendFile(LOG_PATH, logMessage, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

// Create a http server
const server = http.createServer((req, res) => {
  const { fname, lname } = url.parse(req.url, true).query; // for example: http://localhost:3000/?fname=David&lname=Ross

  // Check if the required parameters are given
  if (!fname || !lname) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    return res.end("First name and/or last name are missing!");
  }

  // Set the greeting message
  const message = userModule.greetUser(fname, lname);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(message);

  // Trigger the logger event emitter
  logEventEmitter.emit("user-logged-in", fname, lname);
});

// Run the server on PORT at HOSTNAME defined above.
server.listen(PORT, HOSTNAME, () => {
  logEventEmitter.emit("init-logger");
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

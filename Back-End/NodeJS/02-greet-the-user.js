const http = require("http"),
  userModule = require("./custom-modules/user");

// Define constants
const HOSTNAME = "127.0.0.1",
  PORT = 3000;

// Create a http server
const server = http.createServer((req, res) => {
  const message = userModule.greetUser();

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(message);
});

// Run the server on PORT at HOSTNAME defined above.
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

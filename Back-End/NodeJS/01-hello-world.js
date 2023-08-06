const http = require("http");

const HOSTNAME = "127.0.0.1",
  PORT = 3000;

// Create a http server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

// Run the server on on PORT at HOSTNAME defined above.
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

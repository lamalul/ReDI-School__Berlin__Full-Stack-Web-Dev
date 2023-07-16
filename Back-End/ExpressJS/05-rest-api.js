const express = require("express"),
  path = require("path");
const app = express();
const PORT = 3000;

// Make the images directory a publicly accessible asset
app.use(express.static(path.join(__dirname, "public", "images")));

app.get("/", (req, res, next) => {
  res.send("Home page");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

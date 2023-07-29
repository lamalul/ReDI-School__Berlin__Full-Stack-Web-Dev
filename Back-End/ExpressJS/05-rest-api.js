"use strict"; // Defines that JavaScript code should be executed in "strict mode".

const express = require("express"),
  path = require("path");
const app = express();
const PORT = 3000;

// Apply necessary middleware
app.use(express.json());

// Define the Post class object
class Post {
  _id = Math.floor(Math.random() * 1000) + 1000;

  constructor(title, author, content) {
    this.title = title;
    this.author = author;
    this.content = content;
  }
}

// Define the dummy posts
let posts = [
  new Post("1st Post", "User 1", "This is the content"),
  new Post("2nd Post", "User 2", "This is the content"),
  new Post("3rd Post", "User 3", "This is the content"),
];

// Define Routes for GET and POST
app
  .route("/posts")
  .get((req, res, next) => {
    res.status(200).json({
      data: [posts],
      message: "All posts fetched successfully!",
    });
  })
  .post((req, res, next) => {
    const { title, author, content } = req.body;

    // Check if input data is complete
    if (!title || !author || !content) {
      return res.status(422).json({
        error: "Input data is incomplete!",
      });
    }

    // Create and add the new post
    const postNew = new Post(title, author, content);
    posts.push(postNew);

    res.status(201).json({
      data: [posts],
      message: "A new post created successfully!",
    });
  });

// Define Routes for PUT and DELETE
app
  .route("/posts/:id")
  .get((req, res, next) => {
    const postId = req.params.id;

    // Check if the post with given id exists
    const postFound = posts.find((post) => {
      return post._id === Number(postId);
    });
    if (!postFound) {
      return res.status(404).json({
        error: "No post found with the given id!",
      });
    }

    res.status(202).json({
      data: [postFound],
      message: "The post data fetched successfully!",
    });
  })
  .put((req, res, next) => {
    const postId = req.params.id;
    const { title, author, content } = req.body;

    // Check if the post with given id exists
    const postFound = posts.find((post) => {
      return post._id === Number(postId);
    });
    if (!postFound) {
      return res.status(404).json({
        error: "No post found with the given id!",
      });
    }

    // Update the post's data if given
    if (title) postFound.title = title;
    if (author) postFound.author = author;
    if (content) postFound.content = content;

    res.status(202).json({
      data: [posts],
      message: "The post data updated successfully!",
    });
  })
  .delete((req, res, next) => {
    const postId = req.params.id;

    // Check if the post with given id exists
    const postFoundIndex = posts.findIndex((post) => {
      return post._id === Number(postId);
    });
    if (postFoundIndex < 0) {
      return res.status(404).json({
        error: "No post found with the given id!",
      });
    }

    // Remove the post from the database
    posts = posts.filter((post) => {
      return post._id !== Number(postId);
    });

    res.status(202).json({
      data: [posts],
      message: "The post deleted successfully!",
    });
  });

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

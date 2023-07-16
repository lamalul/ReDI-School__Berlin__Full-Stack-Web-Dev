require("dotenv").config();

const express = require("express"),
  jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const secretKey = process.env["SECRET_KEY"] || "secret-key";

// Apply necessary middleware
app.use(express.json());

// Define the User class object
class User {
  _id = Math.floor(Math.random() * 1000) + 1000;

  constructor(username, email, password, userType) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.userType = userType;
  }
}

// Define the dummy users
let users = [
  new User("admin", "admin@mail.com", "adminpass", "admin"),
  new User("user_1", "user1@mail.com", "user1pass", "normal"),
  new User("user_2", "user2@mail.com", "user2pass", "normal"),
];

// Define login route
app
  .route("/login") // Route: /login
  .post((req, res, next) => {
    const { email, password } = req.body;
    let welcomeMessage = "";

    // Check if the user exists
    const userFound = users.find((user) => {
      return user.email === email && user.password === password;
    });
    if (!userFound) {
      return res.status(401).json({
        error: "Invalid credentials!",
      });
    }

    // Authentication
    const token = jwt.sign(
      {
        email: email,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    // Authorization
    switch (userFound.userType) {
      case "normal":
        welcomeMessage = `Welcome dear customer, ${userFound.username} 😊`;
        break;
      case "admin":
        welcomeMessage = `Welcome dear admin, ${userFound.username} 😎`;
        break;
      default:
        welcomeMessage = `Welcome dear ${userFound}`;
        break;
    }

    res.status(200).json({
      token: token,
      message: welcomeMessage,
    });
  });

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

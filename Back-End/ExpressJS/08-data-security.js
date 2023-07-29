require("dotenv").config();

const express = require("express"),
  cors = require("cors"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcryptjs"),
  { body, validationResult } = require("express-validator");

const app = express();
const PORT = 3000;
const secretKey = process.env["SECRET_KEY"] || "secret-key";
const hashingSalt = +process.env["HASHING_SALT"] || 12;

// Apply cross-origin restriction to HTTP requests
const whitelist = ["http://main-server.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Apply necessary middleware
app.use(express.json());

// Define the User class object
class User {
  _id = Math.floor(Math.random() * 1000) + 1000;

  constructor(username, email, password, userType) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.userType = userType || "normal";
  }
}

// Define the dummy users
let users = [];

// Define input data validators for login
const validatorLogin = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email is not valid!")
    .normalizeEmail(),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long!"),
];
// Define input data validators for sign up
const validatorSignUp = [
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required!")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long!")
    .custom((username) => {
      return !users.find((user) => user.username === username);
    })
    .withMessage("Username is not available!"),
  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email is not valid!")
    .custom((email) => {
      return !users.find((user) => user.email === email);
    })
    .withMessage("Email is not available!")
    .normalizeEmail(),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long!"),
];

// Define login route
app
  .route("/login") // Route: /login
  .post(cors(corsOptions), validatorLogin, (req, res, next) => {
    const { email, password } = req.body;
    const validationErrors = validationResult(req);
    let welcomeMessage = "";

    if (!validationErrors.isEmpty()) {
      return res.status(422).json({
        error: "Validation failed!",
        errors: validationErrors.array(),
      });
    }

    // Check if the user exists
    const userFound = users.find((user) => {
      return (
        user.email === email && bcrypt.compareSync(password, user.password)
      );
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

// Define Sign up route
app
  .route("/signup") // Route: /signup
  .post(cors(corsOptions), validatorSignUp, (req, res, next) => {
    const { username, email, password } = req.body;
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(422).json({
        error: "Validation failed!",
        errors: validationErrors.array(),
      });
    }

    // Hash the password
    const passwordHashed = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(hashingSalt)
    );
    const userNew = new User(username, email, passwordHashed);
    users.push(userNew);

    res.status(200).json({
      data: userNew,
      message: "User account created successfully!",
    });
  });

// Run the Server
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

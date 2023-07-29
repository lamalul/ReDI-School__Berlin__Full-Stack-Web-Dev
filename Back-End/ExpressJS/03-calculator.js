"use strict"; // Defines that JavaScript code should be executed in "strict mode".

const express = require("express");
const app = express();
const PORT = 3000;

app.get("/calculator/:operation/:num1/:num2", (req, res, next) => {
  const { operation, num1, num2 } = req.params;
  let answer = null;

  switch (operation) {
    case "add":
      answer = Number(num1) + Number(num2);
      break;
    case "subtract":
      answer = Number(num1) - Number(num2);
      break;
    case "multiply":
      answer = Number(num1) * Number(num2);
      break;
    case "divide":
      try {
        answer = Number(num1) / Number(num2);
      } catch (error) {
        answer = error.message;
      }
      break;
    default:
      answer = "Something went wrong!";
      break;
  }

  res.send(`${num1} ${operation} ${num2} => ${answer}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

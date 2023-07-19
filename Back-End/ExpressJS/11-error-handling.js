const express = require("express");
const app = express();
const PORT = 3000;

// Apply necessary middleware
app.use(express.json());

// Define the route
app
  .route("/divide-by-ten") // Route: /divide-by-ten
  .post((req, res, next) => {
    const { numerator } = req.body;
    let result = null;

    // Use try-catch approach to handle a synchronous code
    try {
      // Simulate an error
      if (!Number(numerator)) {
        const err = new Error("Input number is missing!!!");
        req.errorCode = 400; // Bad Request error code
        throw err;
      }
      result = Number(numerator) / 10;
    } catch (err) {
      // Send error to the next middleware
      return next(err); // Note: we must use 'return' here, otherwise the app will get crashed.
    }

    // This line will never get executed.
    res.json({
      result: result,
      message: `${numerator}/10 is equal to ${result}`,
    });
  });

// Define the main error handler
app.use((err, req, res, next) => {
  const errorCode = req.errorCode || 400;
  res.status(errorCode).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

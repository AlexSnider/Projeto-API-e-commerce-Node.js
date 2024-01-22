const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

// DEPENDENCIES
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// SWAGGER
const swaggerUI = require("swagger-ui-express");

// ROUTES CONTROLLERS
const v1Routes = require("./app/v1/routes/v1Routes");

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(require("./swagger.json")));

// JWT
const { verifyToken } = require("./JWT/JWT");

// MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:3002",
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
  })
);

app.use("/", v1Routes);

// PAYMENT ROUTE - TEST ROUTE
app.get("/v1/payment", verifyToken, (req, res) => {
  res.send("You've done it!");
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

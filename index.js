const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

const v1Routes = require("./app/v1/routes/v1Routes");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(require("./swagger.json")));

app.use("/", v1Routes);

// PAYMENT ROUTE - TEST ROUTE
const { verifyToken } = require("./JWT/JWT");
app.get("/v1/payment", verifyToken, (req, res) => {
  res.send("You've done it!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const userController = require("./app/routes/userRoute");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const { verifyToken } = require("./JWT/JWT");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
  })
);

app.post("/register", userController);
app.post("/login", userController);
app.post("/logout", userController);

app.get("/payment", verifyToken, (req, res) => {
  res.send("You've done it!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

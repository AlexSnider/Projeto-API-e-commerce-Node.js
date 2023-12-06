const DB = require("./DB/dbConection.js");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
/* const User = require("./Models/User.js"); */

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});

/* app.use(
  session({
    key: "userId",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      res.status(400).json({ error: err });
    }

    DB.query(
      "INSERT INTO users (user, password) VALUES (?, ?)",
      [username, hash],
      (err, result) => {
        if (err) {
          res.status(400).json({ error: err });
        } else {
          res.status(200).json({ result, message: "User created!" });
        }
      }
    );
  });
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send({ message: "No token provided!" });
  } else {
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        res.send({ message: "Unauthorized!" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/isAuth", verifyJWT, (req, res) => {
  res.send("Você foi autenticado com sucesso!");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  DB.query("SELECT * FROM users WHERE user = ?", username, (err, result) => {
    if (err) {
      res.send({ message: err });
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, resp) => {
        if (resp) {
          req.session.userId = result[0].id;

          const id = result[0].id;
          const token = jwt.sign({ id }, "secret", {
            expiresIn: 300,
          });
          req.session.userId = result[0].id;

          res.json({ auth: true, token: token, result: result });

          console.log(req.session.userId);
        } else {
          res.json({ auth: false, message: "Wrong password/user!" });
        }
      });
    } else {
      res.json({ auth: false, message: "No user found!" });
    }
  });
});

app.get("/login", (req, res) => {
  if (req.session.userId) {
    res.send({ loggedIn: true, userId: req.session.userId });
  } else {
    res.send({ loggedIn: false });
  }
}); */

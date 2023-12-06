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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
  })
);

app.post("/register", userController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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

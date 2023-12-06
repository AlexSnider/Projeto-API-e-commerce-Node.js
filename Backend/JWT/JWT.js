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

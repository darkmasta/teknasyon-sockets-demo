const express = require("express");
const router = express.Router();
const Users = require("../Models/users");
const User = Users.User;

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { decodeCookie } = require("../helpers/decode-cookie");

router.get("/users", (req, res) => {
  const { email, isAdmin } = decodeCookie(req.cookies.teknasyon);
  var userArr = [];
  var query = User.find();

  query.exec((err, users) => {
    if (err) res.json(err);
    if (users == null) res.json("Error");

    res.json(users);
  });
});

router.get("/user", (req, res) => {
  const { email, isAdmin } = decodeCookie(req.cookies.teknasyon);

  var promise = User.find({ email: email });

  promise.then((doc) => res.json(doc.pop()));
});

router.post("/user_by_id", jsonParser, (req, res) => {
  var userData = req.body.data;

  var promise = User.find({ _id: userData.id });

  promise.then((doc) => res.json(doc.pop()));
});

router.post("/create_new_user", jsonParser, (req, res) => {
  var userData = req.body.data;
  // const { email, isAdmin } = decodeCookie(req.cookies.teknasyon);

  // if (!isAdmin == "admin") res.json("Authorization Error");

  var User = new Users.User({
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    password: userData.password,
    country: userData.country,
    language: userData.language,
  });

  User.save()
    .then((user) => {
      req.io.on("connection", (client) => {
        client.broadcast.emit("register", user);
      });
      res.json("success");
    })
    .catch((err) => res.json(err));
});

module.exports = router;

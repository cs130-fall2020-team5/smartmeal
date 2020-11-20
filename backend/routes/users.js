var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var createError = require("http-errors");
var util = require("util");
var router = express.Router();

var db = require("../db/db");

router.post("/", function (req, res, next) {
  res.status(200);
});

/* POST user login */
router.post("/login", function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  if (username == undefined || password == undefined) {
    next(createError(400));
    return;
  }

  db.get()
    .collection("users")
    .find({ username: username })
    .toArray()
    .then((doc) => {
      if (doc.length < 1) {
        throw "unknown user";
      }
      return bcrypt.compare(password, doc[0].password);
    })
    .then((validUser) => {
      if (!validUser) throw "unauthorized";

      // create session token
      let currentTime = new Date().getTime() / 1000; // seconds
      let expirationTime = currentTime + 60 * 60 * 2; // add 2 hours
      return util.promisify(jwt.sign)(
        {
          exp: expirationTime,
          usr: username,
        },
        process.env.JWT_KEY,
        {
          header: {
            alg: "HS256",
            typ: "JWT",
          },
        }
      );
    })
    .then((token) => {
      res.json({ "jwt": token });
      res.status(200);
      res.end();
    })
    .catch((err) => {
      res.status(401);
      res.end();
    });
});

/* POST user creation */
router.post("/new", function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  if (username == undefined || password == undefined) {
    next(createError(400));
    return;
  }

  db.get()
    .collection("users")
    .find({ username: username })
    .toArray()
    .then((doc) => {

      if (doc.length >= 1) {
        throw "user already exists";
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      var entry = { "username": username, "password": hash };

      return db.get().collection("users").insertOne(entry, (err, res) => {
        if (err) {
          throw err;
        }
      });
    })
    .then((doc) => {
      res.status(200);
      res.end();
    })
    .catch((err) => {
      res.status(401);
      res.end();
    });
});

router.get("/example", function (req, res, next) {
  isAuthenticated(req)
    .then((tokenInfo) => {

      // now that we know which user sent this request, do the required logic here
      // e.g. get meal plan for this authenticated user (in another route, of course)
      var username = tokenInfo.usr;
      
      res.json({ message: "authenticated" });
      res.status(200);
      res.end();
    })
    .catch((err) => {
      res.status(401);
      res.end();
    });
});

function isAuthenticated(req) {
  var token = req.header("Authorization").split(" ")[1];
  return util.promisify(jwt.verify)(
    token,
    process.env.JWT_KEY
  );
}

module.exports = router;

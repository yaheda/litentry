var passport = require('passport');
var express = require('express');
var router = express.Router();
const Litentry = require("../models/secrets")

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../modules/authenticate")

router.get('/secret', verifyUser, async function (req, res) {
  try {
    var docs = await Litentry.find({});
    if (docs.length == 0) {
      res.send({ secret: '[No entry in DB]' });
      return;
    }
    res.send({ secret: docs[0].value });
  } catch (err) {
    res.statusCode = 500;
    res.send("Internal error - fetching secret");
  }
 
});

module.exports = router;
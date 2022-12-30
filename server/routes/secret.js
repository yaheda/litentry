var passport = require('passport');
var express = require('express');
var router = express.Router();
const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../modules/authenticate")

router.get('/secret', verifyUser, function (req, res) {
  res.send({ secret: 'Messi is the GOAT' });
});

module.exports = router;
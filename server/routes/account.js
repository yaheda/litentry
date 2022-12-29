var passport = require('passport');
var express = require('express');
var router = express.Router();

router.get('/signin', passport.authenticate('polkadot'), function (req, res) {
  res.send({ success: true, token })
});

module.exports = router;
var passport = require('passport');
var express = require('express');
var router = express.Router();

router.post('/signin', passport.authenticate('polkadot'), function (req, res) {
  res.send({ success: true })
});

module.exports = router;
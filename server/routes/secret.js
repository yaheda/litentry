var passport = require('passport');
var express = require('express');
var router = express.Router();

router.get('/secret', passport.authenticate('polkadot'), function (req, res) {
  res.send({ success: 'secret me' })
});

module.exports = router;
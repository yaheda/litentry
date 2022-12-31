var passport = require('passport');
var express = require('express');
const jwt = require("jsonwebtoken")
var router = express.Router();
const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../modules/authenticate")

router.post('/signin', passport.authenticate('polkadot'), function (req, res) {
  var user = req.user;
  try {
    const token = getToken(user);
    const refreshToken = getRefreshToken(user);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.send({ success: true, token });
  } catch(error) {
    res.statusCode = 500;
    res.send("Internal error");
  }
  
});

router.post('/refreshToken', function (req, res, next) {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies
  
  if (!refreshToken) {
    res.statusCode = 401;
    res.send("Unauthorized");
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = getToken({ address: payload.address });
    const newRefreshToken = getRefreshToken({ address: payload.address });

    /// At this point one could save that refreshtoken to a database to have more granular control of the sessions

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
    res.send({ success: true, token })
  } catch (error) {
    res.statusCode = 500;
    res.send("Internal error");
    return;
  }

  
});


router.post('/signout', verifyUser, function (req, res) {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  /// remove any refreshtoken that could be linked to some database

  res.clearCookie("refreshToken", COOKIE_OPTIONS)
  res.send({ success: true })
});



module.exports = router;
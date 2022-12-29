passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;
const passport = require("passport")

passport.use('polkadot', new CustomStrategy(
  function(req, callback) {
    var user = {};    
    callback(null, user);
  }
));
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user);});
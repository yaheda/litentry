passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;
const passport = require("passport")
const { cryptoWaitReady, decodeAddress, signatureVerify } = require('@polkadot/util-crypto');
const { u8aToHex } = require('@polkadot/util');

const isValidSignature = (signedMessage, signature, address) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

passport.use('polkadot', new CustomStrategy(
  async function(req, callback) {
    var data = req.body;
    await cryptoWaitReady();
    const isValid = isValidSignature(data.message, data.signature, data.address);
    if (!isValid) {
      callback(null, false);
      return;
    }

    var user = {
      address: data.address
    };

    callback(null, user);
  }
));
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user);});
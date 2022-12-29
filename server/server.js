const express = require("express");
const passport = require("passport")
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT || 5000; 
const server = express();

server.use(express.json());
server.use(cookieParser(process.env.COOKIE_SECRET))
server.use(express.urlencoded({ extended: true }));

server.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
server.use(passport.initialize());
server.use(passport.session());


require("./strategies/PolkadotStrategy")

var accountRoutes = require('./routes/account');
var secretRoutes = require('./routes/secret');

server.use("/api/v1", accountRoutes);
server.use("/api/v1", secretRoutes)

server.get("/api/hello", (req, res) => {
  res.status(200).send("Hello WorldAAA!");
 });

server.listen(PORT, () => console.log(`listening on port ${PORT}`));


/// https://www.codingdeft.com/posts/react-authentication-mern-node-passport-express-mongo/

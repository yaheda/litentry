const express = require("express");
const passport = require("passport")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const logger = require('./modules/logger');

require("dotenv").config()
require("./modules/connectdb")

const PORT = process.env.PORT || 5000; 
const server = express();

server.use(express.json());
server.use(cookieParser(process.env.COOKIE_SECRET))
//server.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', err => logger.error('uncaught exception:', err));
process.on('unhandledRejection', error => logger.error('unhandled rejection:', error));

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      var msg = 'origin ' + origin + ' - ' + whitelist.indexOf(origin);
      callback(new Error("Not allowed by CORS" + msg))
    }
  },

  credentials: true,
  exposedHeaders: ["set-cookie"],
}

server.use(cors(corsOptions))

server.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
server.use(passport.initialize());
server.use(passport.session());


require("./strategies/PolkadotStrategy")
require("./strategies/JwtStrategy")

var accountRoutes = require('./routes/account');
var secretRoutes = require('./routes/secret');

server.use("/api/v1", accountRoutes);
server.use("/api/v1", secretRoutes)

server.get("/", (req, res) => {
  res.status(200).send("Litentry Task Server");
 });

let instance = server.listen(PORT, () => console.log(`listening on port ${PORT}`));
instance.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

module.exports = server;


/// https://www.codingdeft.com/posts/react-authentication-mern-node-passport-express-mongo/

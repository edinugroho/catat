require('dotenv').config();
const model = require('../models/index');
const passportJWT = require("passport-jwt");
const passport = require('passport');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

const opts = {
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey : process.env.JWT_SECRET,
}

passport.use(new JWTStrategy(opts, function(jwt_payload, done) {
  model.User.findOne({
    where: {
      username: jwt_payload.username
    }
  }).then( (user, err) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

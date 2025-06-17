const passport = require('passport');
const User = require('../models/User');

// Use the static methods added by passport-local-mongoose
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

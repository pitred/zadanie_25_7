var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};

passport.serializeUser((user, done) => {
   done(null, user);
});
passport.deserializeUser((obj, done) => {
   done(null, obj);
});

passport.use(
   new GoogleStrategy(
      {
         clientID: config.GOOGLE_CLIENT_ID,
         clientSecret: config.GOOGLE_CLIENT_SECRET,
         callbackURL: config.CALLBACK_URL
      },
      (accessToken, refreshToken, profile, cb) => {
         googleProfile = {
            id: profile.id,
            displayName: profile.displayName
         };
         cb(null, profile);
      }
   )
);

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
   res.render('index', { user: req.user });
});

app.get('/logged', (req, res) => {
   res.render('logged', { user: googleProfile });
});

app.get(
   '/auth/google',
   passport.authenticate('google', {
      scope: ['profile', 'email']
   })
);
app.get(
   '/auth/google/callback',
   passport.authenticate('google', {
      successRedirect: '/logged',
      failureRedirect: '/'
   })
);

app.listen(3000);

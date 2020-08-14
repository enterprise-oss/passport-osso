/* eslint-disable node/no-unpublished-require */
/* eslint-disable node/no-missing-require */
var express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  OssoStrategy = require('../../lib/passport-osso/index').Strategy;

var consolidate = require('consolidate');

var appKey = 'bb200fb215c346448b3c34bbccaac25d';
var appSecret = '0902db0eb5274d4a8f3ec07d3d00d2c8';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete osso profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the OssoStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, expires_in
//   and osso profile), and invoke a callback with a user object.
passport.use(
  new OssoStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: 'http://localhost:8888/callback',
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's osso profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the osso account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    },
  ),
);

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(
  session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }),
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.engine('html', consolidate.swig);

app.get('/', function (req, res) {
  res.render('index.html', { user: req.user });
});

app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account.html', { user: req.user });
});

app.get('/login', function (req, res) {
  res.render('login.html', { user: req.user });
});

// GET /auth/osso
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in osso authentication will involve redirecting
//   the user to osso.com. After authorization, osso will redirect the user
//   back to this application at /auth/osso/callback
app.get(
  '/auth/osso',
  passport.authenticate('osso', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true,
  }),
  function (req, res) {
    // The request will be redirected to osso for authentication, so this
    // function will not be called.
  },
);

// GET /auth/osso/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/callback',
  passport.authenticate('osso', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  },
);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(8888);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

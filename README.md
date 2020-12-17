# Passport-Osso

[Passport](http://passportjs.org/) strategy for authenticating SAML based SSO users with an [Osso](https://ossoapp.com/)
instance using the OAuth 2.0 API.

This module lets you authenticate using Osso in your Node.js applications.
By plugging into Passport, Osso authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-osso
    # or
    $ yarn add passport-osso

## Usage

### Configure Strategy

The Osso authentication strategy authenticates users using an Osso account
and OAuth 2.0 tokens. The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying an Osso baseUrl, client ID, client secret, and callback URL.

```javascript
const OssoStrategy = require('passport-osso').Strategy;

passport.use(
  new OssoStrategy(
    {
      baseUrl: 'https://my-osso.ossoapp.io',
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: 'http://localhost:8888/auth/osso/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      User.findOrCreate({ ossoId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);
```

### Authenticate Requests

Use `passport.authenticate()`, specifying the `'osso'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/osso', passport.authenticate('osso'), function(req, res) {
  // The request will be redirected to osso for authentication, so this
  // function will not be called.
});
```

The above example will show Osso's hosted login page.

You can also gather an email or domain from the user wanting to sign in, and pass that to the Osso strategy, such that the user is sent directly to their IDP:
```javascript
app.post('/auth/osso', (req, res, next) => {
  const { email } = req.body;
  const authenticator = passport.authenticate('osso', { email })
  authenticator(req, res, next)
})
```

```javascript
app.get(
  '/auth/osso/callback',
  passport.authenticate('osso', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
```

## Examples

For a complete, working example on a clean Express app, refer to the [Osso NodeJS example](https://github.com/enterprise-oss/osso-nodejs-example).

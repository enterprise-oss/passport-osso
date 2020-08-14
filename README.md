# Passport-Osso

[Passport](http://passportjs.org/) strategy for authenticating SAML based SSO users with an [Osso](https://ossoapp.com/)
isntance using the OAuth 2.0 API.

This module lets you authenticate using Osso in your Node.js applications.
By plugging into Passport, Osso authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-osso

## Usage

### Configure Strategy

The Osso authentication strategy authenticates users using a Osso account
and OAuth 2.0 tokens. The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

```javascript
const OssoStrategy = require('passport-osso').Strategy;

passport.use(
  new OssoStrategy(
    {
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

app.get(
  '/auth/osso/callback',
  passport.authenticate('osso', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
```

### Using scopes

Depending on the data you want to fetch, you may want to specify custom scopes. For more information about scopes in the Osso Web API check [their developer site](https://developer.osso.com/web-api/using-scopes/).

By default, no scope is passed. That means that you won't fetch information such as display name, picture or email. You can get those by using these scopes:

- `user-read-email`: Returns the email address of the user on Osso, if it exists.
- `user-read-private`: Returns private information about the user such as display name and picture, if they are set.

You can specify the parameters in the `authenticate` call:

```javascript
app.get(
  '/auth/osso',
  passport.authenticate('osso', {
    scope: ['user-read-email', 'user-read-private']
  }),
  function(req, res) {
    // The request will be redirected to osso for authentication, so this
    // function will not be called.
  }
);
```

### Forcing login dialog

You can force the login dialog using the `showDialog` parameter when authenticating:

```javascript
app.get(
  '/auth/osso',
  passport.authenticate('osso', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to osso for authentication, so this
    // function will not be called.
  }
);
```

## Examples

For a complete, working example, refer to the [login example](https://github.com/jmperez/passport-osso/tree/master/examples/login).

You can get your keys on [Osso - My Applications](https://developer.osso.com/my-applications).

## Tests

    $ npm install --dev
    $ make test

## Build and Coverage Status

[![Build Status](https://travis-ci.org/JMPerez/passport-osso.svg?branch=master)](https://travis-ci.org/JMPerez/passport-osso) [![Coverage Status](https://coveralls.io/repos/JMPerez/passport-osso/badge.png?branch=master)](https://coveralls.io/r/JMPerez/passport-osso?branch=master)

## License

[The MIT License](http://opensource.org/licenses/MIT)

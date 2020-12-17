/**
 * Module dependencies.
 */
var util = require('util'),
  querystring = require('querystring'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Osso authentication strategy authenticates requests by delegating to
 * Osso using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `baseUrl`       the fully qualified base URL of your Osso instance
 *   - `clientID`      your Osso application's app key
 *   - `clientSecret`  your Osso application's app secret
 *   - `callbackURL`   URL to which Osso will redirect the user
 *                     after granting authorization
 *
 * Examples:
 *
 *     passport.use(new OssoStrategy({
 *         baseUrl: 'https://demo.ossoapp.com,
 *         clientID: 'demo-client-id',
 *         clientSecret: 'demo-client-secret'
 *         callbackURL: 'http://localhost:3000/auth/osso/callback'
 *       },
 *       function(accessToken, expiresIn, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  ['baseUrl', 'clientID', 'clientSecret', 'callbackURL'].forEach(function (k) {
    if (!options[k]) {
      throw new Error(
        'You must provide the ' +
          k +
          ' configuration value to use passport-osso.',
      );
    }
  });

  const baseUrl = options.baseUrl;

  options.authorizationURL = `${baseUrl}/oauth/authorize`;
  options.tokenURL = `${baseUrl}/oauth/token`;
  options.userInfoURL = `${baseUrl}/oauth/me`;

  OAuth2Strategy.call(this, options, verify);

  this.name = 'osso';
  this.options = options;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Return extra Osso-specific parameters to be included in the authorization
 * request. Optionally include either email OR domain. Failure to include either
 * will result in Osso displaying a hosted login page.
 *
 * Options:
 *  - `email` email address for the user wanting to sign in
 *  - `domain` corporate domain for the user wanting to sign in
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
  if (options.email) {
    return { email: options.email };
  }

  if (options.domain) {
    return { domain: options.domain };
  }

  return {};
};

/**
 * Retrieve user profile from Osso.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`               the user's Osso ID, unique
 *   - `idp`              the name of the Identity Provider the user authenticated against
 *   - `email`            the email address for the user in their IDP
 *   - `requested`        the domain or email included in the sign in request. may be different
 *                        from the email returned by IDP
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(
    this.options.userInfoURL,
    accessToken,
    function (err, body, res) {
      if (err) {
        return done(new Error('failed to fetch user profile', err));
      }

      try {
        const profile = JSON.parse(body);

        done(null, profile);
      } catch (e) {
        done(e);
      }
    },
  );
};

/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;

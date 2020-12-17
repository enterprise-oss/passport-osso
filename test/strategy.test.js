var should = require('should');
var sinon = require('sinon');
var OssoStrategy = require('../lib/passport-osso/strategy');

describe('OssoStrategy', function () {
  beforeEach(function () {
    this.strategy = new OssoStrategy(
      {
        baseUrl: 'https://test.ossoapp.com',
        clientID: 'testid',
        clientSecret: 'testsecret',
        callbackURL: '/callback',
      },
      function () {},
    );
  });

  it('should be named osso', function () {
    this.strategy.name.should.equal('osso');
  });

  describe('authorizationParams', function () {
    it('should map an email field', function () {
      var extraParams = this.strategy.authorizationParams({
        email: 'email@example.com',
      });
      extraParams.email.should.eql('email@example.com');
    });

    it('should map a domain field', function () {
      var extraParams = this.strategy.authorizationParams({
        domain: 'example.com',
      });
      extraParams.domain.should.eql('example.com');
    });
  });
});

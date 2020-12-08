"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _faunadb = require("faunadb");

var _crypto = require("crypto");

var _logger = _interopRequireDefault(require("../../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Adapter = function Adapter(config) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var {
    faunaClient
  } = config;

  function getAdapter(_x) {
    return _getAdapter.apply(this, arguments);
  }

  function _getAdapter() {
    _getAdapter = _asyncToGenerator(function* (appOptions) {
      function _debug(debugCode) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _logger.default.debug("fauna_".concat(debugCode), ...args);
      }

      var defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
      var sessionMaxAge = appOptions && appOptions.session && appOptions.session.maxAge ? appOptions.session.maxAge * 1000 : defaultSessionMaxAge;
      var sessionUpdateAge = appOptions && appOptions.session && appOptions.session.updateAge ? appOptions.session.updateAge * 1000 : 0;

      function createUser(_x2) {
        return _createUser.apply(this, arguments);
      }

      function _createUser() {
        _createUser = _asyncToGenerator(function* (profile) {
          _debug('createUser', profile);

          var timestamp = new Date().toISOString();

          var FQL = _faunadb.query.Create(_faunadb.query.Collection('user'), {
            data: {
              name: profile.name,
              email: profile.email,
              image: profile.image,
              emailVerified: profile.emailVerified ? profile.emailVerified : false,
              createdAt: _faunadb.query.Time(timestamp),
              updatedAt: _faunadb.query.Time(timestamp)
            }
          });

          try {
            var newUser = yield faunaClient.query(FQL);
            newUser.data.id = newUser.ref.id;
            return newUser.data;
          } catch (error) {
            console.error('CREATE_USER', error);
            return Promise.reject(new Error('CREATE_USER'));
          }
        });
        return _createUser.apply(this, arguments);
      }

      function getUser(_x3) {
        return _getUser.apply(this, arguments);
      }

      function _getUser() {
        _getUser = _asyncToGenerator(function* (id) {
          _debug('getUser', id);

          var FQL = _faunadb.query.Get(_faunadb.query.Ref(_faunadb.query.Collection('user'), id));

          try {
            var user = yield faunaClient.query(FQL);
            user.data.id = user.ref.id;
            return user.data;
          } catch (error) {
            console.error('GET_USER', error);
            return Promise.reject(new Error('GET_USER'));
          }
        });
        return _getUser.apply(this, arguments);
      }

      function getUserByEmail(_x4) {
        return _getUserByEmail.apply(this, arguments);
      }

      function _getUserByEmail() {
        _getUserByEmail = _asyncToGenerator(function* (email) {
          _debug('getUserByEmail', email);

          if (!email) {
            return null;
          }

          var FQL = _faunadb.query.Let({
            ref: _faunadb.query.Match(_faunadb.query.Index('user_by_email'), email)
          }, _faunadb.query.If(_faunadb.query.Exists(_faunadb.query.Var('ref')), _faunadb.query.Get(_faunadb.query.Var('ref')), null));

          try {
            var user = yield faunaClient.query(FQL);

            if (user == null) {
              return null;
            }

            user.data.id = user.ref.id;
            return user.data;
          } catch (error) {
            console.error('GET_USER_BY_EMAIL', error);
            return Promise.reject(new Error('GET_USER_BY_EMAIL'));
          }
        });
        return _getUserByEmail.apply(this, arguments);
      }

      function getUserByProviderAccountId(_x5, _x6) {
        return _getUserByProviderAccountId.apply(this, arguments);
      }

      function _getUserByProviderAccountId() {
        _getUserByProviderAccountId = _asyncToGenerator(function* (providerId, providerAccountId) {
          _debug('getUserByProviderAccountId', providerId, providerAccountId);

          var FQL = _faunadb.query.Let({
            ref: _faunadb.query.Match(_faunadb.query.Index('account_by_provider_account_id'), [providerId, providerAccountId])
          }, _faunadb.query.If(_faunadb.query.Exists(_faunadb.query.Var('ref')), _faunadb.query.Get(_faunadb.query.Ref(_faunadb.query.Collection('user'), _faunadb.query.Select(['data', 'userId'], _faunadb.query.Get(_faunadb.query.Var('ref'))))), null));

          try {
            var user = yield faunaClient.query(FQL);

            if (user == null) {
              return null;
            }

            user.data.id = user.ref.id;
            return user.data;
          } catch (error) {
            console.error('GET_USER_BY_PROVIDER_ACCOUNT_ID', error);
            return Promise.reject(new Error('GET_USER_BY_PROVIDER_ACCOUNT_ID'));
          }
        });
        return _getUserByProviderAccountId.apply(this, arguments);
      }

      function updateUser(_x7) {
        return _updateUser.apply(this, arguments);
      }

      function _updateUser() {
        _updateUser = _asyncToGenerator(function* (user) {
          _debug('updateUser', user);

          var timestamp = new Date().toISOString();

          var FQL = _faunadb.query.Update(_faunadb.query.Ref(_faunadb.query.Collection('user'), user.id), {
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: user.emailVerified ? user.emailVerified : false,
              updatedAt: _faunadb.query.Time(timestamp)
            }
          });

          try {
            var _user = yield faunaClient.query(FQL);

            _user.data.id = _user.ref.id;
            return _user.data;
          } catch (error) {
            console.error('UPDATE_USER_ERROR', error);
            return Promise.reject(new Error('UPDATE_USER_ERROR'));
          }
        });
        return _updateUser.apply(this, arguments);
      }

      function deleteUser(_x8) {
        return _deleteUser.apply(this, arguments);
      }

      function _deleteUser() {
        _deleteUser = _asyncToGenerator(function* (userId) {
          _debug('deleteUser', userId);

          var FQL = _faunadb.query.Delete(_faunadb.query.Ref(_faunadb.query.Collection('user'), userId));

          try {
            yield faunaClient.query(FQL);
          } catch (error) {
            console.error('DELETE_USER_ERROR', error);
            return Promise.reject(new Error('DELETE_USER_ERROR'));
          }
        });
        return _deleteUser.apply(this, arguments);
      }

      function linkAccount(_x9, _x10, _x11, _x12, _x13, _x14, _x15) {
        return _linkAccount.apply(this, arguments);
      }

      function _linkAccount() {
        _linkAccount = _asyncToGenerator(function* (userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
          _debug('linkAccount', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires);

          try {
            var timestamp = new Date().toISOString();
            var account = yield faunaClient.query(_faunadb.query.Create(_faunadb.query.Collection('account'), {
              data: {
                userId: userId,
                providerId: providerId,
                providerType: providerType,
                providerAccountId: providerAccountId,
                refreshToken: refreshToken,
                accessToken: accessToken,
                accessTokenExpires: accessTokenExpires,
                createdAt: _faunadb.query.Time(timestamp),
                updatedAt: _faunadb.query.Time(timestamp)
              }
            }));
            return account.data;
          } catch (error) {
            console.error('LINK_ACCOUNT_ERROR', error);
            return Promise.reject(new Error('LINK_ACCOUNT_ERROR'));
          }
        });
        return _linkAccount.apply(this, arguments);
      }

      function unlinkAccount(_x16, _x17, _x18) {
        return _unlinkAccount.apply(this, arguments);
      }

      function _unlinkAccount() {
        _unlinkAccount = _asyncToGenerator(function* (userId, providerId, providerAccountId) {
          _debug('unlinkAccount', userId, providerId, providerAccountId);

          var FQL = _faunadb.query.Delete(_faunadb.query.Select('ref', _faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index('account_by_provider_account_id'), [providerId, providerAccountId]))));

          try {
            yield faunaClient.query(FQL);
          } catch (error) {
            console.error('UNLINK_ACCOUNT_ERROR', error);
            return Promise.reject(new Error('UNLINK_ACCOUNT_ERROR'));
          }
        });
        return _unlinkAccount.apply(this, arguments);
      }

      function createSession(_x19) {
        return _createSession.apply(this, arguments);
      }

      function _createSession() {
        _createSession = _asyncToGenerator(function* (user) {
          _debug('createSession', user);

          var expires = null;

          if (sessionMaxAge) {
            var dateExpires = new Date();
            dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
            expires = dateExpires.toISOString();
          }

          var timestamp = new Date().toISOString();

          var FQL = _faunadb.query.Create(_faunadb.query.Collection('session'), {
            data: {
              userId: user.id,
              expires: _faunadb.query.Time(expires),
              sessionToken: (0, _crypto.randomBytes)(32).toString('hex'),
              accessToken: (0, _crypto.randomBytes)(32).toString('hex'),
              createdAt: _faunadb.query.Time(timestamp),
              updatedAt: _faunadb.query.Time(timestamp)
            }
          });

          try {
            var session = yield faunaClient.query(FQL);
            session.data.id = session.ref.id;
            return session.data;
          } catch (error) {
            console.error('CREATE_SESSION_ERROR', error);
            return Promise.reject(new Error('CREATE_SESSION_ERROR'));
          }
        });
        return _createSession.apply(this, arguments);
      }

      function getSession(_x20) {
        return _getSession.apply(this, arguments);
      }

      function _getSession() {
        _getSession = _asyncToGenerator(function* (sessionToken) {
          _debug('getSession', sessionToken);

          try {
            var session = yield faunaClient.query(_faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index('session_by_token'), sessionToken)));

            if (session && session.expires && new Date() > session.expires) {
              yield _deleteSession(sessionToken);
              return null;
            }

            session.data.id = session.ref.id;
            return session.data;
          } catch (error) {
            console.error('GET_SESSION_ERROR', error);
            return Promise.reject(new Error('GET_SESSION_ERROR'));
          }
        });
        return _getSession.apply(this, arguments);
      }

      function updateSession(_x21, _x22) {
        return _updateSession.apply(this, arguments);
      }

      function _updateSession() {
        _updateSession = _asyncToGenerator(function* (session, force) {
          _debug('updateSession', session);

          try {
            var shouldUpdate = sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires;

            if (!shouldUpdate && !force) {
              return null;
            }

            var dateSessionIsDueToBeUpdated = new Date(session.expires);
            dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge);
            dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge);
            var currentDate = new Date();

            if (currentDate < dateSessionIsDueToBeUpdated && !force) {
              return null;
            }

            var newExpiryDate = new Date();
            newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge);
            var updatedSession = yield faunaClient.query(_faunadb.query.Update(_faunadb.query.Ref(_faunadb.query.Collection('session'), session.id), {
              data: {
                expires: _faunadb.query.Time(newExpiryDate.toISOString()),
                updatedAt: _faunadb.query.Time(new Date().toISOString())
              }
            }));
            updatedSession.data.id = updatedSession.ref.id;
            return updatedSession.data;
          } catch (error) {
            console.error('UPDATE_SESSION_ERROR', error);
            return Promise.reject(new Error('UPDATE_SESSION_ERROR'));
          }
        });
        return _updateSession.apply(this, arguments);
      }

      function _deleteSession(_x23) {
        return _deleteSession2.apply(this, arguments);
      }

      function _deleteSession2() {
        _deleteSession2 = _asyncToGenerator(function* (sessionToken) {
          var FQL = _faunadb.query.Delete(_faunadb.query.Select('ref', _faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index('session_by_token'), sessionToken))));

          return faunaClient.query(FQL);
        });
        return _deleteSession2.apply(this, arguments);
      }

      function deleteSession(_x24) {
        return _deleteSession3.apply(this, arguments);
      }

      function _deleteSession3() {
        _deleteSession3 = _asyncToGenerator(function* (sessionToken) {
          _debug('deleteSession', sessionToken);

          try {
            return yield _deleteSession(sessionToken);
          } catch (error) {
            console.error('DELETE_SESSION_ERROR', error);
            return Promise.reject(new Error('DELETE_SESSION_ERROR'));
          }
        });
        return _deleteSession3.apply(this, arguments);
      }

      function createVerificationRequest(_x25, _x26, _x27, _x28, _x29) {
        return _createVerificationRequest.apply(this, arguments);
      }

      function _createVerificationRequest() {
        _createVerificationRequest = _asyncToGenerator(function* (identifier, url, token, secret, provider) {
          _debug('createVerificationRequest', identifier);

          var {
            baseUrl
          } = appOptions;
          var {
            sendVerificationRequest,
            maxAge
          } = provider;
          var hashedToken = (0, _crypto.createHash)('sha256').update("".concat(token).concat(secret)).digest('hex');
          var expires = null;

          if (maxAge) {
            var dateExpires = new Date();
            dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
            expires = dateExpires.toISOString();
          }

          var timestamp = new Date().toISOString();

          var FQL = _faunadb.query.Create(_faunadb.query.Collection('verification_request'), {
            data: {
              identifier: identifier,
              token: hashedToken,
              expires: expires === null ? null : _faunadb.query.Time(expires),
              createdAt: _faunadb.query.Time(timestamp),
              updatedAt: _faunadb.query.Time(timestamp)
            }
          });

          try {
            var verificationRequest = yield faunaClient.query(FQL);
            yield sendVerificationRequest({
              identifier,
              url,
              token,
              baseUrl,
              provider
            });
            return verificationRequest.data;
          } catch (error) {
            console.error('CREATE_VERIFICATION_REQUEST_ERROR', error);
            return Promise.reject(new Error('CREATE_VERIFICATION_REQUEST_ERROR'));
          }
        });
        return _createVerificationRequest.apply(this, arguments);
      }

      function getVerificationRequest(_x30, _x31, _x32, _x33) {
        return _getVerificationRequest.apply(this, arguments);
      }

      function _getVerificationRequest() {
        _getVerificationRequest = _asyncToGenerator(function* (identifier, token, secret, provider) {
          _debug('getVerificationRequest', identifier, token);

          var hashedToken = (0, _crypto.createHash)('sha256').update("".concat(token).concat(secret)).digest('hex');

          var FQL = _faunadb.query.Let({
            ref: _faunadb.query.Match(_faunadb.query.Index('vertification_request_by_token'), hashedToken)
          }, _faunadb.query.If(_faunadb.query.Exists(_faunadb.query.Var('ref')), {
            ref: _faunadb.query.Var('ref'),
            request: _faunadb.query.Select('data', _faunadb.query.Get(_faunadb.query.Var('ref')))
          }, null));

          try {
            var {
              ref,
              request: verificationRequest
            } = yield faunaClient.query(FQL);
            var nowDate = Date.now();

            if (verificationRequest && verificationRequest.expires && verificationRequest.expires < nowDate) {
              yield faunaClient.query(_faunadb.query.Delete(ref));
              return null;
            }

            return verificationRequest;
          } catch (error) {
            console.error('GET_VERIFICATION_REQUEST_ERROR', error);
            return Promise.reject(new Error('GET_VERIFICATION_REQUEST_ERROR'));
          }
        });
        return _getVerificationRequest.apply(this, arguments);
      }

      function deleteVerificationRequest(_x34, _x35, _x36, _x37) {
        return _deleteVerificationRequest.apply(this, arguments);
      }

      function _deleteVerificationRequest() {
        _deleteVerificationRequest = _asyncToGenerator(function* (identifier, token, secret, provider) {
          _debug('deleteVerification', identifier, token);

          var hashedToken = (0, _crypto.createHash)('sha256').update("".concat(token).concat(secret)).digest('hex');

          var FQL = _faunadb.query.Delete(_faunadb.query.Select('ref', _faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index('vertification_request_by_token'), hashedToken))));

          try {
            yield faunaClient.query(FQL);
          } catch (error) {
            console.error('DELETE_VERIFICATION_REQUEST_ERROR', error);
            return Promise.reject(new Error('DELETE_VERIFICATION_REQUEST_ERROR'));
          }
        });
        return _deleteVerificationRequest.apply(this, arguments);
      }

      return Promise.resolve({
        createUser,
        getUser,
        getUserByEmail,
        getUserByProviderAccountId,
        updateUser,
        deleteUser,
        linkAccount,
        unlinkAccount,
        createSession,
        getSession,
        updateSession,
        deleteSession,
        createVerificationRequest,
        getVerificationRequest,
        deleteVerificationRequest
      });
    });
    return _getAdapter.apply(this, arguments);
  }

  return {
    getAdapter
  };
};

var _default = {
  Adapter
};
exports.default = _default;
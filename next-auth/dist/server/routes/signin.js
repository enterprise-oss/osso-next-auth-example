"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _oauth = _interopRequireDefault(require("../lib/signin/oauth"));

var _email = _interopRequireDefault(require("../lib/signin/email"));

var _logger = _interopRequireDefault(require("../../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function () {
  var _ref = _asyncToGenerator(function* (req, res, options, done) {
    var {
      provider: providerName,
      providers,
      baseUrl,
      basePath,
      adapter,
      callbacks,
      csrfToken,
      redirect
    } = options;
    var provider = providers[providerName];
    var {
      type
    } = provider;

    if (!type) {
      res.status(500).end("Error: Type not specified for ".concat(provider));
      return done();
    }

    if (type === 'oauth' && req.method === 'POST') {
      var authParams = _objectSpread({}, req.query);

      delete authParams.nextauth;
      (0, _oauth.default)(provider, csrfToken, (error, oAuthSigninUrl) => {
        if (error) {
          _logger.default.error('SIGNIN_OAUTH_ERROR', error);

          return redirect("".concat(baseUrl).concat(basePath, "/error?error=OAuthSignin"));
        }

        return redirect(oAuthSigninUrl);
      }, authParams);
    } else if (type === 'email' && req.method === 'POST') {
      if (!adapter) {
        _logger.default.error('EMAIL_REQUIRES_ADAPTER_ERROR');

        return redirect("".concat(baseUrl).concat(basePath, "/error?error=Configuration"));
      }

      var {
        getUserByEmail
      } = yield adapter.getAdapter(options);
      var email = req.body.email ? req.body.email.toLowerCase() : null;
      var profile = (yield getUserByEmail(email)) || {
        email
      };
      var account = {
        id: provider.id,
        type: 'email',
        providerAccountId: email
      };

      try {
        var signinCallbackResponse = yield callbacks.signIn(profile, account, {
          email,
          verificationRequest: true
        });

        if (signinCallbackResponse === false) {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=AccessDenied"));
        }
      } catch (error) {
        if (error instanceof Error) {
          return redirect("".concat(baseUrl).concat(basePath, "/error?error=").concat(encodeURIComponent(error)));
        } else {
          return redirect(error);
        }
      }

      try {
        yield (0, _email.default)(email, provider, options);
      } catch (error) {
        _logger.default.error('SIGNIN_EMAIL_ERROR', error);

        return redirect("".concat(baseUrl).concat(basePath, "/error?error=EmailSignin"));
      }

      return redirect("".concat(baseUrl).concat(basePath, "/verify-request?provider=").concat(encodeURIComponent(provider.id), "&type=").concat(encodeURIComponent(provider.type)));
    } else {
      return redirect("".concat(baseUrl).concat(basePath, "/signin"));
    }
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;
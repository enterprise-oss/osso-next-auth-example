"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _client = _interopRequireDefault(require("../oauth/client"));

var _crypto = require("crypto");

var _logger = _interopRequireDefault(require("../../../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = (provider, csrfToken, callback, authParams) => {
  var {
    callbackUrl
  } = provider;
  var client = (0, _client.default)(provider);

  if (provider.version && provider.version.startsWith('2.')) {
    var url = client.getAuthorizeUrl(_objectSpread(_objectSpread({}, authParams), {}, {
      redirect_uri: provider.callbackUrl,
      scope: provider.scope,
      state: (0, _crypto.createHash)('sha256').update(csrfToken).digest('hex')
    }));

    if (provider.authorizationUrl.includes('?')) {
      var parseUrl = new URL(provider.authorizationUrl);
      var baseUrl = "".concat(parseUrl.origin).concat(parseUrl.pathname, "?");
      url = url.replace(baseUrl, provider.authorizationUrl + '&');
    }

    callback(null, url);
  } else {
    client.getOAuthRequestToken((error, oAuthToken) => {
      if (error) {
        _logger.default.error('GET_AUTHORISATION_URL_ERROR', error);
      }

      var url = "".concat(provider.authorizationUrl, "?oauth_token=").concat(oAuthToken);
      callback(error, url);
    }, callbackUrl);
  }
};

exports.default = _default;
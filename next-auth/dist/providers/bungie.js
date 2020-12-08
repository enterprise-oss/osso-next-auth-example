"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = options => {
  return _objectSpread({
    id: 'bungie',
    name: 'Bungie',
    type: 'oauth',
    version: '2.0',
    scope: '',
    params: {
      reauth: 'true',
      grant_type: 'authorization_code'
    },
    accessTokenUrl: 'https://www.bungie.net/platform/app/oauth/token/',
    requestTokenUrl: 'https://www.bungie.net/platform/app/oauth/token/',
    authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize?response_type=code',
    profileUrl: 'https://www.bungie.net/platform/User/GetBungieAccount/{membershipId}/254/',
    prepareProfileRequest: (_ref) => {
      var {
        provider,
        url,
        headers,
        results
      } = _ref;

      if (!results.membership_id) {
        throw new Error('Expected membership_id to be passed.');
      }

      if (!provider.apiKey) {
        throw new Error('The Bungie provider requires the apiKey option to be present.');
      }

      headers['X-API-Key'] = provider.apiKey;
      url = url.replace('{membershipId}', results.membership_id);
      return url;
    },
    profile: _profile => {
      var {
        bungieNetUser: user
      } = _profile.Response;
      return {
        id: user.membershipId,
        name: user.displayName,
        image: "https://www.bungie.net".concat(user.profilePicturePath.startsWith('/') ? '' : '/').concat(user.profilePicturePath),
        email: null
      };
    },
    apiKey: null,
    clientId: null,
    clientSecret: null
  }, options);
};

exports.default = _default;
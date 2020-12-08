"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = options => {
  var tenant = options.tenantId ? options.tenantId : 'common';
  return _objectSpread({
    id: 'azure-ad-b2c',
    name: 'Azure Active Directory B2C',
    type: 'oauth',
    version: '2.0',
    params: {
      grant_type: 'authorization_code'
    },
    accessTokenUrl: "https://login.microsoftonline.com/".concat(tenant, "/oauth2/v2.0/token"),
    authorizationUrl: "https://login.microsoftonline.com/".concat(tenant, "/oauth2/v2.0/authorize?response_type=code&response_mode=query"),
    profileUrl: 'https://graph.microsoft.com/v1.0/me/',
    profile: _profile => {
      return {
        id: _profile.id,
        name: _profile.displayName,
        email: _profile.userPrincipalName
      };
    }
  }, options);
};

exports.default = _default;
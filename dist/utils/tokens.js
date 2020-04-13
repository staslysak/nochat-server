"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshTokens = exports.createValidationToken = exports.createTokens = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const createTokens = async (_ref) => {
  let {
    id,
    password
  } = _ref;

  const token = _jsonwebtoken.default.sign({
    user: {
      id
    }
  }, _config.default.TOKEN_SECRET, {
    expiresIn: _config.default.TOKEN_EXPIRETION
  });

  const refreshToken = _jsonwebtoken.default.sign({
    user: {
      id
    }
  }, password + _config.default.REFRESH_TOKEN_SECRET, {
    expiresIn: _config.default.REFRESH_TOKEN_EXPIRETION
  });

  return {
    token,
    refreshToken
  };
};

exports.createTokens = createTokens;

const createValidationToken = secret => _jsonwebtoken.default.sign({
  secret
}, _config.default.TOKEN_SECRET, {
  expiresIn: _config.default.REFRESH_TOKEN_EXPIRETION
}); // '1h'


exports.createValidationToken = createValidationToken;

const refreshTokens = async (refreshToken, models) => {
  let userId = -1;

  try {
    const {
      user: {
        id
      }
    } = _jsonwebtoken.default.decode(refreshToken);

    userId = id;
    if (!userId) return {};
    const user = await models.user.findByPk(userId, {
      raw: true
    });
    if (!user) return {};

    _jsonwebtoken.default.verify(refreshToken, user.password + _config.default.REFRESH_TOKEN_SECRET);

    const tokens = await createTokens(user);
    return _objectSpread({
      user
    }, tokens);
  } catch (error) {
    return {};
  }
};

exports.refreshTokens = refreshTokens;
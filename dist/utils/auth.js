"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyUser = exports.tryLogin = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

var _apolloServer = require("apollo-server");

var _tokens = require("./tokens");

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const tryLogin = async (username, password, models) => {
  const user = await models.user.findOne({
    where: {
      username
    }
  }, {
    raw: true
  });

  if (!user) {
    throw new _apolloServer.UserInputError("Validation Error", {
      validationErrors: {
        username: "User with this username doesn't exist"
      }
    });
  }

  const match = await models.user.comparePassword(password, user.password);

  if (!match) {
    throw new _apolloServer.UserInputError("Validation Error", {
      validationErrors: {
        password: "Credantials doesn't match"
      }
    });
  }

  const tokens = await (0, _tokens.createTokens)(user);
  return _objectSpread({
    user
  }, tokens);
};

exports.tryLogin = tryLogin;

const verifyUser = async (token, models) => {
  try {
    _jsonwebtoken.default.verify(token, _config.default.TOKEN_SECRET);

    const {
      secret
    } = _jsonwebtoken.default.decode(token);

    if (!secret) throw new _apolloServer.AuthenticationError("Invalid Token");
    const user = await models.user.update({
      status: _constants.STATUS.ACTIVE
    }, {
      where: {
        shortCode: secret
      },
      returning: true,
      plain: true
    });
    if (!user) throw new _apolloServer.AuthenticationError("Invalid Token");
    const tokens = await (0, _tokens.createTokens)(user[1]);
    return _objectSpread({
      user: user[1]
    }, tokens);
  } catch (error) {
    throw new _apolloServer.AuthenticationError("Invalid Token");
  }
};

exports.verifyUser = verifyUser;
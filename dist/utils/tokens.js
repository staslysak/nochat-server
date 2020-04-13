"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshTokens = exports.createValidationToken = exports.createTokens = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTokens = async ({
  id,
  password
}) => {
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
    return {
      user,
      ...tokens
    };
  } catch (error) {
    return {};
  }
};

exports.refreshTokens = refreshTokens;
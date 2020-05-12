"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyRefreshToken = verifyRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.refreshTokens = exports.createValidationToken = exports.createTokens = exports.extractTokens = exports.decodeToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

const decodeToken = token => {
  return _jsonwebtoken.default.decode(token);
};

exports.decodeToken = decodeToken;

const jwtVerify = (token, secret) => _jsonwebtoken.default.verify(token, secret, function (err, decoded) {
  if (err) return {};
  return decoded;
});

async function verifyRefreshToken(token, password) {
  const {
    secret
  } = _config.default.refreshToken;
  return jwtVerify(token, secret); // + password
}

async function verifyAccessToken(token) {
  const {
    secret
  } = _config.default.accessToken;
  return jwtVerify(token, secret);
}

const extractTokens = tokens => {
  if (tokens.authorization) {
    return tokens.authorization;
  }

  return null;
};

exports.extractTokens = extractTokens;

const createTokens = async ({
  id,
  password
}) => {
  const payload = {
    user: {
      id
    }
  };

  const accessToken = _jsonwebtoken.default.sign(payload, _config.default.accessToken.secret, _config.default.accessToken.options);

  const refreshToken = _jsonwebtoken.default.sign(payload, _config.default.refreshToken.secret, //  + password,
  _config.default.refreshToken.options);

  return {
    accessToken,
    refreshToken
  };
};

exports.createTokens = createTokens;

const createValidationToken = secret => _jsonwebtoken.default.sign({
  secret
}, _config.default.accessToken.secret, _config.default.accessToken.options);

exports.createValidationToken = createValidationToken;

const refreshTokens = async (refreshToken, db) => {
  const {
    user
  } = _jsonwebtoken.default.decode(refreshToken);

  if (!(user === null || user === void 0 ? void 0 : user.id)) return {};
  return await db.user.findByPk(user.id, {
    raw: true
  }).then(user => {
    if (!user) {
      throw new Error("Invalid Token");
    }

    return user;
  }).then(async user => {
    await verifyRefreshToken(refreshToken); // +user.password;

    return user;
  }).then(async user => {
    const tokens = await createTokens(user);
    return {
      user,
      ...tokens
    };
  }).catch(() => {
    return {};
  });
};

exports.refreshTokens = refreshTokens;
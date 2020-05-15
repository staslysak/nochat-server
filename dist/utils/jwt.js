"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshTokens = exports.createVerificationToken = exports.createTokens = exports.extractTokens = exports.verifyAccessToken = exports.verifyRefreshToken = exports.decodeToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

const decodeToken = token => {
  return _jsonwebtoken.default.decode(token);
};

exports.decodeToken = decodeToken;

const jwtVerify = (token, secret) => {
  return new Promise((resolve, reject) => {
    _jsonwebtoken.default.verify(token, secret, (err, decoded) => err ? reject(err) : resolve(decoded));
  });
};

const createToken = (payload, secret, options) => {
  return _jsonwebtoken.default.sign(payload, secret, options);
};

const verifyRefreshToken = async (token, password) => {
  return jwtVerify(token, _config.default.refreshToken.secret); // + password
};

exports.verifyRefreshToken = verifyRefreshToken;

const verifyAccessToken = async token => {
  return jwtVerify(token, _config.default.accessToken.secret);
};

exports.verifyAccessToken = verifyAccessToken;

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
  const accessToken = createToken(payload, _config.default.accessToken.secret, _config.default.accessToken.options);
  const refreshToken = createToken(payload, _config.default.refreshToken.secret, //  + password,
  _config.default.refreshToken.options);
  return {
    accessToken,
    refreshToken
  };
};

exports.createTokens = createTokens;

const createVerificationToken = secret => {
  return createToken({
    secret
  }, _config.default.accessToken.secret, _config.default.accessToken.options);
};

exports.createVerificationToken = createVerificationToken;

const refreshTokens = async (refreshToken, db) => {
  const {
    user
  } = _jsonwebtoken.default.decode(refreshToken);

  if (!(user === null || user === void 0 ? void 0 : user.id)) return {};
  return await db.user.findByPk(user.id).then(async user => {
    if (user) {
      // refreshToken + user.password
      return await verifyRefreshToken(refreshToken).then(async ({
        user
      }) => {
        const tokens = await createTokens(user);
        return {
          user,
          ...tokens
        };
      });
    }

    throw new Error("Invalid Token");
  }).catch(() => {
    return {};
  });
};

exports.refreshTokens = refreshTokens;
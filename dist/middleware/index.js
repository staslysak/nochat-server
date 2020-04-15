"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addUserConnection = exports.addUser = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _utils = require("../utils");

var _config = _interopRequireDefault(require("../config"));

const addUser = models => async (req, res, next) => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      const {
        user
      } = _jsonwebtoken.default.verify(token, _config.default.TOKEN_SECRET);

      req.user = user;
    } catch (error) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await (0, _utils.refreshTokens)(refreshToken, models);

      if (newTokens.token && newTokens.refreshToken) {
        res.set({
          "Access-Control-Expose-Headers": "*",
          "x-refresh-token": newTokens.refreshToken,
          "x-token": newTokens.token
        });
      }

      req.user = newTokens.user || {};
    }
  }

  next();
};

exports.addUser = addUser;

const addUserConnection = async (connectionParams, models) => {
  const token = connectionParams["x-token"];

  if (token) {
    try {
      const {
        user
      } = _jsonwebtoken.default.verify(token, _config.default.TOKEN_SECRET);

      return user;
    } catch (error) {
      const refreshToken = connectionParams["x-refresh-token"];
      const newTokens = await (0, _utils.refreshTokens)(refreshToken, models); // if (newTokens.token && newTokens.refreshToken) {
      // }

      return newTokens.user || {};
    }
  }
};

exports.addUserConnection = addUserConnection;
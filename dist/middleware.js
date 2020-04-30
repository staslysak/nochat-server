"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMiddleware = void 0;

var _path = _interopRequireDefault(require("path"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _utils = require("./utils");

var _config = _interopRequireDefault(require("./config"));

const initMiddleware = (app, models) => {
  app.use((0, _cors.default)("*"));
  app.use(async (req, res, next) => {
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
  });
  app.use(_express.default.static(_path.default.join(__dirname, "../build")));
  app.get("/*", (_, res) => res.sendFile(_path.default.join(__dirname, "../build", "index.html")));
};

exports.initMiddleware = initMiddleware;
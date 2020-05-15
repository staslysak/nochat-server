"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMiddleware = void 0;

var _path = _interopRequireDefault(require("path"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _utils = require("./utils");

const initMiddleware = (app, db) => {
  app.use((0, _cors.default)("*"));
  app.use(async (req, __, next) => {
    const token = (0, _utils.extractTokens)(req.headers);

    if (token) {
      const user = await (0, _utils.verifyAccessToken)(token).then(({
        user
      }) => user).catch(() => null);
      req.user = user;
    }

    next();
  });
  app.use(_express.default.static(_path.default.join(__dirname, "../build")));
  app.get("/*", (_, res) => res.sendFile(_path.default.join(__dirname, "../build", "index.html")));
};

exports.initMiddleware = initMiddleware;
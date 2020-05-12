"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  shortCodeGen: true,
  avatarGen: true,
  formatErrors: true,
  getHost: true
};
exports.getHost = exports.formatErrors = exports.avatarGen = exports.shortCodeGen = void 0;

var _constants = require("./constants");

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _constants[key];
    }
  });
});

var _jwt = require("./jwt");

Object.keys(_jwt).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jwt[key];
    }
  });
});

var _auth = require("./auth");

Object.keys(_auth).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _auth[key];
    }
  });
});

const shortCodeGen = () => `${Math.floor(Math.random() * 1e5)}`;

exports.shortCodeGen = shortCodeGen;

const avatarGen = () => {
  const gradients = [...DEFAULT_AVATARS];
  const idx = Math.floor(Math.random() * gradients.length);
  return gradients[idx];
};

exports.avatarGen = avatarGen;

const formatErrors = (e, db) => {
  const validationErrors = {};

  if (e instanceof db.Sequelize.ValidationError) {
    e.errors.forEach(({
      path,
      message
    }) => validationErrors[path] = message);
  }

  return validationErrors;
};

exports.formatErrors = formatErrors;

const getHost = url => {
  const env = process.env.NODE_ENV || "development";

  if (env === "development") {
    return "http://localhost:3000/" + url;
  }

  if (env === "production") {
    return "http://localhost:8081/" + url;
  }

  return "/" + url;
};

exports.getHost = getHost;
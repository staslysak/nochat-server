"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHost = exports.formatErrors = exports.avatarGen = exports.shortCodeGen = void 0;

var _constants = require("./constants");

const shortCodeGen = () => `${Math.floor(Math.random() * 1e5)}`;

exports.shortCodeGen = shortCodeGen;

const avatarGen = () => {
  const gradients = _constants.DEFAULT_AVATARS;
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
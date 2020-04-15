"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _config = _interopRequireDefault(require("../config"));

module.exports = {
  development: {
    url: _config.default.DB_URL,
    dialect: "postgresql",
    define: {
      underscored: true
    },
    logging: false,
    benchmark: true
  },
  test: {
    username: "postgres",
    password: "admin",
    database: "postgres",
    host: "127.0.0.1",
    dialect: "postgresql",
    define: {
      underscored: true
    },
    logging: true,
    benchmark: true
  },
  production: {
    // url: config.DB_URL,
    url: "postgres://orojmxxt:xaRGbgVMLXdzzNoHzrNn9o6RpE9zyirc@drona.db.elephantsql.com:5432/orojmxxt",
    dialect: "postgresql",
    define: {
      underscored: true
    },
    logging: false,
    benchmark: false
  }
};
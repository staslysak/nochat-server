import config from "../config";

module.exports = {
  development: {
    url: config.DB_URL,
    dialect: "postgresql",
    define: {
      underscored: true,
    },
    logging: false,
    benchmark: true,
  },
  test: {
    username: "postgres",
    password: "admin",
    database: "postgres",
    host: "127.0.0.1",
    dialect: "postgresql",
    define: {
      underscored: true,
    },
    logging: true,
    benchmark: true,
  },
  production: {
    url: config.DB_URL,
    dialect: "postgresql",
    define: {
      underscored: true,
    },
    logging: false,
    benchmark: false,
  },
};

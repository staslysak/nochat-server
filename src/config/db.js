module.exports = {
  development: {
    username: "postgres",
    password: "admin",
    database: "postgres",
    host: "127.0.0.1",
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
  },
  production: {
    username: "postgres",
    password: "admin",
    database: "postgres",
    host: "127.0.0.1",
    dialect: "postgresql",
  },
};

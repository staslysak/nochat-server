require("dotenv").config();

// DB_URL=postgres://postgres:admin@127.0.0.1:5432/nochat
const {
  DB_URL = "postgres://postgres:admin@localhost:5432/postgres",
  SMTP_CLIENT_USER = "testuser@gmail.com",
  SMTP_CLIENT_PW = "password",
  PORT = 8081,
  REDIS_HOST = "127.0.0.1",
  REDIS_PORT = 6379,
} = process.env;

export default {
  PORT,
  DB_URL,
  REDIS_HOST,
  REDIS_PORT,
  TOKEN_EXPIRETION: "1m",
  REFRESH_TOKEN_EXPIRETION: "7d",
  TOKEN_SECRET: "tokensecret",
  REFRESH_TOKEN_SECRET: "refreshtokensecret",
  SMTP_CLIENT_USER,
  SMTP_CLIENT_PW,
};

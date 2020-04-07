require("dotenv").config();

const {
  DB_URL = "postgres://orojmxxt:xaRGbgVMLXdzzNoHzrNn9o6RpE9zyirc@drona.db.elephantsql.com:5432/orojmxxt",
  // DB_URL = "postgres://postgres:admin@localhost:5432/postgres",
  SMTP_CLIENT_USER,
  SMTP_CLIENT_PW,
  PORT = 8081,
} = process.env;

export default {
  PORT,
  DB_URL,
  TOKEN_EXPIRETION: "1m",
  REFRESH_TOKEN_EXPIRETION: "7d",
  TOKEN_SECRET: "tokensecret",
  REFRESH_TOKEN_SECRET: "refreshtokensecret",
  SMTP_CLIENT_USER,
  SMTP_CLIENT_PW,
};

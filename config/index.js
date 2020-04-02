require("dotenv").config();

const {
  DB_URL = "postgres://orojmxxt:xaRGbgVMLXdzzNoHzrNn9o6RpE9zyirc@drona.db.elephantsql.com:5432/orojmxxt",
  CLIENT_SMPT_EMAIL,
  CLIENT_SMPT_PW,
  PORT = 8081
} = process.env;

export default {
  PORT,
  DB_URL,
  TOKEN_EXPIRETION: "1m",
  REFRESH_TOKEN_EXPIRETION: "7d",
  TOKEN_SECRET: "tokensecret",
  REFRESH_TOKEN_SECRET: "refreshtokensecret",
  CLIENT_SMPT_EMAIL,
  CLIENT_SMPT_PW
};

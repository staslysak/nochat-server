import JWT from "jsonwebtoken";
import { refreshTokens } from "../utils";
import models from "../db/models";
import config from "../config";

export const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = JWT.verify(token, config.TOKEN_SECRET);
      req.user = user;
    } catch (error) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(refreshToken, models);
      if (newTokens.token && newTokens.refreshToken) {
        res.set({
          "Access-Control-Expose-Headers": "*",
          "x-refresh-token": newTokens.refreshToken,
          "x-token": newTokens.token,
        });
      }
      req.user = newTokens.user;
    }
  }
  next();
};

export const addUserConnection = async (headers) => {
  const token = headers["x-token"];
  if (token) {
    try {
      const { user } = JWT.verify(token, config.TOKEN_SECRET);
      return user;
    } catch (error) {
      const refreshToken = headers["x-refresh-token"];
      const newTokens = await refreshTokens(refreshToken, models);
      if (newTokens.token && newTokens.refreshToken) {
      }
      return newTokens.user;
    }
  }
};

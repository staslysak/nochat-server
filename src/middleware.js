import path from "path";
import cors from "cors";
import express from "express";
import { refreshTokens, extractTokens, verifyAccessToken } from "./utils";

export const initMiddleware = (app, models) => {
  app.use(cors("*"));

  app.use(async (req, res, next) => {
    const tokens = extractTokens(req.headers);

    if (tokens) {
      const { token, refreshToken } = tokens;
      try {
        const { user } = await verifyAccessToken(token);
        req.user = user;
      } catch (error) {
        const newTokens = await refreshTokens(refreshToken, models);
        if (newTokens.token && newTokens.refreshToken) {
          res.set({
            "Access-Control-Expose-Headers": "*",
            "x-refresh-token": newTokens.refreshToken,
            "x-token": newTokens.token,
          });
        }
        req.user = newTokens.user || {};
      }
    }
    next();
  });

  app.use(express.static(path.join(__dirname, "../build")));

  app.get("/*", (_, res) =>
    res.sendFile(path.join(__dirname, "../build", "index.html"))
  );
};

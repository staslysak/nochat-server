import path from "path";
import cors from "cors";
import express from "express";
import { extractTokens, verifyAccessToken } from "./utils";

export const initMiddleware = (app, db) => {
  app.use(cors("*"));

  app.use(async (req, __, next) => {
    const token = extractTokens(req.headers);
    if (token) {
      const user = await verifyAccessToken(token)
        .then(({ user }) => user)
        .catch(() => null);

      req.user = user;
    }

    next();
  });

  app.use(express.static(path.join(__dirname, "../build")));

  app.get("/*", (_, res) =>
    res.sendFile(path.join(__dirname, "../build", "index.html"))
  );
};

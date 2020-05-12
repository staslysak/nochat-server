import jwt from "jsonwebtoken";
import config from "../config";

export const decodeToken = (token) => {
  return jwt.decode(token);
};

const jwtVerify = (token, secret) =>
  jwt.verify(token, secret, function (err, decoded) {
    if (err) return {};
    return decoded;
  });

export async function verifyRefreshToken(token, password) {
  const { secret } = config.refreshToken;
  return jwtVerify(token, secret); // + password
}

export async function verifyAccessToken(token) {
  const { secret } = config.accessToken;
  return jwtVerify(token, secret);
}

export const extractTokens = (tokens) => {
  if (tokens.authorization) {
    return tokens.authorization;
  }
  return null;
};

export const createTokens = async ({ id, password }) => {
  const payload = { user: { id } };

  const accessToken = jwt.sign(
    payload,
    config.accessToken.secret,
    config.accessToken.options
  );

  const refreshToken = jwt.sign(
    payload,
    config.refreshToken.secret, //  + password,
    config.refreshToken.options
  );

  return { accessToken, refreshToken };
};

export const createValidationToken = (secret) =>
  jwt.sign({ secret }, config.accessToken.secret, config.accessToken.options);

export const refreshTokens = async (refreshToken, db) => {
  const { user } = jwt.decode(refreshToken);

  if (!user?.id) return {};

  return await db.user
    .findByPk(user.id, { raw: true })
    .then((user) => {
      if (!user) {
        throw new Error("Invalid Token");
      }
      return user;
    })
    .then(async (user) => {
      await verifyRefreshToken(refreshToken); // +user.password;
      return user;
    })
    .then(async (user) => {
      const tokens = await createTokens(user);
      return { user, ...tokens };
    })
    .catch(() => {
      return {};
    });
};

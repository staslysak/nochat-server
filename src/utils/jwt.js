import jwt from "jsonwebtoken";
import config from "../config";

export async function verifyRefreshToken(token, password) {
  const { secret } = config.refreshToken;
  return jwt.verify(token, secret + password);
}

export async function verifyAccessToken(token) {
  const { secret } = config.accessToken;
  return jwt.verify(token, secret);
}

export const extractTokens = (tokens) => {
  if (tokens["x-token"] || tokens["x-refresh-token"]) {
    return {
      token: tokens["x-token"],
      refreshToken: tokens["x-refresh-token"],
    };
  }
  return null;
};

export const createTokens = async ({ id, password }) => {
  const payload = { user: { id } };

  const token = jwt.sign(
    payload,
    config.accessToken.secret,
    config.accessToken.options
  );

  const refreshToken = jwt.sign(
    payload,
    config.refreshToken.secret + password,
    config.refreshToken.options
  );

  return { token, refreshToken };
};

export const createValidationToken = (secret) =>
  jwt.sign({ secret }, config.accessToken.secret, config.accessToken.options);

export const refreshTokens = async (refreshToken, models) => {
  try {
    const {
      user: { id: userId },
    } = jwt.decode(refreshToken);

    if (!userId) return {};

    const user = await models.user.findByPk(userId, { raw: true });

    if (!user) return {};

    verifyRefreshToken(refreshToken, user.password);

    const tokens = await createTokens(user);

    return {
      user,
      ...tokens,
    };
  } catch (error) {
    return {};
  }
};

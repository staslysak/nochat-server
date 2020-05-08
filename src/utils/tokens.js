import JWT from "jsonwebtoken";
import config from "../config";
const { accessToken: accessOptions, refreshToken: refreshOptions } = config;

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

  const token = JWT.sign(payload, accessOptions.secret, accessOptions.options);

  const refreshToken = JWT.sign(
    payload,
    refreshOptions.secret + password,
    refreshOptions.options
  );

  return { token, refreshToken };
};

export const createValidationToken = (secret) =>
  JWT.sign({ secret }, accessOptions.secret, accessOptions.options);

export const refreshTokens = async (refreshToken, models) => {
  let userId = -1;
  try {
    const {
      user: { id },
    } = JWT.decode(refreshToken);
    userId = id;

    if (!userId) return {};

    const user = await models.user.findByPk(userId, { raw: true });

    if (!user) return {};

    JWT.verify(refreshToken, refreshOptions.secret + user.password);

    const tokens = await createTokens(user);

    return {
      user,
      ...tokens,
    };
  } catch (error) {
    return {};
  }
};

import JWT from "jsonwebtoken";
import config from "../config";

export const createTokens = async user => {
  const token = JWT.sign({ user: { id: user.id } }, config.TOKEN_SECRET, {
    expiresIn: config.TOKEN_EXPIRETION
  });

  const refreshToken = JWT.sign(
    { user: { id: user.id } },
    user.password + config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRETION }
  );

  return { token, refreshToken };
};

export const createValidationToken = secret =>
  JWT.sign({ secret }, config.TOKEN_SECRET, { expiresIn: "1h" });

export const refreshTokens = async (token, refreshToken, models) => {
  let userId = -1;
  try {
    const {
      user: { id }
    } = JWT.decode(refreshToken);
    userId = id;

    if (!userId) return {};

    const user = await models.User.findOne({ where: { id: userId }, raw: true });

    if (!user) return {};

    JWT.verify(refreshToken, user.password + config.REFRESH_TOKEN_SECRET);

    const tokens = await createTokens(user);
    return {
      user,
      ...tokens
    };
  } catch (error) {
    return {};
  }
};

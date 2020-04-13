import JWT from "jsonwebtoken";
import config from "../config";
import { UserInputError, AuthenticationError } from "apollo-server";
import { createTokens } from "./tokens";
import { STATUS } from "../constants";

export const tryLogin = async (username, password, models) => {
  const user = await models.user.findOne(
    { where: { username } },
    { raw: true }
  );

  if (!user) {
    throw new UserInputError("Validation Error", {
      validationErrors: {
        username: "User with this username doesn't exist",
      },
    });
  }

  const match = await models.user.comparePassword(password, user.password);
  if (!match) {
    throw new UserInputError("Validation Error", {
      validationErrors: {
        password: "Credantials doesn't match",
      },
    });
  }

  const tokens = await createTokens(user);

  return {
    user,
    ...tokens,
  };
};

export const verifyUser = async (token, models) => {
  try {
    JWT.verify(token, config.TOKEN_SECRET);

    const { secret } = JWT.decode(token);

    if (!secret) throw new AuthenticationError("Invalid Token");

    const user = await models.user.update(
      { status: STATUS.ACTIVE },
      {
        where: { shortCode: secret },
        returning: true,
        plain: true,
      }
    );

    if (!user) throw new AuthenticationError("Invalid Token");

    const tokens = await createTokens(user[1]);

    return {
      user: user[1],
      ...tokens,
    };
  } catch (error) {
    throw new AuthenticationError("Invalid Token");
  }
};

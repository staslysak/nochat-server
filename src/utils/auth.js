import JWT from "jsonwebtoken";
import config from "../config";
import { UserInputError, AuthenticationError } from "apollo-server";
import { createTokens, refreshTokens } from "./tokens";
import { STATUS, subTypes } from "../constants";

export const tryLogin = async (username, password, models) => {
  const user = await models.user.findOne(
    { where: { username, status: STATUS.ACTIVE } },
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

export const disconnectUser = async ({ models, pubsub, user }) => {
  return await models.user
    .findByPk(user.id)
    .then((user) => {
      if (user) {
        user.update({
          online: false,
          lastSeen: Date.now(),
        });
      }
      return user;
    })
    .then((onlineUser) => {
      pubsub.publish(subTypes.ONLINE_USER, { onlineUser });
      return onlineUser;
    });
};

export const connectUser = async ({ models, pubsub, user }) => {
  return await models.user
    .findByPk(user.id)
    .then((user) => {
      if (user) {
        user.update({ online: true });
      }
      return user;
    })
    .then((onlineUser) => {
      pubsub.publish(subTypes.ONLINE_USER, { onlineUser });
      return onlineUser;
    });
};

export const verifyTokenConnection = async (connectionParams, models) => {
  const token = connectionParams["x-token"];
  if (token) {
    try {
      const { user } = JWT.verify(token, config.TOKEN_SECRET);
      return user;
    } catch (error) {
      const refreshToken = connectionParams["x-refresh-token"];
      const newTokens = await refreshTokens(refreshToken, models);
      // if (newTokens.token && newTokens.refreshToken) {
      // }
      return newTokens.user || {};
    }
  }
};

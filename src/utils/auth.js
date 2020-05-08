import { UserInputError, AuthenticationError } from "apollo-server";
import { createTokens, verifyAccessToken } from "./jwt";
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
    const { secret } = await verifyAccessToken(token);

    const user = await models.user.update(
      { status: STATUS.ACTIVE },
      {
        where: { shortCode: secret },
        returning: true,
        plain: true,
      }
    );

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

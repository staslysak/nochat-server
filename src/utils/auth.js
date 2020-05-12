import { UserInputError, AuthenticationError } from "apollo-server";
import { createTokens, verifyAccessToken } from "./jwt";
import { STATUS, SUBSCRIBTION_TYPES } from "../utils";

export const tryLogin = async (username, password, db) => {
  const user = await db.user.findOne(
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

  const match = await db.user.comparePassword(password, user.password);

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

export const verifyUser = async (token, db) => {
  try {
    const { secret } = await verifyAccessToken(token);

    const user = await db.user.update(
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

export const disconnectUser = async ({ db, pubsub, user }) => {
  return await db.user
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
      console.log("dis", onlineUser.online);
      pubsub.publish(SUBSCRIBTION_TYPES.ONLINE_USER, { onlineUser });
      return onlineUser;
    });
};

export const connectUser = async ({ db, pubsub, user }) => {
  return await db.user
    .findByPk(user.id)
    .then((user) => {
      if (user) {
        user.update({ online: true });
      }
      return user;
    })
    .then((onlineUser) => {
      console.log("conn", onlineUser.online);
      pubsub.publish(SUBSCRIBTION_TYPES.ONLINE_USER, { onlineUser });
      return onlineUser;
    });
};

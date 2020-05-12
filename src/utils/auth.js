import { UserInputError } from "apollo-server";
import { createTokens } from "./jwt";
import { STATUS, SUBSCRIBTION_TYPES } from "./constants";

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

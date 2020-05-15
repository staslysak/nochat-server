"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectUser = exports.disconnectUser = exports.tryLogin = void 0;

var _apolloServer = require("apollo-server");

var _jwt = require("./jwt");

var _constants = require("./constants");

const tryLogin = async (username, password, db) => {
  const user = await db.user.findOne({
    where: {
      username,
      status: _constants.STATUS.ACTIVE
    }
  });

  if (!user) {
    throw new _apolloServer.UserInputError("Validation Error", {
      validationErrors: {
        username: "User with this username doesn't exist"
      }
    });
  }

  const match = await db.user.comparePassword(password, user.password);

  if (!match) {
    throw new _apolloServer.UserInputError("Validation Error", {
      validationErrors: {
        password: "Credantials doesn't match"
      }
    });
  }

  const tokens = await (0, _jwt.createTokens)(user);
  return {
    user,
    ...tokens
  };
};

exports.tryLogin = tryLogin;

const disconnectUser = async ({
  db,
  pubsub,
  user
}) => {
  return await db.user.findByPk(user.id).then(user => {
    if (user) {
      user.update({
        online: false,
        lastSeen: Date.now()
      });
    }

    return user;
  }).then(onlineUser => {
    console.log("dis", onlineUser.online);
    pubsub.publish(_constants.SUBSCRIBTION_TYPES.ONLINE_USER, {
      onlineUser
    });
    return onlineUser;
  });
};

exports.disconnectUser = disconnectUser;

const connectUser = async ({
  db,
  pubsub,
  user
}) => {
  return await db.user.findByPk(user.id).then(user => {
    if (user) {
      user.update({
        online: true
      });
    }

    return user;
  }).then(onlineUser => {
    console.log("conn", onlineUser.online);
    pubsub.publish(_constants.SUBSCRIBTION_TYPES.ONLINE_USER, {
      onlineUser
    });
    return onlineUser;
  });
};

exports.connectUser = connectUser;
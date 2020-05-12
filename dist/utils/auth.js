"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectUser = exports.disconnectUser = exports.verifyUser = exports.tryLogin = void 0;

var _apolloServer = require("apollo-server");

var _jwt = require("./jwt");

var _utils = require("../utils");

const tryLogin = async (username, password, db) => {
  const user = await db.user.findOne({
    where: {
      username,
      status: _utils.STATUS.ACTIVE
    }
  }, {
    raw: true
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

const verifyUser = async (token, db) => {
  try {
    const {
      secret
    } = await (0, _jwt.verifyAccessToken)(token);
    const user = await db.user.update({
      status: _utils.STATUS.ACTIVE
    }, {
      where: {
        shortCode: secret
      },
      returning: true,
      plain: true
    });
    const tokens = await (0, _jwt.createTokens)(user[1]);
    return {
      user: user[1],
      ...tokens
    };
  } catch (error) {
    throw new _apolloServer.AuthenticationError("Invalid Token");
  }
};

exports.verifyUser = verifyUser;

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
    pubsub.publish(_utils.SUBSCRIBTION_TYPES.ONLINE_USER, {
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
    pubsub.publish(_utils.SUBSCRIBTION_TYPES.ONLINE_USER, {
      onlineUser
    });
    return onlineUser;
  });
};

exports.connectUser = connectUser;
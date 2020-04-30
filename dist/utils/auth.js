"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyTokenConnection = exports.connectUser = exports.disconnectUser = exports.verifyUser = exports.tryLogin = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

var _apolloServer = require("apollo-server");

var _tokens = require("./tokens");

var _constants = require("../constants");

const tryLogin = async (username, password, models) => {
  const user = await models.user.findOne({
    where: {
      username,
      status: _constants.STATUS.ACTIVE
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

  const match = await models.user.comparePassword(password, user.password);

  if (!match) {
    throw new _apolloServer.UserInputError("Validation Error", {
      validationErrors: {
        password: "Credantials doesn't match"
      }
    });
  }

  const tokens = await (0, _tokens.createTokens)(user);
  return {
    user,
    ...tokens
  };
};

exports.tryLogin = tryLogin;

const verifyUser = async (token, models) => {
  try {
    _jsonwebtoken.default.verify(token, _config.default.TOKEN_SECRET);

    const {
      secret
    } = _jsonwebtoken.default.decode(token);

    if (!secret) throw new _apolloServer.AuthenticationError("Invalid Token");
    const user = await models.user.update({
      status: _constants.STATUS.ACTIVE
    }, {
      where: {
        shortCode: secret
      },
      returning: true,
      plain: true
    });
    if (!user) throw new _apolloServer.AuthenticationError("Invalid Token");
    const tokens = await (0, _tokens.createTokens)(user[1]);
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
  models,
  pubsub,
  user
}) => {
  return await models.user.findByPk(user.id).then(user => {
    if (user) {
      user.update({
        online: false,
        lastSeen: Date.now()
      });
    }

    return user;
  }).then(onlineUser => {
    pubsub.publish(_constants.subTypes.ONLINE_USER, {
      onlineUser
    });
    return onlineUser;
  });
};

exports.disconnectUser = disconnectUser;

const connectUser = async ({
  models,
  pubsub,
  user
}) => {
  return await models.user.findByPk(user.id).then(user => {
    if (user) {
      user.update({
        online: true
      });
    }

    return user;
  }).then(onlineUser => {
    pubsub.publish(_constants.subTypes.ONLINE_USER, {
      onlineUser
    });
    return onlineUser;
  });
};

exports.connectUser = connectUser;

const verifyTokenConnection = async (connectionParams, models) => {
  const token = connectionParams["x-token"];

  if (token) {
    try {
      const {
        user
      } = _jsonwebtoken.default.verify(token, _config.default.TOKEN_SECRET);

      return user;
    } catch (error) {
      const refreshToken = connectionParams["x-refresh-token"];
      const newTokens = await (0, _tokens.refreshTokens)(refreshToken, models); // if (newTokens.token && newTokens.refreshToken) {
      // }

      return newTokens.user || {};
    }
  }
};

exports.verifyTokenConnection = verifyTokenConnection;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _utils = require("../../utils");

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    avatar: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: _utils.avatarGen
    },
    name: {
      allowNull: false,
      defaultValue: "jhon",
      type: DataTypes.STRING
    },
    online: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastSeen: {
      field: "last_seen",
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        msg: "Username is already taken"
      },
      validate: {
        len: {
          args: [3, 25],
          msg: "The username needs to be between 3 and 25 characters long"
        }
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        msg: "Email is already taken"
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email"
        }
      }
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(_constants.STATUS.ACTIVE, _constants.STATUS.INACTIVE),
      defaultValue: _constants.STATUS.INACTIVE
    },
    shortCode: {
      field: "short_code",
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      defaultValue: _utils.shortCodeGen,
      validate: {
        isNumeric: true,
        len: [1, 5]
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: "Password should be at least 5 characters long"
        }
      }
    }
  }, {
    hooks: {
      afterValidate: async user => {
        const hashedPassword = await _bcrypt.default.hash(user.password || "", 12);
        user.password = hashedPassword;
      }
    }
  });

  User.comparePassword = async (password, prevPassword) => {
    const match = await _bcrypt.default.compare(password, prevPassword);
    return match;
  };

  User.associate = models => {// User.belongsToMany(models.Team, {
    //   through: "member",
    //   foreignKey: "userId",
    // });
    // User.hasMany(models.message);
  };

  return User;
};

exports.default = _default;
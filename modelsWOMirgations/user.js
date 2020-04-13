import bcrypt from "bcrypt";
import { shortCodeGen, avatarGen } from "../utils";
import { STATUS } from "../constants";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      avatar: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: avatarGen,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "jhon",
      },
      online: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastSeen: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: {
          msg: "Username is already taken",
        },
        validate: {
          len: {
            args: [3, 25],
            msg: "The username needs to be between 3 and 25 characters long",
          },
        },
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: {
          msg: "Email is already taken",
        },
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email",
          },
        },
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM(STATUS.ACTIVE, STATUS.INACTIVE),
        defaultValue: STATUS.INACTIVE,
      },
      shortCode: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        defaultValue: shortCodeGen,
        validate: {
          isNumeric: true,
          len: [1, 5],
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 100],
            msg: "Password should be at least 5 characters long",
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password || "", 12);
          user.password = hashedPassword;
        },
      },
    }
  );

  User.comparePassword = async (password, prevPassword) => {
    const match = await bcrypt.compare(password, prevPassword);
    return match;
  };

  User.associate = (models) => {
    // User.belongsToMany(models.Team, {
    //   through: "member",
    //   foreignKey: "userId",
    // });
  };

  return User;
};

import bcrypt from "bcrypt";
import { shortCodeGen, avatarGen, STATUS } from "../../utils";

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
        defaultValue: "jhon",
        type: DataTypes.STRING,
      },
      online: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastSeen: {
        field: "last_seen",
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
        field: "short_code",
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

  User.associate = (db) => {
    // User.belongsToMany(db.Team, {
    //   through: "member",
    //   foreignKey: "userId",
    // });
    // User.hasMany(db.message);
  };

  return User;
};

import Sequelize from "sequelize";
import config from "../config";

const sequelize = new Sequelize(config.DB_URL, {
  dialect: "postgresql",
  define: { underscored: true }
});

const models = {
  User: sequelize.import("./user"),
  Team: sequelize.import("./team"),
  Direct: sequelize.import("./direct"),
  Message: sequelize.import("./message")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;

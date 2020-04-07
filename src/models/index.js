import Sequelize from "sequelize";
import config from "../config";
import { operatorsAliases } from "./operatorsAliases";

const sequelize = new Sequelize(config.DB_URL, {
  dialect: "postgresql",
  define: { underscored: true },
  logging: true,
  benchmark: true,
  operatorsAliases,
});

const models = {
  User: sequelize.import("./user"),
  Direct: sequelize.import("./direct"),
  Message: sequelize.import("./message"),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;

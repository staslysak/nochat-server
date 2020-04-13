"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("messages", "user_id", {
      type: Sequelize.INTEGER // allowNull: false,
      // field: "user_id",

    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("messages", "user_id", {
      field: "user_id"
    });
  }
};
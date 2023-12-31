const { DataTypes } = require("sequelize");
const User = require("./User.js");
const OrdersItens = require("./OrdersItens.js");

module.exports = (sequelize) => {
  const Orders = sequelize.define("Orders", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
    },
    order_total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Orders.hasMany(OrdersItens, {
    foreignKey: "orderId",
    as: "OrdersItens",
  });

  return Orders;
};

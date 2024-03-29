const { DataTypes } = require("sequelize");
const sequelize = require("../db/dbConection.js");
const { v4: uuidv4 } = require("uuid");
const UserRefreshToken = require("./UserRefreshToken.js");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
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

User.hasMany(UserRefreshToken, { foreignKey: "userId", sourceKey: "id" });
UserRefreshToken.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

module.exports = User;

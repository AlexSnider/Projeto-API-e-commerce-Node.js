const { DataTypes } = require("sequelize");
const sequelize = require("../db/dbConection.js");

const UserRefreshToken = sequelize.define("user_refresh_tokens", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: "User",
      key: "id",
    },
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});

UserRefreshToken.associate = (models) => {
  UserRefreshToken.belongsTo(models.User, {
    foreignKey: "userId",
  });
};

module.exports = UserRefreshToken;

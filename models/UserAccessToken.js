const { DataTypes } = require("sequelize");
const sequelize = require("../db/dbConection.js");

const UserAccessToken = sequelize.define("user_access_tokens", {
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
  accessToken: {
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
    defaultValue: false,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});

UserAccessToken.associate = (models) => {
  UserAccessToken.belongsTo(models.User, {
    foreignKey: "userId",
  });
};

module.exports = UserAccessToken;

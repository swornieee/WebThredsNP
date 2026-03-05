const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      customer: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      items: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      address: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Confirmed',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
    }
  );

  return Order;
};
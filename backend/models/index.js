const { sequelize } = require('../db');
const UserModel = require('./User');
const ProductModel = require('./Product');

// Initialize models
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);

// Define associations (if needed)
// Example: User.hasMany(Order);
// Order.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Product,
};

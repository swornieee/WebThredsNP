const { sequelize } = require('../db');
const UserModel = require('./User');
const ProductModel = require('./Product');
const OrderModel = require('./Order');
const CartModel = require('./Cart');

// Initialize models
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);
const Cart = CartModel(sequelize);

// Define associations (if needed)
// Example: User.hasMany(Order);
// Order.belongsTo(User);
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Cart, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Cart,
};

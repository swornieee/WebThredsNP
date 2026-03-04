/**
 * EXAMPLE: How to use Sequelize Models in Express Routes
 * 
 * Replace the in-memory data structures with database queries
 */

// ============================================
// BEFORE (In-Memory - Current Implementation)
// ============================================
/*
let products = [
  { id: "1", name: "Product Name", ... },
  { id: "2", name: "Another Product", ... }
];

let users = [
  { id: "admin-001", email: "admin@gmail.com", isAdmin: true, ... }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', adminRequired, upload.single('image'), (req, res) => {
  const newProduct = { ...formData };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
*/

// ============================================
// AFTER (Using Sequelize ORM)
// ============================================

const express = require('express');
const { User, Product } = require('./models');
const router = express.Router();

// GET All Products
// router.get('/api/products', async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       where: req.query.featured ? { featured: true } : undefined,
//       order: [['createdAt', 'DESC']],
//     });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error: error.message });
//   }
// });

// GET Product by ID
// router.get('/api/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching product', error: error.message });
//   }
// });

// CREATE Product
// router.post('/api/products', adminRequired, upload.single('image'), async (req, res) => {
//   try {
//     const { name, brand, category, price, originalPrice, description, stock, tags, featured } = req.body;
//
//     if (!name || !brand || !category || !price) {
//       return res.status(400).json({ message: 'Required fields missing' });
//     }
//
//     let imageUrl = '';
//     if (req.file) {
//       imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//     }
//
//     const newProduct = await Product.create({
//       name,
//       brand,
//       category,
//       price: parseFloat(price),
//       originalPrice: parseFloat(originalPrice) || parseFloat(price),
//       image: imageUrl,
//       description: description || '',
//       stock: parseInt(stock) || 0,
//       tags: tags ? tags.split(',').map(t => t.trim()) : [],
//       featured: featured === 'true' || featured === true,
//     });
//
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating product', error: error.message });
//   }
// });

// DELETE Product
// router.delete('/api/products/:id', adminRequired, async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//
//     await product.destroy();
//     res.json({ message: 'Product removed', product });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting product', error: error.message });
//   }
// });

// ============================================
// User Model Examples
// ============================================

// Register User
// router.post('/api/users/register', async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;
//
//     if (!firstName || !lastName || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }
//
//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       password,
//       isAdmin: false,
//     });
//
//     res.status(201).json({
//       message: 'Account created successfully',
//       token: `token_${newUser.id}`,
//       user: {
//         id: newUser.id,
//         firstName: newUser.firstName,
//         lastName: newUser.lastName,
//         email: newUser.email,
//         isAdmin: newUser.isAdmin,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// });

// Login User
// router.post('/api/users/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }
//
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//
//     // In production, use bcrypt to compare passwords
//     if (user.password !== password) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//
//     res.json({
//       message: 'Login successful',
//       token: `token_${user.id}`,
//       user: {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in', error: error.message });
//   }
// });

// ============================================
// Key Differences
// ============================================
/*
1. NO IN-MEMORY ARRAYS
   - Before: let products = [...]
   - After: const products = await Product.findAll()

2. DATABASE PERSISTENCE
   - Before: Data lost on server restart
   - After: Data persists in PostgreSQL

3. CLEANER QUERIES
   - Before: Manual array filtering/manipulation
   - After: Sequelize handles SQL generation

4. DATA VALIDATION
   - Before: Manual validation in routes
   - After: Model-level validation

5. RELATIONSHIPS
   - Before: Hard to manage related data
   - After: Easy with model associations

6. MIGRATIONS
   - Before: Manual schema updates
   - After: Sequelize migrations for versioning
*/

module.exports = router;

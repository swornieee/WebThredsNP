# Sequelize Integration Guide

## ✅ What's Been Done

1. **Installed Sequelize** - ORM for PostgreSQL
2. **Updated `db.js`** - Switched from pg Pool to Sequelize
3. **Created Models:**
   - `models/User.js` - User entity with email, password, isAdmin fields
   - `models/Product.js` - Product entity with all product fields
   - `models/index.js` - Central model export and initialization

## 📋 Setup Instructions

### Step 1: Initialize Database (in your server index.js)

Add this at the start of your Express app:

```javascript
const express = require('express');
const { sequelize, testConnection, syncDatabase } = require('./db');
const { User, Product } = require('./models');

const app = express();

// Test and sync database on startup
(async () => {
  try {
    await testConnection();
    await syncDatabase();
    console.log('✅ Database ready!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
})();

// Rest of your Express setup...
app.use(cors());
app.use(express.json());
```

### Step 2: Replace In-Memory Data with Database

**Before (In-Memory):**
```javascript
let products = [
  { id: "1", name: "Tokyo Street Hoodie", ... },
  { id: "2", name: "Seoul Minimal Blazer", ... },
];

let users = [
  { id: "admin-001", email: "admin@gmail.com", ... }
];
```

**After (Sequelize):**
```javascript
// Products are fetched from database on each request
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: req.query.featured ? { featured: true } : undefined,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed initial data (run once)
async function seedDatabase() {
  const productCount = await Product.count();
  if (productCount === 0) {
    await Product.bulkCreate([
      {
        name: "Tokyo Street Hoodie",
        brand: "Uniqlo",
        category: "Men",
        price: 4500,
        originalPrice: 6000,
        description: "Premium cotton hoodie...",
        stock: 15,
        featured: true,
      },
      // ... more products
    ]);
    console.log('✅ Database seeded with initial products');
  }
}
```

## 🔄 Common Operations

### Create (INSERT)
```javascript
const newProduct = await Product.create({
  name: 'New Product',
  brand: 'Brand Name',
  category: 'Men',
  price: 5000,
  stock: 10,
});
```

### Read (SELECT)
```javascript
// Find all
const products = await Product.findAll();

// Find one by primary key
const product = await Product.findByPk(productId);

// Find with conditions
const menProducts = await Product.findAll({
  where: { category: 'Men' }
});
```

### Update (UPDATE)
```javascript
const product = await Product.findByPk(productId);
await product.update({
  price: 4500,
  stock: 20,
});

// Or directly:
await Product.update(
  { price: 4500 },
  { where: { category: 'Men' } }
);
```

### Delete (DELETE)
```javascript
const product = await Product.findByPk(productId);
await product.destroy();

// Or directly:
await Product.destroy({
  where: { id: productId }
});
```

## 🔑 Key Data Types in Sequelize

| Type | Description |
|------|-------------|
| `STRING` | VARCHAR(255) |
| `TEXT` | Longer text field |
| `INTEGER` | Number without decimals |
| `DECIMAL(10,2)` | Price format (10 digits, 2 decimals) |
| `BOOLEAN` | true/false |
| `DATE` | Timestamp |
| `JSON` | Store JSON data (great for tags array) |
| `UUID` | Universal unique identifier |

## 📊 Example: Updated Route with Sequelize

```javascript
// Add Product Route
app.post('/api/products', adminRequired, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, category, price, originalPrice, description, stock, tags, featured } = req.body;

    if (!name || !brand || !category || !price) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newProduct = await Product.create({
      name,
      brand,
      category,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      image: imageUrl,
      description: description || '',
      stock: parseInt(stock) || 0,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Delete Product Route
app.delete('/api/products/:id', adminRequired, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product removed', product });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});
```

## 🌱 Seeding Initial Data

Create a `seed.js` file:

```javascript
const { sequelize, testConnection, syncDatabase } = require('./db');
const { User, Product } = require('./models');

async function seedDatabase() {
  try {
    await testConnection();
    await syncDatabase();

    // Check if data exists
    const userCount = await User.count();
    if (userCount === 0) {
      await User.bulkCreate([
        {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@gmail.com',
          password: 'admin',
          isAdmin: true,
        },
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          isAdmin: false,
        },
      ]);
      console.log('✅ Users seeded');
    }

    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate([
        {
          name: 'Tokyo Street Hoodie',
          brand: 'Uniqlo',
          origin: 'Japan',
          category: 'Men',
          price: 4500,
          originalPrice: 6000,
          description: 'Premium cotton hoodie',
          stock: 15,
          featured: true,
          tags: ['hoodie', 'streetwear'],
        },
        // ... more products
      ]);
      console.log('✅ Products seeded');
    }

    console.log('✅ Database seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
```

Run seeding:
```bash
node seed.js
```

## 🛠️ Environment Variables

Create a `.env` file in the server directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=thredsnp

# Server
PORT=5000
NODE_ENV=development
```

Then update `db.js` to use these variables (already done in the new version).

## 📈 Benefits of Sequelize Over pg Pool

| Feature | pg Pool | Sequelize |
|---------|---------|-----------|
| Type Safety | No | Yes (with types) |
| Query Builder | Manual SQL | ORM auto-generates |
| Migrations | Manual | Automatic versioning |
| Associations | Manual joins | Built-in relationships |
| Validation | Manual | Model-level |
| Data Persistence | In-memory only | Database |
| Scalability | Limited | Enterprise-ready |

## ⚠️ Important Notes

1. **Data will reset on server restart** - Wait until all data in Sequelize is implemented
2. **Migrations** - Use `sequelize-cli` for version control of schema changes
3. **Passwords** - Should be hashed with bcrypt in production
4. **Timestamps** - Sequelize auto-manages `createdAt` and `updatedAt`
5. **Transactions** - Use for multi-step operations that need atomic operations

## 🚀 Next Steps

1. Update your `index.js` to initialize Sequelize
2. Replace in-memory routes with Sequelize queries
3. Create seed file for initial data
4. Test all CRUD operations with pgAdmin 4
5. Implement bcrypt for password hashing
6. Add associations (User hasMany Orders, etc.)

See `SEQUELIZE_EXAMPLES.js` for detailed code examples.

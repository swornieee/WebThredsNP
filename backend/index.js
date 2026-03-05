const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// database setup
const { sequelize, testConnection, syncDatabase } = require('./db');
const { User, Product, Order, Cart } = require('./models');

// using in-memory arrays for quick dev/testing

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());

// allow serving uploaded images
app.use('/uploads', express.static('uploads'));

// parse JSON bodies for most routes (multipart will be handled by multer)
app.use(express.json());

// ─── Request Logging Middleware ──────────────────────────────
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

// Apply middleware
app.use(requestLogger);

// ─── Error Handling Middleware ───────────────────────────────
const errorHandler = (err, req, res, next) => {
  console.error("[Error]", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  });
};

// ─── Input Validation Utilities ──────────────────────────────
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  password: (password) => password && password.length >= 6,
  productName: (name) => name && name.trim().length >= 3,
};

// ─── Response Formatting Utilities ───────────────────────────
const responses = {
  success: (data) => ({ success: true, data }),
  error: (message, status = 400) => ({ success: false, message, status }),
  paginated: (data, total, page, limit) => ({
    success: true,
    data,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  }),
};

// ─── In-memory Data (used only for initial seeding) ────────────────────

// ─── User Authentication Routes ───────────────────────────────────
app.post("/api/users/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Enhanced validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  if (!validators.email(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  
  if (!validators.password(password)) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // check duplicate email
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password, // plain text for demo only
      isAdmin: false,
    });
    res.status(201).json({
      message: "Account created successfully",
      token: "token_" + newUser.id,
      user: { id: newUser.id, firstName, lastName, email, isAdmin: false },
    });
  } catch (err) {
    console.error("Register error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  if (!validators.email(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      message: "Login successful",
      token: "token_" + user.id,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Utility & Middleware ───────────────────────────────────────

// simple admin auth using token from header; looks up user in database
async function adminRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : req.headers["x-auth-token"];
  if (!token) return res.status(401).json({ message: "Authentication required" });
  const id = token.replace("token_", "");
  try {
    // look up in database rather than the old in-memory array
    const user = await User.findByPk(id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("adminRequired error", err);
    res.status(500).json({ message: "Server error" });
  }
}

// file upload setup
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// ─── Products Routes ──────────────────────────────────────────────
app.get("/api/products", async (req, res) => {
  const { category, search, featured, sort } = req.query;
  try {
    const where = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (search) {
      const s = search.toLowerCase();
      where[sequelize.Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', `%${s}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('brand')), 'LIKE', `%${s}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('origin')), 'LIKE', `%${s}%`),
      ];
    }
    if (featured === "true") {
      where.featured = true;
    }
    const order = [];
    if (sort === "price-asc") order.push(['price', 'ASC']);
    else if (sort === "price-desc") order.push(['price', 'DESC']);
    else if (sort === "rating") order.push(['rating', 'DESC']);
    else order.push(['createdAt', 'DESC']);

    const products = await Product.findAll({ where, order });
    res.json(products);
  } catch (err) {
    console.error("GET /api/products error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// allow only admins to add or remove products
app.post("/api/products", adminRequired, upload.single("image"), async (req, res) => {
  const {
    name,
    brand,
    origin,
    category,
    price,
    originalPrice,
    description,
    stock,
    tags,
    featured,
  } = req.body;

  // Enhanced validation
  if (!name || !brand || !category || !price) {
    return res.status(400).json({ message: "Name, brand, category and price are required" });
  }
  
  if (!validators.productName(name)) {
    return res.status(400).json({ message: "Product name must be at least 3 characters" });
  }
  
  if (isNaN(Number(price)) || Number(price) <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  let imageUrl = "";
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.image) {
    imageUrl = req.body.image; // could be base64 or URL
  }

  try {
    const newProduct = await Product.create({
      name,
      brand,
      origin: origin || "",
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      image: imageUrl,
      description: description || "",
      stock: Number(stock) || 0,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      featured: featured === "true" || featured === true,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("POST /api/products error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", adminRequired, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.destroy();
    res.json({ message: "Product removed", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Cart Routes ──────────────────────────────────────────────────
// Get cart contents (returns an array for consistency with other cart endpoints)
app.get("/api/cart", async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      include: [{ model: Product, as: 'product' }],
    });
    const cartWithDetails = cartItems.map((item) => ({
      ...item.toJSON(),
      subtotal: item.quantity * item.product.price,
    }));
    res.json(cartWithDetails);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/cart", async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  if (!productId || quantity < 1) {
    return res.status(400).json({ message: "Valid productId and quantity are required" });
  }
  
  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    if (quantity > product.stock) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    const existing = await Cart.findOne({ where: { productId } });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
    } else {
      await Cart.create({ productId, quantity });
    }
    const cartItems = await Cart.findAll({
      include: [{ model: Product, as: 'product' }],
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  try {
    const item = await Cart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    await item.destroy();
    const cartItems = await Cart.findAll({
      include: [{ model: Product, as: 'product' }],
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/cart/:id", async (req, res) => {
  try {
    const item = await Cart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    item.quantity = req.body.quantity;
    if (item.quantity <= 0) {
      await item.destroy();
    } else {
      await item.save();
    }
    const cartItems = await Cart.findAll({
      include: [{ model: Product, as: 'product' }],
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Orders Routes ────────────────────────────────────────────────
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    // normalize customer object for legacy entries
    const normalized = orders.map((o) => {
      const ord = o.toJSON();
      const cust = ord.customer || {};
      const name =
        cust.name ||
        [cust.firstName, cust.lastName].filter(Boolean).join(' ') ||
        'Customer';
      // normalize items to have product object
      const normalizedItems = (ord.items || []).map((item) => {
        if (item.product) {
          return item; // already normalized
        } else {
          // assume flat structure
          return {
            product: {
              id: item.id,
              name: item.name,
              price: item.price,
              image: '/placeholder.jpg', // or fetch from Product if needed
            },
            quantity: item.quantity,
          };
        }
      });
      return {
        ...ord,
        customer: {
          name,
          phone: cust.phone || '',
          payment: cust.payment || 'cash',
          ...cust,
        },
        items: normalizedItems,
      };
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { customer, items, total, address } = req.body;
  try {
    const order = await Order.create({
      customer,
      items,
      total,
      address,
      status: "Confirmed",
    });
    // clear cart after order
    await Cart.destroy({ where: {} });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Stats Route ──────────────────────────────────────────────────
app.get("/api/stats", async (req, res) => {
  try {
    const [totalProducts, totalOrders, countriesResult, revenueResult] = await Promise.all([
      Product.count(),
      Order.count(),
      Product.findAll({ attributes: [[sequelize.fn('DISTINCT', sequelize.col('origin')), 'origin']] }),
      Order.sum('total')
    ]);
    const countries = countriesResult.length;
    const totalRevenue = revenueResult || 0;
    res.json({
      totalProducts,
      totalOrders,
      countries,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ─── Health Check Routes ────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/stats", async (req, res) => {
  try {
    const [totalProducts, totalUsers, totalOrders, cartItems] = await Promise.all([
      Product.count(),
      User.count(),
      Order.count(),
      Cart.count()
    ]);
    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      cartItems,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.listen(PORT, async () => {
  console.log(`\n🚀 Threds NP Server running on http://localhost:${PORT}\n`);
  // Initialize database after server starts
  await testConnection();
  await syncDatabase();

  // Seed initial data
  try {
    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate([
        {
          name: "Tokyo Street Hoodie",
          brand: "Uniqlo",
          origin: "Japan",
          category: "Men",
          price: 4500,
          originalPrice: 6000,
          image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80",
          description: "Premium cotton hoodie imported directly from Japan. Perfect for Kathmandu winters.",
          stock: 15,
          rating: 4.8,
          reviews: 124,
          tags: ["hoodie", "streetwear", "japan"],
          featured: true,
        },
        {
          name: "Seoul Minimal Blazer",
          brand: "ZARA",
          origin: "South Korea",
          category: "Women",
          price: 8200,
          originalPrice: 11000,
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=500&q=80",
          description: "Elegant blazer from South Korea's top fashion houses. Business-casual perfection.",
          stock: 8,
          rating: 4.9,
          reviews: 87,
          tags: ["blazer", "formal", "korea"],
          featured: true,
        },
        {
          name: "Paris Linen Shirt",
          brand: "H&M",
          origin: "France",
          category: "Men",
          price: 3200,
          originalPrice: 4000,
          image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
          description: "Breathable linen shirt curated from Parisian collections. Ideal for warm days.",
          stock: 20,
          rating: 4.6,
          reviews: 203,
          tags: ["shirt", "linen", "france"],
          featured: false,
        },
        {
          name: "NYC Denim Jacket",
          brand: "Levi's",
          origin: "USA",
          category: "Unisex",
          price: 7800,
          originalPrice: 9500,
          image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&q=80",
          description: "Classic American denim jacket. Timeless style imported from the USA.",
          stock: 12,
          rating: 4.7,
          reviews: 315,
          tags: ["denim", "jacket", "usa"],
          featured: true,
        },
        {
          name: "Milan Knit Sweater",
          brand: "Mango",
          origin: "Italy",
          category: "Women",
          price: 5500,
          originalPrice: 7200,
          image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80",
          description: "Luxurious knit sweater from Italy. Soft, warm and effortlessly stylish.",
          stock: 6,
          rating: 4.9,
          reviews: 56,
          tags: ["sweater", "knit", "italy"],
          featured: true,
        },
        {
          name: "London Trench Coat",
          brand: "Burberry",
          origin: "UK",
          category: "Unisex",
          price: 18500,
          originalPrice: 24000,
          image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80",
          description: "Iconic trench coat from London. Premium quality for the discerning buyer.",
          stock: 4,
          rating: 5.0,
          reviews: 42,
          tags: ["coat", "premium", "uk"],
          featured: false,
        },
        {
          name: "Bangkok Summer Dress",
          brand: "Zara",
          origin: "Thailand",
          category: "Women",
          price: 2800,
          originalPrice: 3500,
          image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80",
          description: "Vibrant floral dress sourced from Bangkok's fashion district.",
          stock: 18,
          rating: 4.5,
          reviews: 178,
          tags: ["dress", "summer", "thailand"],
          featured: false,
        },
        {
          name: "Berlin Tech Pants",
          brand: "Nike",
          origin: "Germany",
          category: "Men",
          price: 5200,
          originalPrice: 6800,
          image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
          description: "Performance tech pants from Berlin. Stylish, functional, and built to last.",
          stock: 10,
          rating: 4.6,
          reviews: 91,
          tags: ["pants", "tech", "germany"],
          featured: false,
        },
      ]);
      console.log('✅ Initial products seeded');
    }

    const admin = await User.findOne({ where: { email: 'admin@gmail.com' } });
    if (!admin) {
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@gmail.com",
        password: "admin",
        isAdmin: true,
      });
      console.log('✅ Admin user seeded');
    }
  } catch (e) {
    console.error('Seeding error:', e);
  }
});

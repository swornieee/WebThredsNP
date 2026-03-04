const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// database helper (not used when running without a DB)
// const { query } = require("./db");

// using in-memory arrays for quick dev/testing


const app = express();
app.use(cors());

// allow serving uploaded images
app.use('/uploads', express.static('uploads'));

// parse JSON bodies for most routes (multipart will be handled by multer)
app.use(express.json());

// ─── In-memory Data (used only for initial seeding) ────────────────────
let products = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "6",
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
    id: "7",
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
    id: "8",
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
];

let orders = [];
let cart = [];
let users = [
  {
    id: "admin-001",
    firstName: "Admin",
    lastName: "User",
    email: "admin@gmail.com",
    password: "admin",
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-002",
    firstName: "Super",
    lastName: "Admin",
    email: "admin2@threds.com",
    password: "admin456",
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
];

// ─── User Authentication Routes ───────────────────────────────────
app.post("/api/users/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check duplicate email in-memory
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const newUser = {
      id,
      firstName,
      lastName,
      email,
      password, // plain text for demo only
      isAdmin: false,
      createdAt,
    };
    users.push(newUser);
    res.status(201).json({
      message: "Account created successfully",
      token: "token_" + newUser.id,
      user: { id, firstName, lastName, email, isAdmin: false },
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

  try {
    const user = users.find((u) => u.email === email);
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
    const user = users.find((u) => u.id === id);
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
app.get("/api/products", (req, res) => {
  const { category, search, featured, sort } = req.query;
  try {
    let filtered = [...products];
    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.origin.toLowerCase().includes(s)
      );
    }
    if (featured === "true") {
      filtered = filtered.filter((p) => p.featured);
    }
    if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    res.json(filtered);
  } catch (err) {
    console.error("GET /api/products error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
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

  if (!name || !brand || !category || !price) {
    return res.status(400).json({ message: "Name, brand, category and price are required" });
  }

  let imageUrl = "";
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.image) {
    imageUrl = req.body.image; // could be base64 or URL
  }

  try {
    const id = uuidv4();
    const newProduct = {
      id,
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
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("POST /api/products error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", adminRequired, (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  const removed = products.splice(index, 1)[0];
  res.json({ message: "Product removed", product: removed });
});

// ─── Cart Routes ──────────────────────────────────────────────────
app.get("/api/cart", (req, res) => res.json(cart));

app.post("/api/cart", (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const existing = cart.find((c) => c.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: uuidv4(), productId, quantity, product });
  }
  res.json(cart);
});

app.delete("/api/cart/:id", (req, res) => {
  cart = cart.filter((c) => c.id !== req.params.id);
  res.json(cart);
});

app.put("/api/cart/:id", (req, res) => {
  const item = cart.find((c) => c.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  item.quantity = req.body.quantity;
  if (item.quantity <= 0) cart = cart.filter((c) => c.id !== req.params.id);
  res.json(cart);
});

// ─── Orders Routes ────────────────────────────────────────────────
app.get("/api/orders", (req, res) => res.json(orders));

app.post("/api/orders", (req, res) => {
  const { customer, items, total, address } = req.body;
  const order = {
    id: uuidv4().slice(0, 8).toUpperCase(),
    customer,
    items,
    total,
    address,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  cart = []; // clear cart after order
  res.status(201).json(order);
});

// ─── Stats Route ──────────────────────────────────────────────────
app.get("/api/stats", (req, res) => {
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    countries: [...new Set(products.map((p) => p.origin))].length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Threds NP Server running on http://localhost:${PORT}\n`);
});

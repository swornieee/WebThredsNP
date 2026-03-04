# 🧵 Threds NP — Imported Fashion Store

A full-stack e-commerce web app for selling imported clothes in Nepal.

Built with **React + Vite**, **Node.js + Express**, and **Tailwind CSS**.

---

## 📁 Project Structure

```
threds-np/
├── frontend/        # React frontend (Vite + Tailwind)
├── backend/         # Node.js + Express backend
├── package.json     # Root scripts (run both together)
└── README.md
```

---

## 🚀 How to Run

### Step 1 — Install Dependencies

Open terminal in the project folder and run:

```bash
npm run install:all
```

This installs packages for root, frontend, and backend.

### Step 2 — Start the App

```bash
npm run dev
```

This runs both the backend and frontend together:
- 🖥️ Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:5000

---

## 📦 Pages & Features

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, featured products, origins, why us |
| Shop | `/shop` | Browse all products, filter by category, search |
| Product | `/product/:id` | Product detail with full info |
| Cart | `/cart` | Shopping cart with qty controls |
| Checkout | `/checkout` | Order form with payment options |
| Orders | `/orders` | Order history |
| About | `/about` | Company story, team, contact |

---

## 🛍️ Features

- ✅ Product catalog with 8 imported items
- ✅ Filter by category (Men, Women, Unisex)
- ✅ Search by name, brand, or origin country
- ✅ Sort by price or rating
- ✅ Add to cart / remove / update quantity
- ✅ Checkout with customer details
- ✅ Order confirmation with order ID
- ✅ Order history page
- ✅ Toast notifications
- ✅ Responsive design (mobile + desktop)
- ✅ Nepali Rupee (NPR) pricing

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Styling | Tailwind CSS v3 |
| Backend | Node.js, Express |
| State | React Context API |
| HTTP | Axios |
| Data | In-memory (no database needed) |

---

## 📝 Notes

- No database required — data is stored in memory
- Restarting the server resets orders and cart
- To add a database, replace the in-memory arrays in `backend/index.js` with MongoDB/PostgreSQL

---

Made with ❤️ for Nepal 🇳🇵

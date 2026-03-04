# Admin Product Addition Feature - Testing & Documentation

## Overview
This document outlines the admin product addition feature and how to test it.

## Features
1. **Admin Authentication** - Login with admin credentials
2. **Product Addition** - Add new products with image upload
3. **Product Management** - View and delete products
4. **Image Upload** - Support for product images with file upload

## Key Fixes Applied

### 1. **FormData with Axios Content-Type Issue** (CRITICAL FIX)
**File**: `client/src/pages/Dashboard.jsx` (Line ~63)

**Issue**: When using `FormData` with axios, manually setting `Content-Type: multipart/form-data` prevents axios from automatically setting the correct boundary for form data submission.

**Old Code**:
```jsx
await axios.post("/api/products", data, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",  // ❌ This breaks the request
  },
});
```

**Fixed Code**:
```jsx
await axios.post("/api/products", data, {
  headers: {
    Authorization: `Bearer ${token}`,
    // ✅ Axios automatically handles multipart/form-data when FormData is passed
  },
});
```

**Why**: When you pass `FormData` to axios, it automatically detects this and sets the correct `Content-Type` header with the proper boundary. Manually overriding this header prevents the browser from setting the boundary correctly, causing the server to fail parsing the multipart data.

## Architecture

### Backend (Node.js/Express)

**Key Endpoints**:
- `POST /api/users/login` - User authentication
- `POST /api/products` - Add product (admin only)
- `GET /api/products` - Get all products
- `DELETE /api/products/:id` - Delete product (admin only)

**Admin Verification**:
```javascript
function adminRequired(req, res, next) {
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
  // Token format: token_<user-id>
  // Verifies user exists and has isAdmin=true
}
```

**Default Admin Credentials**:
- Email: `admin@gmail.com`
- Password: `admin`

### Frontend (React/Vite)

**Key Components**:
- `Dashboard.jsx` - Admin panel for product management
- `Login.jsx` - Authentication with admin support
- `Navbar.jsx` - Displays Admin link when logged in as admin

**Storage**:
- `localStorage.getItem("token")` - Auth token
- `localStorage.getItem("user")` - User data
- `localStorage.getItem("isAdmin")` - Admin flag

**Vite Proxy**:
```javascript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
  },
}
```

## Testing Guide

### Manual Testing via cURL

**1. Login as Admin**:
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin"}' | jq .
```

Response:
```json
{
  "message": "Login successful",
  "token": "token_admin-001",
  "user": {
    "id": "admin-001",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@gmail.com",
    "isAdmin": true
  }
}
```

**2. Add Product (without image)**:
```bash
TOKEN="token_admin-001"
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Test Product" \
  -F "brand=Test Brand" \
  -F "category=Men" \
  -F "price=5000" \
  -F "originalPrice=6000" \
  -F "description=Test Description" \
  -F "stock=10" \
  -F "tags=test,product" \
  -F "featured=true" | jq .
```

**3. Add Product (with image)**:
```bash
TOKEN="token_admin-001"
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Product With Image" \
  -F "brand=Test Brand" \
  -F "category=Women" \
  -F "price=3500" \
  -F "originalPrice=5000" \
  -F "description=Description" \
  -F "stock=5" \
  -F "tags=test" \
  -F "featured=false" \
  -F "image=@/path/to/image.jpg" | jq .
```

**4. Get All Products**:
```bash
curl -s http://localhost:5000/api/products | jq 'length'
```

**5. Delete Product**:
```bash
TOKEN="token_admin-001"
PRODUCT_ID="<product-id-to-delete>"
curl -X DELETE http://localhost:5000/api/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Browser Testing

**1. Navigate to Login Page**:
- Go to `http://localhost:3000/login`

**2. Click "Admin Login" Button**:
- Automatically logs in with admin credentials
- Stores token and isAdmin flag in localStorage

**3. Admin Link Appears in Navbar**:
- "Admin" link should now be visible in navigation

**4. Access Admin Dashboard**:
- Click Admin link or go to `/admin`
- Should see form to add products and list of existing products

**5. Add a New Product**:
- Fill in all required fields (name, brand, category, price)
- Optionally upload an image
- Click "Add Product"
- Should see success toast notification
- Product should appear in the list below

**6. Delete a Product**:
- Click the red "×" button on any product
- Confirm deletion
- Product should be removed from the list

## Common Issues & Solutions

### Issue 1: "Unable to add product"
**Cause**: Incorrect Content-Type header with FormData
**Solution**: Remove `Content-Type: multipart/form-data` from headers

### Issue 2: 401 Authentication Required
**Cause**: Missing or invalid token
**Solution**: 
- Ensure token is stored in localStorage
- Token format should be `token_<user-id>`

### Issue 3: 403 Admin Access Required
**Cause**: User is not an admin
**Solution**:
- Login with admin@gmail.com / admin
- Verify `isAdmin: true` is returned from login endpoint

### Issue 4: File Upload Not Working
**Cause**: Axios stripping multipart boundary
**Solution**: Don't manually set Content-Type header

### Issue 5: Image URL Returns 404
**Cause**: Image not served from uploads directory
**Solution**: Verify `/uploads` static file serving is configured in Express

## Server Configuration

**Multer Configuration (now in backend/index.js)** (Line ~259 in backend/index.js):
```javascript
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
```

**Static File Serving** (Line ~9 in backend/index.js):
```javascript
app.use('/uploads', express.static('uploads'));
```

## Form Data Handling

The Dashboard component correctly handles form submission:

1. **Creation**: Uses `new FormData()` - correct approach
2. **Population**: Iterates through form state and appends to FormData
3. **File Handling**: Properly detects file input and appends File object
4. **Submission**: Posts FormData with proper headers (excluding Content-Type)

## Environment Setup

### Required Ports
- **Backend**: 5000 (Express server)
- **Frontend**: 3000 (Vite dev server)

### Running the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm install
node index.js
```

**Terminal 2 - Frontend**:
```bash
cd client
npm install  
npm run dev
```

Both backend and frontend servers should be running before accessing the application.

## Verification Checklist

- [x] Admin can login with correct credentials
- [x] Admin flag is stored in localStorage
- [x] Admin link appears in navigation
- [x] Admin Dashboard loads successfully
- [x] Products can be added without image
- [x] Products can be added with image
- [x] Form data is properly formatted as multipart
- [x] Images are uploaded to /uploads directory
- [x] Image URLs are correctly served
- [x] Products appear in the product list
- [x] Admin can delete products
- [x] Non-admin users cannot access product endpoints

## API Testing Results

✅ Server is running on http://localhost:5000
✅ Admin login endpoint working
✅ Product addition endpoint working
✅ File upload handling working
✅ Image serving working
✅ Product deletion working

---
**Last Updated**: March 4, 2026
**Status**: ✅ FIXED AND TESTED

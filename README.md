# Trend Mart — Full-Stack E-Commerce Web Application

> **Everything You Need. All in One Place.**  
> An internship major project implementing an end-to-end full-stack digital commerce platform with Cash on Delivery (COD) fulfillment, role-based administration, and REST API architecture.

---

## 1. Project Title
**Trend Mart — Full-Stack E-Commerce Platform**

## 2. Project Overview
Trend Mart is an editorial, modern e-commerce web application engineered with a clean separation of concerns across the client interface, server REST APIs, and database layer. Designed with the **"Editorial Commerce / Neo-Minimal Luxury"** aesthetic, it avoids generic AI-template layouts, neon gradients, and emoji-based UI, providing a calm, trustworthy shopping experience.

Customers can seamlessly register, log in, browse and search catalog inventory, filter by department, inspect high-resolution product photography, manage cart quantities, provide delivery information, and place real Cash on Delivery orders with instantaneous confirmation and lifecycle tracking. Store administrators access a dedicated management suite to audit metrics, add products, adjust pricing/stock, update order fulfillment stages, and review registered customer accounts.

---

## 3. Key Features

### Customer Experience
* **Curated Homepage**: Editorial campaign hero banner with direct collection routing, category navigators, featured essentials, and service trust guarantees.
* **Product Discovery**: Fast interactive search, department filtering (Electronics, Fashion, Accessories, Home & Living, Footwear), price ranges, and multi-criteria sorting.
* **Contiguous Product Detail Page (PDP)**: High-resolution product photography, detailed material descriptions, real-time inventory counts, and instant buy-now routing.
* **Persistent Cart Management**: Add to cart with quantity controls, local persistence, automatic complimentary shipping threshold calculation (free over ₹999).
* **Frictionless Checkout**: Structured shipping address capture (Full Name, Phone Number, Street, City, Pincode) with client and server validation.
* **Cash on Delivery (COD)**: Transparent doorstep payment method where customers pay on parcel arrival.
* **Order Confirmation & Lifecycle Tracking**: Order summary receipts with Order IDs, and historical tracking across statuses: `Order Placed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`.

### Administrator Experience
* **Protected Admin Portal**: Dedicated administrative login route (`/admin/login`) with role-based JWT verification.
* **Operational Dashboard**: Real-time KPIs for Total Products, Registered Customers, Total Orders, and Confirmed Revenue with live database status.
* **Product Catalog Management**: Create new merchandise with custom photography presets, update descriptions/prices/inventory, and delete products.
* **Order Fulfillment Pipeline**: Audit customer orders, inspect items and delivery addresses, and advance order statuses.
* **Customer Directory**: Audit registered customers with contact information and order volume metrics without exposing sensitive password hashes.

---

## 4. Technology Stack

### Frontend
* **React 19**: Modern component architecture with functional components and hooks.
* **Vite**: Ultra-fast build tool and development server.
* **React Router v7**: Declarative client-side routing with protected route guards.
* **Tailwind CSS v4**: Utility-first styling with custom editorial typography and warm neutral palette.
* **Lucide React**: Clean, accessible iconography (strictly zero emojis).

### Backend
* **Node.js**: Asynchronous event-driven runtime environment.
* **Express.js**: RESTful API server architecture.
* **JWT (JSON Web Tokens)**: Cryptographically signed bearer authentication.
* **Bcrypt.js**: One-way salted password hashing for credential security.
* **CORS**: Secure cross-origin resource sharing middleware.

### Database
* **MongoDB & Mongoose**: Document schemas for `User`, `Product`, and `Order` models.
* **Resilient Dual Storage**: Automatically connects to **MongoDB Atlas** when `MONGODB_URI` is provided; seamlessly falls back to a persistent JSON-backed database in development environments without external database dependencies.

---

## 5. User Module

| Path | Screen | Functionality |
| :--- | :--- | :--- |
| `/` | Home | Hero section, department highlights, featured essentials, standards banner |
| `/products` | Products Catalog | Search, department tabs, sorting, availability badges |
| `/products/:id` | Product Details | Product image, price, description, stock status, quantity selector, add to cart |
| `/cart` | Shopping Cart | Item list, steppers, subtotal, delivery calculation, checkout CTA |
| `/checkout` | Checkout | Address verification, Cash on Delivery confirmation |
| `/order-confirmation/:id` | Order Confirmation | Receipt with Order ID, date, total amount, status, actions |
| `/orders` | My Orders | Historical order cards, status badges, order breakdown modal |
| `/account` | Account Profile | Personal information, quick shortcuts, secure sign out |
| `/login` | Customer Sign In | Email/password login with demo account fast-fill |
| `/register` | Registration | Form validation, password checks, duplicate email prevention |

---

## 6. Admin Module

| Path | Screen | Functionality |
| :--- | :--- | :--- |
| `/admin/login` | Admin Sign In | Administrative authentication screen |
| `/admin/dashboard` | Dashboard | Metrics for Products, Customers, Orders, Revenue & recent transactions |
| `/admin/products` | Catalog List | Inventory table with inline edits, deletion, stock monitors |
| `/admin/products/add` | Add Product | Complete creation form with image presets and validation |
| `/admin/orders` | Orders Pipeline | Order review, delivery details, status dropdown updates |
| `/admin/customers` | Customer Directory | Registered customer table with contact information and order totals |

---

## 7. Database Architecture

### User Schema (`User`)
```typescript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  address: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
}
```

### Product Schema (`Product`)
```typescript
{
  name: { type: String, required: true },
  category: { type: String, enum: ['Electronics', 'Fashion', 'Accessories', 'Home & Living', 'Footwear'], required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 10 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Order Schema (`Order`)
```typescript
{
  user: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { type: String, enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Order Placed' },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 8. API Structure

### Authentication Endpoints (`/api/auth`)
* `POST /api/auth/register` — Create new customer account with bcrypt hashing
* `POST /api/auth/login` — Authenticate credentials and return JWT bearer token
* `GET /api/auth/me` — Retrieve authenticated user profile (`Bearer` token)
* `POST /api/auth/logout` — Terminate session

### Products Endpoints (`/api/products`)
* `GET /api/products` — Retrieve products with optional `category`, `search`, `sort`, `minPrice`, `maxPrice`
* `GET /api/products/:id` — Retrieve product details by ID
* `POST /api/products` — Create new product (Admin only)
* `PUT /api/products/:id` — Update existing product (Admin only)
* `DELETE /api/products/:id` — Delete product (Admin only)

### Orders Endpoints (`/api/orders`)
* `POST /api/orders` — Create customer order with Cash on Delivery (Customer only)
* `GET /api/orders/my-orders` — Retrieve logged-in customer's orders
* `GET /api/orders/:id` — Retrieve single order record
* `GET /api/orders/admin/all` — List all orders across customers (Admin only)
* `PUT /api/orders/admin/:id/status` — Update order fulfillment status (Admin only)

### Administrator Endpoints (`/api/admin`)
* `GET /api/admin/customers` — List registered customers with order counts (Admin only)
* `GET /api/admin/stats` — Dashboard statistics (Total products, orders, customers, revenue)

---

## 9. Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/trend-mart.git
   cd trend-mart
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

---

## 10. Environment Variables

Define the following in your `.env` file:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/trendmart?retryWrites=true&w=majority"
JWT_SECRET="trend_mart_jwt_production_secret_key_change_in_production"
APP_URL="http://localhost:3000"
```

---

## 11. Local Development Instructions

Start the unified full-stack dev server:
```bash
npm run dev
```
The server will boot Express on port 3000 and attach Vite middlewares:
- Frontend & Storefront: `http://localhost:3000`
- API Health Status: `http://localhost:3000/api/health`

### Pre-Configured Test Accounts:
* **Customer**:
  * Email: `customer@trendmart.com`
  * Password: `Customer@123`
* **Admin**:
  * Email: `admin@trendmart.com`
  * Password: `Admin@123`

---

## 12. Deployment Instructions

### Vercel Deployment (Frontend / Serverless)
1. Push the codebase to GitHub.
2. Link the repository in the Vercel dashboard.
3. Configure the environment variables (`MONGODB_URI`, `JWT_SECRET`) in Vercel Project Settings.
4. Set Build Command: `npm run build` and Output Directory: `dist`.

### Container / Cloud Run / Node Server Deployment
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   NODE_ENV=production npm start
   ```

---

## 13. Project Structure
```text
├── .data/                  # Persistent database store (fallback)
├── .env.example            # Environment variable template
├── index.html              # HTML entry point with fonts & metadata
├── metadata.json           # Application identity & capabilities
├── package.json            # Dependencies & build scripts
├── server.ts               # Express full-stack server entry point
├── src/
│   ├── assets/images/      # Generated high-resolution product photography
│   ├── components/
│   │   ├── common/         # Button, Input, EmptyState, LoadingState, ProtectedRoute
│   │   ├── layout/         # Navbar, AdminNavbar, Footer
│   │   └── products/       # ProductCard, ProductGrid
│   ├── context/
│   │   ├── AuthContext.tsx # User session & token management
│   │   └── CartContext.tsx # Shopping bag & checkout calculations
│   ├── pages/
│   │   ├── admin/          # AdminLogin, AdminDashboard, AdminProducts, AdminAddProduct, AdminCustomers, AdminOrders
│   │   ├── Account.tsx     # Customer account profile
│   │   ├── Cart.tsx        # Shopping cart view
│   │   ├── Checkout.tsx    # Delivery address & Cash on Delivery
│   │   ├── Help.tsx        # FAQ & Customer support
│   │   ├── Home.tsx        # Editorial landing page
│   │   ├── Login.tsx       # Customer sign-in
│   │   ├── MyOrders.tsx    # Order history & status viewer
│   │   ├── OrderConfirmation.tsx # Successful checkout screen
│   │   ├── ProductDetail.tsx # Contiguous purchase PDP view
│   │   ├── Products.tsx    # Product catalog with search & filters
│   │   └── Register.tsx    # Customer registration
│   ├── server/
│   │   ├── db.ts           # Mongoose schemas, Atlas connection & store
│   │   ├── middleware/     # JWT authentication & admin authorization
│   │   └── routes/         # authRoutes, productRoutes, orderRoutes, adminRoutes
│   ├── services/
│   │   └── api.ts          # Typed REST client with bearer token injection
│   ├── types/
│   │   └── index.ts        # TypeScript domain models & interfaces
│   ├── App.tsx             # Route definitions & layout wrappers
│   ├── index.css           # Tailwind CSS imports & typography rules
│   └── main.tsx            # React root mount
└── tsconfig.json           # TypeScript configuration
```

---
© 2026 Trend Mart. All Rights Reserved.

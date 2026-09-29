import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Mongoose document interfaces
export interface IUserDoc extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface IProductDoc extends Document {
  name: string;
  category: 'Electronics' | 'Fashion' | 'Accessories' | 'Home & Living' | 'Footwear';
  description: string;
  price: number;
  image: string;
  stock: number;
  featured?: boolean;
  rating?: number;
  highlightBadge?: string;
  createdAt: Date;
}

export interface IOrderDoc extends Document {
  user: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category?: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  paymentMethod: 'Cash on Delivery';
  status: 'Order Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}

// Mongoose Schemas
export const UserSchema = new Schema<IUserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  address: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

export const ProductSchema = new Schema<IProductDoc>({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Electronics', 'Fashion', 'Accessories', 'Home & Living', 'Footwear'],
    required: true,
  },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 10 },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  highlightBadge: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const OrderSchema = new Schema<IOrderDoc>({
  user: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      category: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: {
    type: String,
    enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order Placed',
  },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
export const ProductModel = mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);
export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);

// Initial Seed Products (Minimum 5 products in all 5 categories = 25 distinct products)
export const SEED_PRODUCTS = [
  // ================= ELECTRONICS (5 Products) =================
  {
    _id: 'prod_electronics_01',
    name: 'Wireless Studio Headphones',
    category: 'Electronics',
    price: 1999,
    description: 'Comfortable wireless over-ear headphones with balanced studio acoustics, 40mm titanium drivers, 30-hour battery life, and 24/7 technical warranty support.',
    image: '/src/assets/images/product_wireless_headphones_1790606677598.jpg',
    stock: 28,
    featured: true,
    highlightBadge: 'Bestseller',
    createdAt: new Date('2026-09-01T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_electronics_02',
    name: 'Titanium Smart Watch Series X',
    category: 'Electronics',
    price: 2999,
    description: 'Practical luxury smartwatch featuring precision optical heart rate tracking, sapphire glass screen, 7-day battery stamina, and 24/7 health monitoring sync.',
    image: '/src/assets/images/product_smart_watch_1790606690925.jpg',
    stock: 20,
    featured: true,
    highlightBadge: 'New Gen',
    createdAt: new Date('2026-09-02T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_electronics_03',
    name: 'Active Noise Cancelling True Wireless Earbuds',
    category: 'Electronics',
    price: 2499,
    description: 'Custom hybrid ANC earbuds with ambient transparency mode, dual beamforming microphones for crystal-clear calls, IPX5 splash resistance, and wireless charging case.',
    image: '/src/assets/images/prod_earbuds_anc_1790607582633.jpg',
    stock: 24,
    featured: true,
    highlightBadge: 'Editor Choice',
    createdAt: new Date('2026-09-03T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_electronics_04',
    name: 'Tactile Tenkeyless Mechanical Keyboard',
    category: 'Electronics',
    price: 3499,
    description: 'Acoustically dampened mechanical keyboard with hot-swappable switches, solid CNC aluminum chassis, sound-absorbing foam, and textured double-shot PBT keycaps.',
    image: '/src/assets/images/product_wireless_headphones_1790606677598.jpg',
    stock: 15,
    featured: false,
    highlightBadge: 'Pro Grade',
    createdAt: new Date('2026-09-04T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_electronics_05',
    name: 'MagSafe Fast Wireless Desktop Pad',
    category: 'Electronics',
    price: 1499,
    description: '15W rapid inductive desktop charger encased in anodized aircraft-grade aluminum and weighted non-slip silicone base with multi-device protection.',
    image: '/src/assets/images/product_smart_watch_1790606690925.jpg',
    stock: 32,
    featured: false,
    createdAt: new Date('2026-09-05T10:00:00Z').toISOString(),
  },

  // ================= FASHION (5 Products) =================
  {
    _id: 'prod_fashion_01',
    name: 'Heavyweight Cotton Canvas Overshirt',
    category: 'Fashion',
    price: 2199,
    description: 'Structured unlined overshirt tailored from 100% organic raw cotton canvas. Built for transitional layering across changing weather with horn-finish buttons.',
    image: '/src/assets/images/hero_lifestyle_vibrant_1790607646067.jpg',
    stock: 22,
    featured: true,
    highlightBadge: 'Signature Style',
    createdAt: new Date('2026-09-06T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_fashion_02',
    name: 'Pure Washed Linen Casual Shirt',
    category: 'Fashion',
    price: 1899,
    description: 'Pre-washed French flax linen shirt in earthy olive tones. Naturally breathable and temperature-regulating for versatile all-day comfort.',
    image: '/src/assets/images/prod_linen_shirt_1790607594631.jpg',
    stock: 19,
    featured: true,
    highlightBadge: 'Breathable Pure Linen',
    createdAt: new Date('2026-09-07T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_fashion_03',
    name: 'Merino Wool Minimalist Knit Sweater',
    category: 'Fashion',
    price: 2799,
    description: 'Spun from ultra-fine Australian Merino wool fibers. Soft, naturally odor-resistant, and pill-resistant for effortless everyday layering.',
    image: '/src/assets/images/prod_linen_shirt_1790607594631.jpg',
    stock: 16,
    featured: false,
    createdAt: new Date('2026-09-08T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_fashion_04',
    name: 'Tailored Everyday Chino Trousers',
    category: 'Fashion',
    price: 1799,
    description: 'Modern slim-straight chinos crafted with 2% elastane flex stretch. Designed to seamlessly transition from workspace meetings to evening downtime.',
    image: '/src/assets/images/hero_lifestyle_vibrant_1790607646067.jpg',
    stock: 25,
    featured: false,
    createdAt: new Date('2026-09-09T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_fashion_05',
    name: 'Weatherproof Everyday Utility Jacket',
    category: 'Fashion',
    price: 3699,
    description: 'Water-repellent shell with dual flap utility chest pockets, storm-resistant interior lining, and taped seam construction for light rain and wind protection.',
    image: '/src/assets/images/prod_linen_shirt_1790607594631.jpg',
    stock: 14,
    featured: false,
    highlightBadge: 'Weatherproof',
    createdAt: new Date('2026-09-10T10:00:00Z').toISOString(),
  },

  // ================= ACCESSORIES (5 Products) =================
  {
    _id: 'prod_accessories_01',
    name: 'Commuter Laptop Backpack',
    category: 'Accessories',
    price: 1299,
    description: 'Clean, structured commuter backpack with padded 16-inch laptop chamber, weatherproof twill exterior, hidden security passport pocket, and luggage trolley pass-through.',
    image: '/src/assets/images/product_laptop_backpack_1790606707953.jpg',
    stock: 35,
    featured: true,
    highlightBadge: 'Popular Carry',
    createdAt: new Date('2026-09-11T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_accessories_02',
    name: 'Handcrafted Full-Grain Leather Wallet',
    category: 'Accessories',
    price: 999,
    description: 'Artisan vegetable-tanned full-grain leather wallet with integrated RFID security shield, 6 dedicated card sleeves, and compact magnetic cash fold.',
    image: '/src/assets/images/prod_leather_wallet_1790607608773.jpg',
    stock: 30,
    featured: true,
    highlightBadge: 'Full-Grain Leather',
    createdAt: new Date('2026-09-12T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_accessories_03',
    name: 'Ballistic Canvas Weekender Duffle',
    category: 'Accessories',
    price: 3299,
    description: 'Spacious 42-liter travel holdall with dedicated ventilated shoe compartment, reinforced leather handles, and detachable padded shoulder strap.',
    image: '/src/assets/images/product_laptop_backpack_1790606707953.jpg',
    stock: 18,
    featured: false,
    createdAt: new Date('2026-09-13T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_accessories_04',
    name: 'Titanium Polarized Wayfarer Sunglasses',
    category: 'Accessories',
    price: 2199,
    description: 'Featherlight titanium alloy frame with UV400 anti-glare polarized lenses. Provides 100% UVA/UVB protection with durable stainless steel barrel hinges.',
    image: '/src/assets/images/prod_leather_wallet_1790607608773.jpg',
    stock: 22,
    featured: false,
    createdAt: new Date('2026-09-14T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_accessories_05',
    name: 'Solid Brass Minimalist Keyhook Carabiner',
    category: 'Accessories',
    price: 599,
    description: 'Precision wire-cut solid raw brass key carabiner that develops a natural heirloom patina over years of everyday pocket carry.',
    image: '/src/assets/images/prod_leather_wallet_1790607608773.jpg',
    stock: 45,
    featured: false,
    createdAt: new Date('2026-09-15T10:00:00Z').toISOString(),
  },

  // ================= HOME & LIVING (5 Products) =================
  {
    _id: 'prod_home_01',
    name: 'Architectural Brushed Steel Desk Lamp',
    category: 'Home & Living',
    price: 1899,
    description: 'Minimalist brushed steel task lamp with warm dimming LED spectrum (2700K - 4000K), intuitive touch dimmer, and 360-degree precision articulation.',
    image: '/src/assets/images/hero_editorial_showcase_1790606663415.jpg',
    stock: 14,
    featured: true,
    highlightBadge: 'Studio Pick',
    createdAt: new Date('2026-09-16T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_home_02',
    name: 'Textured Waffle Blanket & Linen Cushion Set',
    category: 'Home & Living',
    price: 1699,
    description: 'Heavyweight pure organic cotton waffle weave throw blanket paired with an unbleached linen accent cushion for warm, calming living spaces.',
    image: '/src/assets/images/prod_linen_cushion_1790607622252.jpg',
    stock: 26,
    featured: true,
    highlightBadge: 'Organic Cotton',
    createdAt: new Date('2026-09-17T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_home_03',
    name: 'Handcrafted Ceramic Slow Pourer Tumbler',
    category: 'Home & Living',
    price: 899,
    description: 'Stoneware coffee and tea vessel fired with tactile raw matte clay on the outside and high-gloss food-safe glaze interior to retain beverage warmth.',
    image: '/src/assets/images/hero_editorial_showcase_1790606663415.jpg',
    stock: 40,
    featured: false,
    createdAt: new Date('2026-09-18T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_home_04',
    name: 'Solid Walnut Desktop Organizer Stand',
    category: 'Home & Living',
    price: 1499,
    description: 'Sustainably harvested North American walnut monitor and laptop riser with integrated brass pen rest and cable routing channel.',
    image: '/src/assets/images/prod_linen_cushion_1790607622252.jpg',
    stock: 17,
    featured: false,
    createdAt: new Date('2026-09-19T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_home_05',
    name: 'Aromatherapy Amber Glass Botanical Candle',
    category: 'Home & Living',
    price: 699,
    description: '100% natural soy wax hand-poured candle infused with cedarwood, vetiver, and smoky tobacco essential oils. 55-hour clean burn time.',
    image: '/src/assets/images/hero_editorial_showcase_1790606663415.jpg',
    stock: 35,
    featured: false,
    createdAt: new Date('2026-09-20T10:00:00Z').toISOString(),
  },

  // ================= FOOTWEAR (5 Products) =================
  {
    _id: 'prod_footwear_01',
    name: 'Aero-Mesh Daily Running Shoes',
    category: 'Footwear',
    price: 2499,
    description: 'Featherlight performance running shoes engineered with high-rebound responsive foam sole and engineered breathable aerodynamic mesh for daily training.',
    image: '/src/assets/images/product_running_shoes_1790606718588.jpg',
    stock: 18,
    featured: true,
    highlightBadge: 'High Performance',
    createdAt: new Date('2026-09-21T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_footwear_02',
    name: 'Heritage Goodyear-Welted Leather Boots',
    category: 'Footwear',
    price: 4499,
    description: 'Full-grain pull-up leather service boots with resoleable Goodyear welt construction, storm welt stitching, and slip-resistant Commando rubber outsole.',
    image: '/src/assets/images/prod_leather_boots_1790607634763.jpg',
    stock: 12,
    featured: true,
    highlightBadge: 'Handcrafted Heritage',
    createdAt: new Date('2026-09-22T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_footwear_03',
    name: 'Raw Canvas Minimal Low-Top Sneakers',
    category: 'Footwear',
    price: 1999,
    description: 'Vulcanized natural gum rubber sole paired with double-layered unbleached cotton canvas. Orthopedic molded insole for all-day city walks.',
    image: '/src/assets/images/product_running_shoes_1790606718588.jpg',
    stock: 25,
    featured: false,
    createdAt: new Date('2026-09-23T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_footwear_04',
    name: 'Suede Moccasin Loafers',
    category: 'Footwear',
    price: 2699,
    description: 'Supple Italian split suede loafers with cushioned leather lining and lightweight rubber studded driving sole for unmatched comfort.',
    image: '/src/assets/images/prod_leather_boots_1790607634763.jpg',
    stock: 15,
    featured: false,
    createdAt: new Date('2026-09-24T10:00:00Z').toISOString(),
  },
  {
    _id: 'prod_footwear_05',
    name: 'Ergonomic Trail Hiking Sandals',
    category: 'Footwear',
    price: 1599,
    description: 'Quick-drying hydrophobic webbing straps with triple hook-and-loop adjustments and anatomical EVA footbed for outdoor trails and rivers.',
    image: '/src/assets/images/product_running_shoes_1790606718588.jpg',
    stock: 20,
    featured: false,
    createdAt: new Date('2026-09-25T10:00:00Z').toISOString(),
  },
];

// Persistent local data store when MongoDB is not yet connected
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

interface LocalDatabase {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    address?: string;
    role: 'user' | 'admin';
    createdAt: string;
  }>;
  products: Array<typeof SEED_PRODUCTS[0]>;
  orders: Array<{
    _id: string;
    user: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
      category?: string;
    }>;
    totalAmount: number;
    shippingAddress: {
      fullName: string;
      phone: string;
      address: string;
      city: string;
      pincode: string;
    };
    paymentMethod: 'Cash on Delivery';
    status: 'Order Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
  }>;
}

let memoryDb: LocalDatabase | null = null;
let isMongoConnected = false;

export function loadLocalDb(): LocalDatabase {
  if (memoryDb) return memoryDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure seed has full 25 items if previous local store was smaller
      if (parsed.products && parsed.products.length < SEED_PRODUCTS.length) {
        parsed.products = [...SEED_PRODUCTS];
      }
      memoryDb = parsed;
      return memoryDb!;
    }
  } catch (err) {
    console.warn('[DB] Could not read local file, using memory store', err);
  }

  // Initial seed
  const defaultAdminHash = bcrypt.hashSync('Admin@123', 10);
  const defaultCustomerHash = bcrypt.hashSync('Customer@123', 10);

  memoryDb = {
    users: [
      {
        _id: 'user_admin_01',
        name: 'Trend Mart Administrator',
        email: 'admin@trendmart.com',
        phone: '+91 98000 11223',
        address: 'Trend Mart Headquarters, Bangalore',
        passwordHash: defaultAdminHash,
        role: 'admin',
        createdAt: new Date('2026-09-01T08:00:00Z').toISOString(),
      },
      {
        _id: 'user_customer_01',
        name: 'Rahul Sharma',
        email: 'customer@trendmart.com',
        phone: '+91 98765 43210',
        address: '42 Palm Grove Avenue, Indiranagar, Bengaluru, 560038',
        passwordHash: defaultCustomerHash,
        role: 'user',
        createdAt: new Date('2026-09-05T09:30:00Z').toISOString(),
      },
    ],
    products: [...SEED_PRODUCTS],
    orders: [
      {
        _id: 'TM-2026-8941',
        user: 'user_customer_01',
        customerName: 'Rahul Sharma',
        customerEmail: 'customer@trendmart.com',
        customerPhone: '+91 98765 43210',
        items: [
          {
            productId: 'prod_electronics_01',
            name: 'Wireless Studio Headphones',
            price: 1999,
            quantity: 1,
            image: '/src/assets/images/product_wireless_headphones_1790606677598.jpg',
            category: 'Electronics',
          },
          {
            productId: 'prod_accessories_01',
            name: 'Commuter Laptop Backpack',
            price: 1299,
            quantity: 1,
            image: '/src/assets/images/product_laptop_backpack_1790606707953.jpg',
            category: 'Accessories',
          },
        ],
        totalAmount: 3298,
        shippingAddress: {
          fullName: 'Rahul Sharma',
          phone: '+91 98765 43210',
          address: '42 Palm Grove Avenue, Indiranagar',
          city: 'Bengaluru',
          pincode: '560038',
        },
        paymentMethod: 'Cash on Delivery',
        status: 'Processing',
        createdAt: new Date('2026-09-24T14:20:00Z').toISOString(),
      },
    ],
  };

  saveLocalDb();
  return memoryDb!;
}

export function saveLocalDb() {
  if (!memoryDb) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist data to disk', err);
  }
}

// Database initialisation
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.startsWith('mongodb')) {
    try {
      console.log('[DB] Connecting to MongoDB Atlas...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      isMongoConnected = true;
      console.log('[DB] Successfully connected to MongoDB Atlas.');

      const count = await ProductModel.countDocuments();
      if (count === 0) {
        console.log('[DB] Seeding full 25 products in MongoDB Atlas...');
        await ProductModel.insertMany(SEED_PRODUCTS);
      }
      return;
    } catch (err) {
      console.warn('[DB] MongoDB connection failed or timed out. Falling back to persistent local store:', (err as Error).message);
    }
  } else {
    console.log('[DB] No MONGODB_URI provided in environment. Initializing resilient persistent store.');
  }

  loadLocalDb();
}

export function getIsMongoConnected(): boolean {
  return isMongoConnected;
}

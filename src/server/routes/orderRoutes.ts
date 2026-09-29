import { Router, Response } from 'express';
import {
  OrderModel,
  ProductModel,
  loadLocalDb,
  saveLocalDb,
  getIsMongoConnected,
} from '../db.ts';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/orders (Customer checkout)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping and delivery information is required.' });
    }

    const { fullName, phone, address, city, pincode } = shippingAddress;
    if (!fullName || !phone || !address || !city || !pincode) {
      return res.status(400).json({
        error: 'Complete delivery details required: full name, phone number, street address, city, and pincode.',
      });
    }

    // Phone validation
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 8) {
      return res.status(400).json({ error: 'Please enter a valid phone number for delivery updates.' });
    }

    // Pincode validation
    if (pincode.trim().length < 4) {
      return res.status(400).json({ error: 'Please enter a valid postal pincode.' });
    }

    const orderPaymentMethod = 'Cash on Delivery';

    if (getIsMongoConnected()) {
      // Calculate total & verify stock
      let calculatedTotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          return res.status(400).json({ error: `Product "${item.name}" is no longer available.` });
        }

        const qty = Number(item.quantity);
        if (isNaN(qty) || qty <= 0) {
          return res.status(400).json({ error: `Invalid quantity specified for ${item.name}.` });
        }

        if (product.stock < qty) {
          return res.status(400).json({
            error: `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`,
          });
        }

        // Deduct stock
        product.stock -= qty;
        await product.save();

        calculatedTotal += product.price * qty;
        orderItems.push({
          productId: product._id.toString(),
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image,
          category: product.category,
        });
      }

      const newOrder = await OrderModel.create({
        user: req.user!._id,
        customerName: fullName.trim(),
        customerEmail: req.user!.email,
        customerPhone: phone.trim(),
        items: orderItems,
        totalAmount: calculatedTotal,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
        paymentMethod: orderPaymentMethod,
        status: 'Order Placed',
        createdAt: new Date(),
      });

      return res.status(201).json({
        message: 'Order placed successfully.',
        order: newOrder,
      });
    }

    // Local DB
    const db = loadLocalDb();
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = db.products.find(p => p._id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product "${item.name}" is no longer available.` });
      }

      const qty = Number(item.quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ error: `Invalid quantity specified for ${item.name}.` });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`,
        });
      }

      product.stock -= qty;
      calculatedTotal += product.price * qty;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
        category: product.category,
      });
    }

    const orderNumber = `TM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      _id: orderNumber,
      user: req.user!._id,
      customerName: fullName.trim(),
      customerEmail: req.user!.email,
      customerPhone: phone.trim(),
      items: orderItems,
      totalAmount: calculatedTotal,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      },
      paymentMethod: 'Cash on Delivery' as const,
      status: 'Order Placed' as const,
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    saveLocalDb();

    return res.status(201).json({
      message: 'Order placed successfully.',
      order: newOrder,
    });
  } catch (err) {
    console.error('[Create Order Error]', err);
    return res.status(500).json({ error: 'Failed to complete order checkout. Please try again.' });
  }
});

// GET /api/orders/my-orders (Customer orders)
router.get('/my-orders', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    if (getIsMongoConnected()) {
      const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
      return res.json({ orders });
    }

    const db = loadLocalDb();
    const orders = db.orders
      .filter(o => o.user === userId || o.customerEmail === req.user?.email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({ orders });
  } catch (err) {
    console.error('[Get My Orders Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve your order history.' });
  }
});

// GET /api/orders/:id (Customer or Admin)
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;
    const isAdmin = req.user!.role === 'admin';

    if (getIsMongoConnected()) {
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }

      if (!isAdmin && order.user.toString() !== userId && order.customerEmail !== req.user?.email) {
        return res.status(403).json({ error: 'Access denied to this order record.' });
      }

      return res.json({ order });
    }

    const db = loadLocalDb();
    const order = db.orders.find(o => o._id === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (!isAdmin && order.user !== userId && order.customerEmail !== req.user?.email) {
      return res.status(403).json({ error: 'Access denied to this order record.' });
    }

    return res.json({ order });
  } catch (err) {
    console.error('[Get Order Details Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve order details.' });
  }
});

// GET /api/admin/orders (Admin list all orders)
router.get('/admin/all', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    if (getIsMongoConnected()) {
      const orders = await OrderModel.find().sort({ createdAt: -1 });
      return res.json({ orders, total: orders.length });
    }

    const db = loadLocalDb();
    const orders = [...db.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.json({ orders, total: orders.length });
  } catch (err) {
    console.error('[Admin Get Orders Error]', err);
    return res.status(500).json({ error: 'Failed to load customer orders.' });
  }
});

// PUT /api/admin/orders/:id/status (Admin status update)
router.put('/admin/:id/status', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    if (getIsMongoConnected()) {
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }

      order.status = status;
      await order.save();
      return res.json({ message: 'Order status updated successfully.', order });
    }

    const db = loadLocalDb();
    const order = db.orders.find(o => o._id === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = status;
    saveLocalDb();

    return res.json({ message: 'Order status updated successfully.', order });
  } catch (err) {
    console.error('[Admin Update Order Status Error]', err);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;

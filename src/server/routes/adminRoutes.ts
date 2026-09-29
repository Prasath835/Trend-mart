import { Router, Response } from 'express';
import {
  UserModel,
  ProductModel,
  OrderModel,
  loadLocalDb,
  getIsMongoConnected,
} from '../db.ts';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/admin/customers
router.get('/customers', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    if (getIsMongoConnected()) {
      const customers = await UserModel.find({ role: 'user' }).select('-passwordHash').sort({ createdAt: -1 });

      // Attach order metrics for each customer
      const customersWithStats = await Promise.all(
        customers.map(async (c) => {
          const orderCount = await OrderModel.countDocuments({ user: c._id });
          const userObj = c.toObject();
          return {
            ...userObj,
            ordersCount: orderCount,
          };
        })
      );

      return res.json({ customers: customersWithStats, total: customersWithStats.length });
    }

    const db = loadLocalDb();
    const customers = db.users
      .filter(u => u.role === 'user')
      .map(u => {
        const { passwordHash: _, ...safeUser } = u;
        const ordersCount = db.orders.filter(o => o.user === u._id || o.customerEmail === u.email).length;
        return {
          ...safeUser,
          ordersCount,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({ customers, total: customers.length });
  } catch (err) {
    console.error('[Admin Get Customers Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve registered customers directory.' });
  }
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    if (getIsMongoConnected()) {
      const totalProducts = await ProductModel.countDocuments();
      const totalCustomers = await UserModel.countDocuments({ role: 'user' });
      const totalOrders = await OrderModel.countDocuments();

      const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(5);
      const allOrders = await OrderModel.find();
      const totalRevenue = allOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return res.json({
        totalProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,
        recentOrders: orders,
        isMongoConnected: true,
      });
    }

    const db = loadLocalDb();
    const totalProducts = db.products.length;
    const totalCustomers = db.users.filter(u => u.role === 'user').length;
    const totalOrders = db.orders.length;
    const totalRevenue = db.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const recentOrders = [...db.orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return res.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      recentOrders,
      isMongoConnected: false,
    });
  } catch (err) {
    console.error('[Admin Stats Error]', err);
    return res.status(500).json({ error: 'Failed to calculate administrator statistics.' });
  }
});

export default router;

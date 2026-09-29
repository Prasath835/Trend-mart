import { Router, Request, Response } from 'express';
import {
  ProductModel,
  loadLocalDb,
  saveLocalDb,
  getIsMongoConnected,
} from '../db.ts';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;

    if (getIsMongoConnected()) {
      const filter: Record<string, any> = {};

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (search && typeof search === 'string' && search.trim() !== '') {
        const query = search.trim();
        filter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ];
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      let query = ProductModel.find(filter);

      if (sort === 'price-asc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'price-desc') {
        query = query.sort({ price: -1 });
      } else if (sort === 'newest') {
        query = query.sort({ createdAt: -1 });
      } else {
        // default: featured first, then newest
        query = query.sort({ featured: -1, createdAt: -1 });
      }

      const products = await query.exec();
      return res.json({ products, total: products.length });
    }

    // Local DB fallback
    const db = loadLocalDb();
    let products = [...db.products];

    // Filter by category
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    // Filter by search query
    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }

    // Filter by price
    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: featured first, then newest
      products.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return res.json({ products, total: products.length });
  } catch (err) {
    console.error('[Get Products Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve products catalogue.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (getIsMongoConnected()) {
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      return res.json({ product });
    }

    const db = loadLocalDb();
    const product = db.products.find(p => p._id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json({ product });
  } catch (err) {
    console.error('[Get Single Product Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
});

// POST /api/products (Admin only)
router.post('/', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, category, price, description, stock, image, featured } = req.body;

    if (!name || !category || price === undefined || !description || stock === undefined) {
      return res.status(400).json({ error: 'Name, category, price, description, and stock are required fields.' });
    }

    const validCategories = ['Electronics', 'Fashion', 'Accessories', 'Home & Living', 'Footwear'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ error: 'Stock must be a valid positive number.' });
    }

    const productImage = image && image.trim() !== ''
      ? image.trim()
      : '/src/assets/images/hero_editorial_showcase_1790606663415.jpg';

    if (getIsMongoConnected()) {
      const newProduct = await ProductModel.create({
        name: name.trim(),
        category,
        price: parsedPrice,
        description: description.trim(),
        stock: parsedStock,
        image: productImage,
        featured: Boolean(featured),
        createdAt: new Date(),
      });

      return res.status(201).json({
        message: 'Product created successfully.',
        product: newProduct,
      });
    }

    // Local DB
    const db = loadLocalDb();
    const newProduct = {
      _id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      category,
      price: parsedPrice,
      description: description.trim(),
      stock: parsedStock,
      image: productImage,
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveLocalDb();

    return res.status(201).json({
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (err) {
    console.error('[Create Product Error]', err);
    return res.status(500).json({ error: 'Failed to add product to catalog.' });
  }
});

// PUT /api/products/:id (Admin only)
router.put('/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, stock, image, featured } = req.body;

    if (getIsMongoConnected()) {
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      if (name) product.name = name.trim();
      if (category) product.category = category;
      if (price !== undefined) product.price = Number(price);
      if (description) product.description = description.trim();
      if (stock !== undefined) product.stock = Number(stock);
      if (image) product.image = image.trim();
      if (featured !== undefined) product.featured = Boolean(featured);

      await product.save();
      return res.json({ message: 'Product updated successfully.', product });
    }

    const db = loadLocalDb();
    const index = db.products.findIndex(p => p._id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const existing = db.products[index];
    const updated = {
      ...existing,
      name: name ? name.trim() : existing.name,
      category: category || existing.category,
      price: price !== undefined ? Number(price) : existing.price,
      description: description ? description.trim() : existing.description,
      stock: stock !== undefined ? Number(stock) : existing.stock,
      image: image ? image.trim() : existing.image,
      featured: featured !== undefined ? Boolean(featured) : existing.featured,
    };

    db.products[index] = updated;
    saveLocalDb();

    return res.json({ message: 'Product updated successfully.', product: updated });
  } catch (err) {
    console.error('[Update Product Error]', err);
    return res.status(500).json({ error: 'Failed to update product details.' });
  }
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (getIsMongoConnected()) {
      const deleted = await ProductModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      return res.json({ message: 'Product removed successfully.' });
    }

    const db = loadLocalDb();
    const index = db.products.findIndex(p => p._id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.products.splice(index, 1);
    saveLocalDb();

    return res.json({ message: 'Product removed successfully.' });
  } catch (err) {
    console.error('[Delete Product Error]', err);
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});

export default router;

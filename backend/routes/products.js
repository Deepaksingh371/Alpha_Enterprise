const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

// Helper: parse specifications sent as JSON string (from multipart form) or array
const parseSpecifications = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ---------- PUBLIC ROUTES ----------

// @route   GET /api/products
// @desc    List active products, with optional search & category filter
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = { status: 'Active' };

    if (category && category !== 'All') query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total, categories] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
      Product.distinct('category', { status: 'Active' }),
    ]);

    res.json({
      success: true,
      products,
      categories,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/products/featured
// @desc    Get a handful of featured (most recent active) products for homepage
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'Active' }).sort({ createdAt: -1 }).limit(6);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/products/:id
// @desc    Get single active product
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.status !== 'Active') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// ---------- ADMIN ROUTES ----------

// @route   GET /api/products/admin/all
// @desc    List all products (Active + Inactive) for admin panel
// @access  Private
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/products
// @desc    Create product with images
// @access  Private
router.post('/', protect, upload.array('images', 8), async (req, res, next) => {
  try {
    const { name, category, description, status } = req.body;
    if (!name || !category || !description) {
      return res.status(400).json({ success: false, message: 'Name, category and description are required' });
    }

    const images = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));

    const product = await Product.create({
      name,
      category,
      description,
      specifications: parseSpecifications(req.body.specifications),
      status: status || 'Active',
      images,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product fields, optionally append new images / remove existing ones
// @access  Private
router.put('/:id', protect, upload.array('newImages', 8), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { name, category, description, status, removedImageIds } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (status) product.status = status;
    if (req.body.specifications) product.specifications = parseSpecifications(req.body.specifications);

    // Remove images the admin deleted
    if (removedImageIds) {
      const toRemove = JSON.parse(removedImageIds); // array of publicId
      for (const publicId of toRemove) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error('Cloudinary destroy failed for', publicId, e.message);
        }
      }
      product.images = product.images.filter((img) => !toRemove.includes(img.publicId));
    }

    // Append newly uploaded images
    if (req.files && req.files.length) {
      const newImages = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product and its Cloudinary images
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    for (const img of product.images) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch (e) {
        console.error('Cloudinary destroy failed for', img.publicId, e.message);
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/products/meta/categories
// @desc    All distinct categories (for admin dropdown, includes inactive products' categories)
// @access  Private
router.get('/meta/categories', protect, async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

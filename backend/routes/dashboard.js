const express = require('express');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Overview counts + recents for admin dashboard
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const [totalProducts, activeProducts, totalEnquiries, newEnquiries, recentEnquiries, recentProducts] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ status: 'Active' }),
        Enquiry.countDocuments(),
        Enquiry.countDocuments({ status: 'New' }),
        Enquiry.find().sort({ createdAt: -1 }).limit(5),
        Product.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      stats: { totalProducts, activeProducts, totalEnquiries, newEnquiries },
      recentEnquiries,
      recentProducts,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

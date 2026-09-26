const express = require('express');
const rateLimit = require('express-rate-limit');
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');
const { sendEnquiryNotification } = require('../utils/sendEmail');

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiries submitted. Please try again later.' },
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @route   POST /api/enquiries
// @desc    Submit a product enquiry
// @access  Public
router.post('/', enquiryLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, companyName, productName, productId, message } = req.body;

    if (!name || !email || !phone || !companyName || !productName) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, company name and product name are required',
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      productName: productName.trim(),
      productId: productId || undefined,
      message: (message || '').trim(),
    });
    const io = req.app.get('io');

io.emit('newEnquiry', {
  id: enquiry._id,
  name: enquiry.name,
  companyName: enquiry.companyName,
  productName: enquiry.productName,
  createdAt: enquiry.createdAt
});

    // Fire-and-forget email notification; don't block the response on it
    sendEnquiryNotification(enquiry).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
      enquiry,
    });
  } catch (err) {
    next(err);
  }
});

// ---------- ADMIN ROUTES ----------

// @route   GET /api/enquiries
// @desc    List all enquiries with search/filter/pagination
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Enquiry.countDocuments(query),
    ]);

    res.json({
      success: true,
      enquiries,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/enquiries/:id
// @desc    Get single enquiry
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, enquiry });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/enquiries/:id
// @desc    Update enquiry status
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    if (status) enquiry.status = status;
    await enquiry.save();
    res.json({ success: true, enquiry });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete enquiry
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    await enquiry.deleteOne();
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);

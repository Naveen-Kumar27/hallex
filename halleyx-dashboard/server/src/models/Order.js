const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    streetAddress: String,
    city: String,
    stateProvince: String,
    postalCode: String,
    country: String
  },
  orderInfo: {
    product: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: Number,
    status: { 
      type: String, 
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    createdBy: String,
    orderDate: { type: Date, default: Date.now },
  }
}, { timestamps: true });

// Virtual for totalAmount
orderSchema.virtual('totalAmount').get(function() {
  return (this.orderInfo.quantity || 0) * (this.orderInfo.unitPrice || 0);
});

// Setting toJSON and toObject to include virtuals
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

// Pre-save hook to calculate totalAmount automatically
orderSchema.pre('save', function(next) {
  if (this.orderInfo.quantity && this.orderInfo.unitPrice) {
    this.orderInfo.totalAmount = this.orderInfo.quantity * this.orderInfo.unitPrice;
  }
  next();
});

// Optimized Indexes for analytics and date filtering
orderSchema.index({ 'orderInfo.orderDate': -1 });
orderSchema.index({ 'orderInfo.status': 1 });

module.exports = mongoose.model('Order', orderSchema);

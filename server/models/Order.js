const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

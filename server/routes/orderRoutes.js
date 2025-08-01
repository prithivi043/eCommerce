const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/orderController');

// POST /api/orders
router.post('/orders', async (req, res) => {
  try {
    const { items, totalAmount, customerName } = req.body;
    const newOrder = new Order({ items, totalAmount, customerName, status: 'Pending' });
    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ message: 'Could not save order' });
  }
});

router.get('/', getAllOrders);

module.exports = router;

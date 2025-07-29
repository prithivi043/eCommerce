// routes/customers.js

const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// CREATE Customer
router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create customer', error: err.message });
  }
});

// READ All Customers (with optional filters)
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
});

// READ Single Customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer', error: err.message });
  }
});

// UPDATE Customer Info
router.put('/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// DELETE Customer
router.delete('/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

// BLOCK / UNBLOCK Customer
router.patch('/:id/block', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.isBlocked = !customer.isBlocked;
    await customer.save();

    res.json({ message: `Customer ${customer.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling block status', error: err.message });
  }
});

// IMPERSONATE Customer (Session Switch)
router.post('/:id/impersonate', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Simulate session switching: Store in session (or issue a token in real app)
    req.session.impersonateUser = customer._id;
    res.json({ message: 'Impersonation started', customerId: customer._id });
  } catch (err) {
    res.status(500).json({ message: 'Impersonation failed', error: err.message });
  }
});

exports = router;
// Export the router
module.exports = router;
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const { body, validationResult } = require('express-validator');
//const authenticateJWT = require('../middlewares/authenticateJWT');

// Middleware to authenticate JWT token
//router.use(authenticateJWT);

// POST /transactions: Add a new transaction
router.post('/', [
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense').escape(),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number').toFloat(),
    body('date').isISO8601().withMessage('Date must be in ISO8601 format (YYYY-MM-DD)').toDate()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, date } = req.body;
    const transaction = new Transaction({ type, amount, date });
    await transaction.save();
    res.status(201).json({ id: transaction._id });
});

// GET /transactions: Retrieve transactions
router.get('/', async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
});

// GET /transactions/:id: Retrieve a specific transaction
router.get('/:id', async (req, res) => {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
});

// DELETE /transactions/:id: Delete a specific transaction
router.delete('/:id', async (req, res) => {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
    }
    await transaction.remove();
    res.json({ message: "Transaction deleted successfully" });
});

module.exports = router;


const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Get all items (Public)
router.get('/', async (req, res) => {
    try {
        const { type, category, search, user_id } = req.query;
        let query = {};

        if (user_id) query.user_id = user_id;

        if (type) query.status = type.toLowerCase();
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const items = await Item.find(query).populate('user_id', 'full_name email').sort({ created_at: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single item
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('user_id', 'full_name email');
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create item (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            user_id: req.user.id
        });
        const item = await newItem.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update item (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Check ownership or admin
        if (item.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        item = await Item.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete item (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Check ownership or admin
        if (item.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

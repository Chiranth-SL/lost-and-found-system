
const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Get my claims or claims for my items
router.get('/', auth, async (req, res) => {
    try {
        // If param 'type=my-claims' -> claims I made
        // If param 'type=claims-received' -> claims on my items
        // If param 'item_id' -> claims for specific item (if I own it)
        const { type, item_id } = req.query;

        if (item_id) {
            const item = await Item.findById(item_id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
            // Check if user owns the item
            if (item.user_id.toString() !== req.user.id) {
                return res.status(403).json({ error: 'Not authorized' });
            }
            const claims = await Claim.find({ item_id }).populate('claimant_id', 'full_name email');
            return res.json(claims);
        }

        if (type === 'my-claims') {
            const claims = await Claim.find({ claimant_id: req.user.id })
                .populate('item_id')
                .sort({ created_at: -1 });
            return res.json(claims);
        } else {
            // Find items owned by user
            const myItems = await Item.find({ user_id: req.user.id });
            const myItemIds = myItems.map(item => item._id);

            const claims = await Claim.find({ item_id: { $in: myItemIds } })
                .populate('item_id')
                .populate('claimant_id', 'full_name email')
                .sort({ created_at: -1 });
            return res.json(claims);
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create claim (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const { item_id, proof_description } = req.body;

        // Check if already claimed by this user
        const existing = await Claim.findOne({ item_id, claimant_id: req.user.id });
        if (existing) {
            return res.status(400).json({ error: 'You have already claimed this item.' });
        }

        const claim = new Claim({
            item_id,
            claimant_id: req.user.id,
            proof_description
        });

        await claim.save();
        res.status(201).json(claim);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update claim status (Protected: Item Owner only)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const claim = await Claim.findById(req.params.id).populate('item_id');

        if (!claim) return res.status(404).json({ error: 'Claim not found' });

        // Verify item exists
        if (!claim.item_id) {
            return res.status(404).json({ error: 'Item associated with this claim not found' });
        }

        // Verify user owns the item being claimed
        if (claim.item_id.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to manage this claim' });
        }

        claim.status = status;
        await claim.save();

        // If approved, maybe update item status to 'claimed'?
        if (status === 'approved') {
            await Item.findByIdAndUpdate(claim.item_id._id, { status: 'claimed' });
        }

        res.json(claim);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

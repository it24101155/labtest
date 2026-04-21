const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Item = require('../models/Item');

const localItems = [];
const allowLocalFallback = process.env.ALLOW_LOCAL_FALLBACK === 'true';

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function validatePayload(body) {
  const name = String(body.name || '').trim();
  const description = String(body.description || '').trim();
  const price = Number(body.price);

  if (!name) return { error: 'Name is required' };
  if (!description) return { error: 'Description is required' };
  if (!Number.isFinite(price)) return { error: 'Price must be a valid number' };

  return { value: { name, description, price } };
}

// GET all items
router.get('/', async (req, res) => {
  if (!isDbConnected()) {
    if (!allowLocalFallback) {
      return res.status(503).json({ message: 'Database is not connected' });
    }

    return res.json(localItems);
  }

  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create item
router.post('/', async (req, res) => {
  const validation = validatePayload(req.body);
  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  if (!isDbConnected()) {
    if (!allowLocalFallback) {
      return res.status(503).json({ message: 'Database is not connected' });
    }

    const now = new Date();
    const localItem = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...validation.value,
      createdAt: now,
      updatedAt: now,
      __v: 0,
    };

    localItems.push(localItem);
    return res.status(201).json(localItem);
  }

  const item = new Item({
    ...validation.value,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  if (!isDbConnected()) {
    if (!allowLocalFallback) {
      return res.status(503).json({ message: 'Database is not connected' });
    }

    const index = localItems.findIndex((item) => item._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    localItems.splice(index, 1);
    return res.json({ message: 'Item deleted' });
  }

  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update item
router.put('/:id', async (req, res) => {
  const validation = validatePayload(req.body);
  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  if (!isDbConnected()) {
    if (!allowLocalFallback) {
      return res.status(503).json({ message: 'Database is not connected' });
    }

    const index = localItems.findIndex((item) => item._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    localItems[index] = {
      ...localItems[index],
      ...validation.value,
      updatedAt: new Date(),
    };

    return res.json(localItems[index]);
  }

  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, validation.value, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
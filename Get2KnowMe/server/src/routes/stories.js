import express from 'express';
import Story from '../models/Story.js';
import authenticateTokenMiddleware from '../middleware/authenticateTokenMiddleware.js';
const router = express.Router();

// Create a new story (authenticated)
router.post('/', authenticateTokenMiddleware, async (req, res) => {
  try {
    const { name, story } = req.body;
    if (!name || !story) {
      return res.status(400).json({ error: 'Name and story are required.' });
    }
    const newStory = new Story({ name, story, user: req.user._id });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Update a story by ID (authenticated, only owner)
router.put('/:id', authenticateTokenMiddleware, async (req, res) => {
  try {
    const { name, story } = req.body;
    if (!name || !story) {
      return res.status(400).json({ error: 'Name and story are required.' });
    }
    const existing = await Story.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Story not found.' });
    if (existing.user.toString() !== req.user._id) {
      return res.status(403).json({ error: 'You are not authorized to edit this story.' });
    }
    existing.name = name;
    existing.story = story;
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Delete a story by ID (authenticated, only owner)
router.delete('/:id', authenticateTokenMiddleware, async (req, res) => {
  try {
    const existing = await Story.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Story not found.' });
    if (existing.user.toString() !== req.user._id) {
      return res.status(403).json({ error: 'You are not authorized to delete this story.' });
    }
    await existing.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get all stories (most recent first)
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;

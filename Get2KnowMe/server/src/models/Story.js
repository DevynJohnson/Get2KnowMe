import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 40,
  },
  story: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Story', StorySchema);

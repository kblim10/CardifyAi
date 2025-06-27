const mongoose = require('mongoose');

const CardReviewDataSchema = new mongoose.Schema({
  easeFactor: {
    type: Number,
    default: 2.5,
  },
  interval: {
    type: Number,
    default: 0,
  },
  repetitions: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
    default: Date.now,
  },
  lastReviewedAt: {
    type: Date,
  },
});

const CardSchema = new mongoose.Schema(
  {
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck',
      required: true,
    },
    frontContent: {
      type: String,
      required: [true, 'Konten depan kartu diperlukan'],
      trim: true,
    },
    backContent: {
      type: String,
      required: [true, 'Konten belakang kartu diperlukan'],
      trim: true,
    },
    tags: {
      type: [String],
    },
    mediaPath: {
      type: String,
    },
    srsData: {
      type: CardReviewDataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Card', CardSchema); 
const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul deck diperlukan'],
      trim: true,
      maxlength: [100, 'Judul tidak boleh lebih dari 100 karakter'],
    },
    description: {
      type: String,
      maxlength: [500, 'Deskripsi tidak boleh lebih dari 500 karakter'],
    },
    coverImagePath: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Deck', DeckSchema); 
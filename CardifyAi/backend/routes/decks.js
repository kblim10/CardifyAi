const express = require('express');
const router = express.Router();
const {
  getDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck,
  getUserDecks,
} = require('../controllers/decks');
const { protect } = require('../middleware/auth');

router.route('/').get(getDecks).post(protect, createDeck);
router.route('/user').get(protect, getUserDecks);
router.route('/:id').get(getDeck).put(protect, updateDeck).delete(protect, deleteDeck);

module.exports = router; 
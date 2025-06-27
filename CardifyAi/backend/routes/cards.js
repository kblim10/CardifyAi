const express = require('express');
const router = express.Router();
const {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  getDeckCards,
  updateCardSRS,
} = require('../controllers/cards');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getCards).post(protect, createCard);
router.route('/deck/:deckId').get(protect, getDeckCards);
router.route('/:id').get(protect, getCard).put(protect, updateCard).delete(protect, deleteCard);
router.route('/:id/srs').put(protect, updateCardSRS);

module.exports = router; 
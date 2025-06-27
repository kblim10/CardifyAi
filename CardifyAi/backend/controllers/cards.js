const Card = require('../models/Card');
const Deck = require('../models/Deck');

// @desc    Get all cards
// @route   GET /api/cards
// @access  Private
exports.getCards = async (req, res) => {
  try {
    // Get user's decks
    const userDecks = await Deck.find({ user: req.user.id }).select('_id');
    const userDeckIds = userDecks.map(deck => deck._id);

    // Get cards from user's decks
    const cards = await Card.find({ deckId: { $in: userDeckIds } });

    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get single card
// @route   GET /api/cards/:id
// @access  Private
exports.getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Kartu tidak ditemukan',
      });
    }

    // Check if user owns the deck this card belongs to
    const deck = await Deck.findById(card.deckId);
    if (!deck || deck.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses ke kartu ini',
      });
    }

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Create new card
// @route   POST /api/cards
// @access  Private
exports.createCard = async (req, res) => {
  try {
    const { deckId } = req.body;

    // Check if deck exists and belongs to user
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({
        success: false,
        error: 'Deck tidak ditemukan',
      });
    }

    if (deck.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses untuk menambahkan kartu ke deck ini',
      });
    }

    const card = await Card.create(req.body);

    res.status(201).json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update card
// @route   PUT /api/cards/:id
// @access  Private
exports.updateCard = async (req, res) => {
  try {
    let card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Kartu tidak ditemukan',
      });
    }

    // Check if user owns the deck this card belongs to
    const deck = await Deck.findById(card.deckId);
    if (!deck || deck.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses untuk memperbarui kartu ini',
      });
    }

    card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete card
// @route   DELETE /api/cards/:id
// @access  Private
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Kartu tidak ditemukan',
      });
    }

    // Check if user owns the deck this card belongs to
    const deck = await Deck.findById(card.deckId);
    if (!deck || deck.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses untuk menghapus kartu ini',
      });
    }

    await card.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get cards for a specific deck
// @route   GET /api/cards/deck/:deckId
// @access  Private
exports.getDeckCards = async (req, res) => {
  try {
    const { deckId } = req.params;

    // Check if deck exists and belongs to user
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({
        success: false,
        error: 'Deck tidak ditemukan',
      });
    }

    if (deck.user.toString() !== req.user.id && !deck.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses ke kartu dalam deck ini',
      });
    }

    const cards = await Card.find({ deckId });

    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update card SRS data
// @route   PUT /api/cards/:id/srs
// @access  Private
exports.updateCardSRS = async (req, res) => {
  try {
    let card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Kartu tidak ditemukan',
      });
    }

    // Check if user owns the deck this card belongs to
    const deck = await Deck.findById(card.deckId);
    if (!deck || deck.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses untuk memperbarui kartu ini',
      });
    }

    // Update SRS data
    card = await Card.findByIdAndUpdate(
      req.params.id,
      { srsData: req.body.srsData },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
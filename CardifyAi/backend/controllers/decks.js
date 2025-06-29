const Deck = require('../models/Deck');

// @desc    Get all decks
// @route   GET /api/decks
// @access  Public
exports.getDecks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Deck.countDocuments({ isPublic: true });

    // Query
    const decks = await Deck.find({ isPublic: true })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Transform _id to id for consistency
    const transformedDecks = decks.map(deck => {
      const deckObj = deck.toObject();
      deckObj.id = deckObj._id;
      delete deckObj._id;
      delete deckObj.__v;
      return deckObj;
    });

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: transformedDecks.length,
      pagination,
      data: transformedDecks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get single deck
// @route   GET /api/decks/:id
// @access  Public
exports.getDeck = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is provided
    if (!id || id === 'undefined') {
      return res.status(400).json({
        success: false,
        error: 'ID deck tidak valid',
      });
    }

    const deck = await Deck.findById(id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: 'Deck tidak ditemukan',
      });
    }

    // Check if deck is private and not owned by the user
    if (!deck.isPublic && deck.user.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses ke deck ini',
      });
    }

    // Transform _id to id for consistency
    const deckObj = deck.toObject();
    deckObj.id = deckObj._id;
    delete deckObj._id;
    delete deckObj.__v;

    res.status(200).json({
      success: true,
      data: deckObj,
    });
  } catch (err) {
    console.error('Error in getDeck:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Create new deck
// @route   POST /api/decks
// @access  Private
exports.createDeck = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const deck = await Deck.create(req.body);

    res.status(201).json({
      success: true,
      data: deck,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update deck
// @route   PUT /api/decks/:id
// @access  Private
exports.updateDeck = async (req, res) => {
  try {
    let deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: 'Deck tidak ditemukan',
      });
    }

    // Make sure user is deck owner
    if (deck.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses untuk memperbarui deck ini',
      });
    }

    deck = await Deck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: deck,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete deck
// @route   DELETE /api/decks/:id
// @access  Private
exports.deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: 'Deck tidak ditemukan',
      });
    }

    // Make sure user is deck owner
    if (deck.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Tidak ada akses untuk menghapus deck ini',
      });
    }

    await deck.deleteOne();

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

// @desc    Get user decks
// @route   GET /api/decks/user
// @access  Private
exports.getUserDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: decks.length,
      data: decks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
}; 
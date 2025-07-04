import SQLite from 'react-native-sqlite-storage';
import { Deck, Card, ReviewSession } from '../types';

// Enable debugging in development
SQLite.DEBUG(__DEV__);
SQLite.enablePromise(true);

class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;

  // Initialize database
  async init(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: 'CardifyAi.db',
        location: 'default',
      });

      await this.createTables();
      // Database initialized successfully
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // Create tables
  private async createTables(): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS decks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        coverImage TEXT,
        cardCount INTEGER DEFAULT 0,
        userId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        lastReviewed TEXT,
        tags TEXT,
        isSynced INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        deckId TEXT NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        notes TEXT,
        images TEXT,
        tags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        nextReview TEXT NOT NULL,
        interval INTEGER DEFAULT 1,
        repetition INTEGER DEFAULT 0,
        efactor REAL DEFAULT 2.5,
        status TEXT DEFAULT 'new',
        isSynced INTEGER DEFAULT 0,
        FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS review_sessions (
        id TEXT PRIMARY KEY,
        deckId TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT,
        cardsReviewed INTEGER DEFAULT 0,
        cardsCorrect INTEGER DEFAULT 0,
        isSynced INTEGER DEFAULT 0,
        FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS review_answers (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        cardId TEXT NOT NULL,
        quality INTEGER NOT NULL,
        timeSpent INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        isSynced INTEGER DEFAULT 0,
        FOREIGN KEY (sessionId) REFERENCES review_sessions (id) ON DELETE CASCADE,
        FOREIGN KEY (cardId) REFERENCES cards (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        tableName TEXT NOT NULL,
        recordId TEXT NOT NULL,
        operation TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        retryCount INTEGER DEFAULT 0
      );
    `;

    await this.database.executeSql(createTablesSQL);
  }

  // Deck operations
  async createDeck(deck: Deck): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const sql = `
      INSERT INTO decks (id, title, description, coverImage, cardCount, userId, createdAt, updatedAt, lastReviewed, tags, isSynced)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.executeSql(sql, [
      deck.id,
      deck.title,
      deck.description || '',
      deck.coverImage || '',
      deck.cardCount,
      deck.userId,
      deck.createdAt.toISOString(),
      deck.updatedAt.toISOString(),
      deck.lastReviewed?.toISOString() || null,
      deck.tags ? JSON.stringify(deck.tags) : null,
      0, // isSynced
    ]);
  }

  async getDecks(userId: string): Promise<Deck[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [results] = await this.database.executeSql(
      'SELECT * FROM decks WHERE userId = ? ORDER BY updatedAt DESC',
      [userId]
    );

    return results.rows.raw().map((row: any) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      lastReviewed: row.lastReviewed ? new Date(row.lastReviewed) : undefined,
    }));
  }

  async getDeck(id: string): Promise<Deck | null> {
    if (!this.database) throw new Error('Database not initialized');

    const [results] = await this.database.executeSql(
      'SELECT * FROM decks WHERE id = ?',
      [id]
    );

    if (results.rows.length === 0) return null;

    const row = results.rows.item(0);
    return {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      lastReviewed: row.lastReviewed ? new Date(row.lastReviewed) : undefined,
    };
  }

  async updateDeck(deck: Deck): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const sql = `
      UPDATE decks 
      SET title = ?, description = ?, coverImage = ?, cardCount = ?, updatedAt = ?, lastReviewed = ?, tags = ?, isSynced = ?
      WHERE id = ?
    `;

    await this.database.executeSql(sql, [
      deck.title,
      deck.description || '',
      deck.coverImage || '',
      deck.cardCount,
      deck.updatedAt.toISOString(),
      deck.lastReviewed?.toISOString() || null,
      deck.tags ? JSON.stringify(deck.tags) : null,
      0, // isSynced
      deck.id,
    ]);
  }

  async deleteDeck(id: string): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    await this.database.executeSql('DELETE FROM decks WHERE id = ?', [id]);
  }

  // Card operations
  async createCard(card: Card): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const sql = `
      INSERT INTO cards (id, deckId, front, back, notes, images, tags, createdAt, updatedAt, nextReview, interval, repetition, efactor, status, isSynced)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.executeSql(sql, [
      card.id,
      card.deckId,
      card.front,
      card.back,
      card.notes || '',
      card.images ? JSON.stringify(card.images) : null,
      card.tags ? JSON.stringify(card.tags) : null,
      card.createdAt.toISOString(),
      card.updatedAt.toISOString(),
      card.nextReview.toISOString(),
      card.interval,
      card.repetition,
      card.efactor,
      card.status,
      0, // isSynced
    ]);
  }

  async getCards(deckId: string): Promise<Card[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [results] = await this.database.executeSql(
      'SELECT * FROM cards WHERE deckId = ? ORDER BY createdAt ASC',
      [deckId]
    );

    return results.rows.raw().map((row: any) => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      nextReview: new Date(row.nextReview),
    }));
  }

  async getCardsForReview(deckId: string, limit: number = 20): Promise<Card[]> {
    if (!this.database) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const [results] = await this.database.executeSql(
      `SELECT * FROM cards 
       WHERE deckId = ? AND nextReview <= ? 
       ORDER BY nextReview ASC 
       LIMIT ?`,
      [deckId, now, limit]
    );

    return results.rows.raw().map((row: any) => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      nextReview: new Date(row.nextReview),
    }));
  }

  async updateCard(card: Card): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const sql = `
      UPDATE cards 
      SET front = ?, back = ?, notes = ?, images = ?, tags = ?, updatedAt = ?, nextReview = ?, interval = ?, repetition = ?, efactor = ?, status = ?, isSynced = ?
      WHERE id = ?
    `;

    await this.database.executeSql(sql, [
      card.front,
      card.back,
      card.notes || '',
      card.images ? JSON.stringify(card.images) : null,
      card.tags ? JSON.stringify(card.tags) : null,
      card.updatedAt.toISOString(),
      card.nextReview.toISOString(),
      card.interval,
      card.repetition,
      card.efactor,
      card.status,
      0, // isSynced
      card.id,
    ]);
  }

  async deleteCard(id: string): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    await this.database.executeSql('DELETE FROM cards WHERE id = ?', [id]);
  }

  // Review session operations
  async createReviewSession(session: ReviewSession): Promise<string> {
    if (!this.database) throw new Error('Database not initialized');

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const sql = `
      INSERT INTO review_sessions (id, deckId, startTime, endTime, cardsReviewed, cardsCorrect, isSynced)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.executeSql(sql, [
      sessionId,
      session.deckId,
      session.startTime.toISOString(),
      session.endTime?.toISOString() || null,
      session.cardsReviewed,
      session.cardsCorrect,
      0, // isSynced
    ]);

    return sessionId;
  }

  async updateReviewSession(sessionId: string, session: Partial<ReviewSession>): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const sql = `
      UPDATE review_sessions 
      SET endTime = ?, cardsReviewed = ?, cardsCorrect = ?, isSynced = ?
      WHERE id = ?
    `;

    await this.database.executeSql(sql, [
      session.endTime?.toISOString() || null,
      session.cardsReviewed,
      session.cardsCorrect,
      0, // isSynced
      sessionId,
    ]);
  }

  // Sync operations
  async getUnsyncedRecords(tableName: string): Promise<any[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [results] = await this.database.executeSql(
      `SELECT * FROM ${tableName} WHERE isSynced = 0`,
      []
    );

    return results.rows.raw();
  }

  async markAsSynced(tableName: string, id: string): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    await this.database.executeSql(
      `UPDATE ${tableName} SET isSynced = 1 WHERE id = ?`,
      [id]
    );
  }

  // Close database
  async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
    }
  }
}

export default new DatabaseService(); 
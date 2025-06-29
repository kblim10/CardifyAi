import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';
import { Card, SRSData } from './srs';

// Enable SQLite promise
SQLite.enablePromise(true);

// Database name
const DB_NAME = 'cardifyai.db';

// Interface definitions
export interface Deck {
  id: string;
  title: string;
  description?: string;
  coverImagePath?: string;
  isPublic: boolean;
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

// Helper function to normalize deck data
const normalizeDeck = (deck: any): Deck => {
  return {
    id: deck.id || deck._id,
    title: deck.title,
    description: deck.description,
    coverImagePath: deck.coverImagePath,
    isPublic: deck.isPublic,
    tags: deck.tags,
    createdAt: typeof deck.createdAt === 'string' ? new Date(deck.createdAt) : (deck.createdAt || new Date()),
    updatedAt: typeof deck.updatedAt === 'string' ? new Date(deck.updatedAt) : (deck.updatedAt || new Date()),
  };
};

// Helper function to normalize card data
const normalizeCard = (card: any): Card => {
  return {
    id: card.id || card._id,
    deckId: card.deckId,
    frontContent: card.frontContent,
    backContent: card.backContent,
    tags: card.tags,
    mediaPath: card.mediaPath,
    srsData: {
      easeFactor: card.srsData?.easeFactor ?? 2.5,
      interval: card.srsData?.interval ?? 0,
      repetitions: card.srsData?.repetitions ?? 0,
      dueDate: typeof card.srsData?.dueDate === 'string' 
        ? new Date(card.srsData.dueDate) 
        : (card.srsData?.dueDate || new Date()),
      lastReviewedAt: card.srsData?.lastReviewedAt 
        ? (typeof card.srsData.lastReviewedAt === 'string' 
            ? new Date(card.srsData.lastReviewedAt) 
            : card.srsData.lastReviewedAt)
        : undefined,
    },
    createdAt: typeof card.createdAt === 'string' ? new Date(card.createdAt) : (card.createdAt || new Date()),
    updatedAt: typeof card.updatedAt === 'string' ? new Date(card.updatedAt) : (card.updatedAt || new Date()),
  };
};

// Storage service
export const storage = {
  // AsyncStorage methods
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // SQLite methods
  async initDatabase(): Promise<void> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      // Create tables
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS decks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          coverImagePath TEXT,
          isPublic INTEGER NOT NULL,
          tags TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
      `);

      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS cards (
          id TEXT PRIMARY KEY,
          deckId TEXT NOT NULL,
          frontContent TEXT NOT NULL,
          backContent TEXT NOT NULL,
          tags TEXT,
          mediaPath TEXT,
          easeFactor REAL NOT NULL,
          interval INTEGER NOT NULL,
          repetitions INTEGER NOT NULL,
          dueDate TEXT NOT NULL,
          lastReviewedAt TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
        );
      `);

      await db.close();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  },

  // Deck methods
  async saveDecks(decks: Deck[]): Promise<void> {
    let db: SQLite.SQLiteDatabase | null = null;
    try {
      db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      // Use executeSql without transaction for simpler operations
      await db.executeSql('DELETE FROM decks');
      
      // Insert all decks one by one
      for (const deckData of decks) {
        // Normalize deck data to ensure proper date handling
        const deck = normalizeDeck(deckData);
        
        await db.executeSql(
          `INSERT INTO decks (
            id, title, description, coverImagePath, isPublic, tags, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            deck.id,
            deck.title,
            deck.description || null,
            deck.coverImagePath || null,
            deck.isPublic ? 1 : 0,
            deck.tags ? JSON.stringify(deck.tags) : null,
            deck.createdAt instanceof Date ? deck.createdAt.toISOString() : deck.createdAt,
            deck.updatedAt instanceof Date ? deck.updatedAt.toISOString() : deck.updatedAt,
          ]
        );
      }
    } catch (error) {
      console.error('Error saving decks:', error);
      throw error;
    } finally {
      if (db) {
        try {
          await db.close();
        } catch (closeError) {
          console.error('Error closing database:', closeError);
        }
      }
    }
  },

  async getDecks(): Promise<Deck[]> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      const [results] = await db.executeSql('SELECT * FROM decks ORDER BY updatedAt DESC');
      const decks: Deck[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        decks.push({
          id: row.id,
          title: row.title,
          description: row.description,
          coverImagePath: row.coverImagePath,
          isPublic: row.isPublic === 1,
          tags: row.tags ? JSON.parse(row.tags) : undefined,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      }

      await db.close();
      return decks;
    } catch (error) {
      console.error('Error getting decks:', error);
      return [];
    }
  },

  async getDeck(deckId: string): Promise<Deck | null> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      const [results] = await db.executeSql('SELECT * FROM decks WHERE id = ?', [deckId]);

      if (results.rows.length === 0) {
        await db.close();
        return null;
      }

      const row = results.rows.item(0);
      const deck: Deck = {
        id: row.id,
        title: row.title,
        description: row.description,
        coverImagePath: row.coverImagePath,
        isPublic: row.isPublic === 1,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      await db.close();
      return deck;
    } catch (error) {
      console.error('Error getting deck:', error);
      return null;
    }
  },

  async deleteDeck(deckId: string): Promise<void> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      await db.executeSql('DELETE FROM decks WHERE id = ?', [deckId]);
      await db.close();
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  },

  // Card methods
  async saveCards(cards: Card[]): Promise<void> {
    let db: SQLite.SQLiteDatabase | null = null;
    try {
      db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      // Use executeSql without transaction for simpler operations
      await db.executeSql('DELETE FROM cards');
      
      // Insert all cards one by one
      for (const cardData of cards) {
        // Normalize card data to ensure proper date handling
        const card = normalizeCard(cardData);

        await db.executeSql(
          `INSERT INTO cards (
            id, deckId, frontContent, backContent, tags, mediaPath,
            easeFactor, interval, repetitions, dueDate, lastReviewedAt,
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            card.id,
            card.deckId,
            card.frontContent,
            card.backContent,
            card.tags ? JSON.stringify(card.tags) : null,
            card.mediaPath || null,
            card.srsData.easeFactor,
            card.srsData.interval,
            card.srsData.repetitions,
            card.srsData.dueDate instanceof Date ? card.srsData.dueDate.toISOString() : card.srsData.dueDate,
            card.srsData.lastReviewedAt 
              ? (card.srsData.lastReviewedAt instanceof Date 
                  ? card.srsData.lastReviewedAt.toISOString() 
                  : card.srsData.lastReviewedAt)
              : null,
            card.createdAt instanceof Date ? card.createdAt.toISOString() : card.createdAt,
            card.updatedAt instanceof Date ? card.updatedAt.toISOString() : card.updatedAt,
          ]
        );
      }
    } catch (error) {
      console.error('Error saving cards:', error);
      throw error;
    } finally {
      if (db) {
        try {
          await db.close();
        } catch (closeError) {
          console.error('Error closing database:', closeError);
        }
      }
    }
  },

  async getCards(): Promise<Card[]> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      const [results] = await db.executeSql('SELECT * FROM cards');
      const cards: Card[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        cards.push({
          id: row.id,
          deckId: row.deckId,
          frontContent: row.frontContent,
          backContent: row.backContent,
          tags: row.tags ? JSON.parse(row.tags) : undefined,
          mediaPath: row.mediaPath,
          srsData: {
            easeFactor: row.easeFactor,
            interval: row.interval,
            repetitions: row.repetitions,
            dueDate: new Date(row.dueDate),
            lastReviewedAt: row.lastReviewedAt ? new Date(row.lastReviewedAt) : undefined,
          },
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      }

      await db.close();
      return cards;
    } catch (error) {
      console.error('Error getting cards:', error);
      return [];
    }
  },

  async getCardsByDeckId(deckId: string): Promise<Card[]> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      const [results] = await db.executeSql('SELECT * FROM cards WHERE deckId = ?', [deckId]);
      const cards: Card[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        cards.push({
          id: row.id,
          deckId: row.deckId,
          frontContent: row.frontContent,
          backContent: row.backContent,
          tags: row.tags ? JSON.parse(row.tags) : undefined,
          mediaPath: row.mediaPath,
          srsData: {
            easeFactor: row.easeFactor,
            interval: row.interval,
            repetitions: row.repetitions,
            dueDate: new Date(row.dueDate),
            lastReviewedAt: row.lastReviewedAt ? new Date(row.lastReviewedAt) : undefined,
          },
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      }

      await db.close();
      return cards;
    } catch (error) {
      console.error('Error getting cards by deck ID:', error);
      return [];
    }
  },

  async updateCardSRS(cardId: string, srsData: SRSData): Promise<void> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      await db.executeSql(
        `UPDATE cards SET 
          easeFactor = ?, 
          interval = ?, 
          repetitions = ?, 
          dueDate = ?, 
          lastReviewedAt = ?,
          updatedAt = ?
        WHERE id = ?`,
        [
          srsData.easeFactor,
          srsData.interval,
          srsData.repetitions,
          srsData.dueDate.toISOString(),
          srsData.lastReviewedAt?.toISOString() || null,
          new Date().toISOString(),
          cardId,
        ]
      );

      await db.close();
    } catch (error) {
      console.error('Error updating card SRS data:', error);
    }
  },

  async deleteCard(cardId: string): Promise<void> {
    try {
      const db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      await db.executeSql('DELETE FROM cards WHERE id = ?', [cardId]);
      await db.close();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  },

  // Sync status
  async setLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem('lastSyncTime', new Date().toISOString());
    } catch (error) {
      console.error('Error setting last sync time:', error);
    }
  },

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const timeString = await AsyncStorage.getItem('lastSyncTime');
      return timeString ? new Date(timeString) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  },
};

export default storage;
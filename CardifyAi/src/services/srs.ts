/**
 * Implementasi algoritma Spaced Repetition System (SRS) berdasarkan SM-2
 * 
 * Quality:
 * 0 - Tidak tahu sama sekali / Salah total
 * 1 - Salah, tapi ingat jawaban setelah melihat
 * 2 - Salah, tapi jawaban terasa familiar
 * 3 - Benar, tapi sulit mengingat
 * 4 - Benar dengan sedikit keraguan
 * 5 - Benar dan mudah diingat
 */

export interface SRSData {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
  lastReviewedAt?: Date;
}

export interface Card {
  id: string;
  deckId: string;
  frontContent: string;
  backContent: string;
  tags?: string[];
  mediaPath?: string;
  srsData: SRSData;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Menghitung interval baru untuk kartu berdasarkan kualitas jawaban
 * @param {number} quality - Kualitas jawaban (0-5)
 * @param {SRSData} srsData - Data SRS kartu saat ini
 * @returns {SRSData} - Data SRS yang diperbarui
 */
export const calculateNextReview = (quality: number, srsData: SRSData): SRSData => {
  // Clone data untuk menghindari mutasi
  const newSrsData: SRSData = { ...srsData };
  
  // Default values jika tidak ada data sebelumnya
  if (!newSrsData.easeFactor) newSrsData.easeFactor = 2.5;
  if (!newSrsData.interval) newSrsData.interval = 0;
  if (!newSrsData.repetitions) newSrsData.repetitions = 0;
  
  // Algoritma SM-2
  if (quality < 3) {
    // Jawaban salah, reset repetitions
    newSrsData.repetitions = 0;
    newSrsData.interval = 0;
  } else {
    // Jawaban benar
    newSrsData.repetitions += 1;
    
    // Hitung interval baru
    if (newSrsData.repetitions === 1) {
      newSrsData.interval = 1; // 1 hari
    } else if (newSrsData.repetitions === 2) {
      newSrsData.interval = 3; // 3 hari
    } else {
      // Interval = interval sebelumnya * easeFactor
      newSrsData.interval = Math.round(newSrsData.interval * newSrsData.easeFactor);
    }
  }
  
  // Perbarui easeFactor berdasarkan kualitas jawaban
  newSrsData.easeFactor = Math.max(
    1.3, // Minimal easeFactor
    newSrsData.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  // Hitung tanggal jatuh tempo berikutnya
  const now = new Date();
  newSrsData.lastReviewedAt = now;
  
  if (newSrsData.interval === 0) {
    // Jika jawaban salah, review lagi dalam 10 menit
    newSrsData.dueDate = new Date(now.getTime() + 10 * 60 * 1000);
  } else {
    // Jika jawaban benar, review sesuai interval (dalam hari)
    newSrsData.dueDate = new Date(now.getTime() + newSrsData.interval * 24 * 60 * 60 * 1000);
  }
  
  return newSrsData;
};

/**
 * Mendapatkan kartu yang perlu direview hari ini
 * @param {Card[]} cards - Array kartu
 * @returns {Card[]} - Array kartu yang perlu direview
 */
export const getDueCards = (cards: Card[]): Card[] => {
  const now = new Date();
  
  return cards.filter(card => {
    const dueDate = new Date(card.srsData.dueDate);
    return dueDate <= now;
  });
};

/**
 * Mendapatkan statistik review
 * @param {Card[]} cards - Array kartu
 * @returns {Object} - Statistik review
 */
export const getReviewStats = (cards: Card[]) => {
  const now = new Date();
  const dueToday = cards.filter(card => {
    const dueDate = new Date(card.srsData.dueDate);
    return dueDate <= now;
  }).length;
  
  const dueTomorrow = cards.filter(card => {
    const dueDate = new Date(card.srsData.dueDate);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dueDate > now && dueDate <= tomorrow;
  }).length;
  
  const dueThisWeek = cards.filter(card => {
    const dueDate = new Date(card.srsData.dueDate);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return dueDate > now && dueDate <= nextWeek;
  }).length;
  
  const reviewedToday = cards.filter(card => {
    if (!card.srsData.lastReviewedAt) return false;
    
    const lastReviewed = new Date(card.srsData.lastReviewedAt);
    return (
      lastReviewed.getDate() === now.getDate() &&
      lastReviewed.getMonth() === now.getMonth() &&
      lastReviewed.getFullYear() === now.getFullYear()
    );
  }).length;
  
  return {
    dueToday,
    dueTomorrow,
    dueThisWeek,
    reviewedToday,
    totalCards: cards.length,
  };
}; 
import { createWorker } from 'tesseract.js';
import { Platform } from 'react-native';
import { ocrAPI } from './api';
import * as RNFS from 'react-native-fs';

interface OCRResult {
  text: string;
  confidence: number;
}

export const ocrService = {
  /**
   * Process image using local Tesseract.js
   * @param {string} imagePath - Path to image file
   * @returns {Promise<OCRResult>} - OCR result with text and confidence
   */
  async processImageLocal(imagePath: string): Promise<OCRResult> {
    try {
      // Create worker
      const worker = await createWorker('ind');
      
      // Convert file path to compatible format
      let imagePathForTesseract = imagePath;
      
      if (Platform.OS === 'android' && !imagePath.startsWith('file://')) {
        imagePathForTesseract = `file://${imagePath}`;
      }
      
      // Recognize text
      const { data } = await worker.recognize(imagePathForTesseract);
      
      // Terminate worker
      await worker.terminate();
      
      return {
        text: data.text,
        confidence: data.confidence,
      };
    } catch (error) {
      console.error('Error processing image locally:', error);
      throw new Error('Gagal memproses gambar secara lokal');
    }
  },
  
  /**
   * Process image using backend API
   * @param {string} imagePath - Path to image file
   * @returns {Promise<OCRResult>} - OCR result with text and confidence
   */
  async processImageRemote(imagePath: string): Promise<OCRResult> {
    try {
      // Create form data
      const formData = new FormData();
      
      // Get file name from path
      const fileName = imagePath.split('/').pop() || 'image.jpg';
      
      // Get file type
      const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      // Add file to form data
      formData.append('image', {
        uri: Platform.OS === 'android' && !imagePath.startsWith('file://') 
          ? `file://${imagePath}` 
          : imagePath,
        type: fileType,
        name: fileName,
      } as any);
      
      // Send to server
      const response = await ocrAPI.processImage(formData);
      
      return response.data.data;
    } catch (error) {
      console.error('Error processing image remotely:', error);
      throw new Error('Gagal memproses gambar melalui server');
    }
  },
  
  /**
   * Process document using backend API
   * @param {string} documentPath - Path to document file
   * @returns {Promise<{text: string, pageCount: number}>} - Document OCR result
   */
  async processDocument(documentPath: string): Promise<{text: string, pageCount: number}> {
    try {
      // Create form data
      const formData = new FormData();
      
      // Get file name from path
      const fileName = documentPath.split('/').pop() || 'document.pdf';
      
      // Add file to form data
      formData.append('document', {
        uri: Platform.OS === 'android' && !documentPath.startsWith('file://') 
          ? `file://${documentPath}` 
          : documentPath,
        type: 'application/pdf',
        name: fileName,
      } as any);
      
      // Send to server
      const response = await ocrAPI.processDocument(formData);
      
      return response.data.data;
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Gagal memproses dokumen');
    }
  },
  
  /**
   * Extract text from image, trying local first then remote
   * @param {string} imagePath - Path to image file
   * @returns {Promise<string>} - Extracted text
   */
  async extractTextFromImage(imagePath: string): Promise<string> {
    try {
      // Try local processing first
      try {
        const result = await this.processImageLocal(imagePath);
        return result.text;
      } catch (localError) {
        // If local fails, try remote
        const result = await this.processImageRemote(imagePath);
        return result.text;
      }
    } catch (error) {
      console.error('Error extracting text from image:', error);
      throw new Error('Gagal mengekstrak teks dari gambar');
    }
  },
  
  /**
   * Generate flashcards from extracted text
   * @param {string} text - Extracted text
   * @returns {Promise<Array<{front: string, back: string}>>} - Array of flashcards
   */
  async generateFlashcardsFromText(text: string): Promise<Array<{front: string, back: string}>> {
    // In a real app, this would use AI to generate flashcards
    // For now, we'll use a simple algorithm
    
    // Split by double newlines (paragraphs)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    const flashcards = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      
      // Skip short paragraphs
      if (paragraph.length < 10) continue;
      
      // Check if paragraph contains a question mark
      if (paragraph.includes('?')) {
        const parts = paragraph.split('?');
        if (parts.length >= 2) {
          flashcards.push({
            front: parts[0].trim() + '?',
            back: parts.slice(1).join('?').trim(),
          });
          continue;
        }
      }
      
      // Check if paragraph contains a colon
      if (paragraph.includes(':')) {
        const parts = paragraph.split(':');
        if (parts.length >= 2) {
          flashcards.push({
            front: parts[0].trim(),
            back: parts.slice(1).join(':').trim(),
          });
          continue;
        }
      }
      
      // If we have the next paragraph, use it as the back
      if (i < paragraphs.length - 1) {
        flashcards.push({
          front: paragraph,
          back: paragraphs[i + 1].trim(),
        });
        i++; // Skip the next paragraph
      }
    }
    
    return flashcards;
  },
};

export default ocrService; 
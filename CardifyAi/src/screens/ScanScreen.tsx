import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ocrService } from '../services/ocr';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showSafeErrorAlert } from '../utils/helpers';

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, 'Scan'>;

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Array<{front: string, back: string}>>([]);

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImagePath(result.assets[0].uri);
        setExtractedText(null);
        setFlashcards([]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showSafeErrorAlert('Error', 'Gagal mengambil foto');
    }
  };

  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImagePath(result.assets[0].uri);
        setExtractedText(null);
        setFlashcards([]);
      }
    } catch (error) {
      console.error('Error choosing image:', error);
      showSafeErrorAlert('Error', 'Gagal memilih gambar');
    }
  };

  const handleChooseDocument = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const asset = result.assets[0];
        
        // Check if it's a PDF file
        if (asset.type === 'application/pdf' || asset.fileName?.endsWith('.pdf')) {
          setLoading(true);
          try {
            const response = await ocrService.processDocument(asset.uri);
            setExtractedText(response.text);
            
            // Generate flashcards from text
            const cards = await ocrService.generateFlashcardsFromText(response.text);
            setFlashcards(cards);
          } catch (ocrError) {
            console.error('OCR error:', ocrError);
            showSafeErrorAlert('Error', 'Gagal memproses dokumen PDF');
          } finally {
            setLoading(false);
          }
        } else {
          // Handle as image
          setImagePath(asset.uri);
          setExtractedText(null);
          setFlashcards([]);
        }
      }
    } catch (error) {
      console.error('Error choosing document:', error);
      showSafeErrorAlert('Error', 'Gagal memilih dokumen');
    }
  };

  const handleExtractText = async () => {
    if (!imagePath) return;

    setLoading(true);
    try {
      const text = await ocrService.extractTextFromImage(imagePath);
      setExtractedText(text);
      
      // Generate flashcards from text
      const cards = await ocrService.generateFlashcardsFromText(text);
      setFlashcards(cards);
    } catch (error) {
      console.error('Error extracting text:', error);
      showSafeErrorAlert('Error', 'Gagal mengekstrak teks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcards = () => {
    if (flashcards.length === 0) {
      showSafeErrorAlert('Peringatan', 'Tidak ada flashcard yang dapat dibuat');
      return;
    }

    // Navigate to create deck screen with flashcards
    navigation.navigate('CreateDeck', { flashcards });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Dokumen atau Gambar</Text>
        <Text style={styles.subtitle}>
          Ambil foto atau pilih dokumen untuk mengekstrak teks dan membuat flashcard
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleTakePhoto}>
          <Icon name="camera" size={32} color="#6200EE" />
          <Text style={styles.optionText}>Ambil Foto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton} onPress={handleChooseImage}>
          <Icon name="image" size={32} color="#6200EE" />
          <Text style={styles.optionText}>Pilih Gambar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton} onPress={handleChooseDocument}>
          <Icon name="file-document" size={32} color="#6200EE" />
          <Text style={styles.optionText}>Pilih Dokumen</Text>
        </TouchableOpacity>
      </View>

      {imagePath && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imagePath }} style={styles.image} resizeMode="contain" />
          <Button
            title="Ekstrak Teks"
            onPress={handleExtractText}
            style={styles.extractButton}
            loading={loading}
          />
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Memproses...</Text>
        </View>
      )}

      {extractedText && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Teks yang Diekstrak:</Text>
          <View style={styles.textContainer}>
            <Text style={styles.extractedText}>{extractedText}</Text>
          </View>
        </View>
      )}

      {flashcards.length > 0 && (
        <View style={styles.flashcardsContainer}>
          <Text style={styles.resultTitle}>Flashcard yang Dihasilkan:</Text>
          
          {flashcards.map((card, index) => (
            <View key={index} style={styles.flashcardPreview}>
              <View style={styles.cardSide}>
                <Text style={styles.cardLabel}>Depan:</Text>
                <Text style={styles.cardContent} numberOfLines={2}>{card.front}</Text>
              </View>
              <View style={styles.cardSide}>
                <Text style={styles.cardLabel}>Belakang:</Text>
                <Text style={styles.cardContent} numberOfLines={2}>{card.back}</Text>
              </View>
            </View>
          ))}
          
          <Button
            title="Buat Flashcard"
            onPress={handleCreateFlashcards}
            style={styles.createButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  optionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  extractButton: {
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  resultContainer: {
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  textContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  extractedText: {
    fontSize: 14,
    color: '#333333',
  },
  flashcardsContainer: {
    marginBottom: 24,
  },
  flashcardPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardSide: {
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 14,
    color: '#333333',
  },
  createButton: {
    marginTop: 16,
  },
});

export default ScanScreen; 
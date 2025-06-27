import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Input from '../components/Input';
import Button from '../components/Button';
import { cardsAPI } from '../services/api';
import { storage } from '../services/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { v4 as uuidv4 } from 'uuid';

type CreateCardScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateCard'>;

const CreateCardScreen: React.FC<CreateCardScreenProps> = ({ route, navigation }) => {
  const { deckId } = route.params;
  
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');
  const [mediaPath, setMediaPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ frontContent?: string; backContent?: string }>({});
  const [isFlipped, setIsFlipped] = useState(false);

  const validate = () => {
    const newErrors: { frontContent?: string; backContent?: string } = {};
    let isValid = true;

    if (!frontContent || frontContent.trim() === '') {
      newErrors.frontContent = 'Konten depan kartu harus diisi';
      isValid = false;
    }

    if (!backContent || backContent.trim() === '') {
      newErrors.backContent = 'Konten belakang kartu harus diisi';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setMediaPath(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Gagal mengambil foto');
    }
  };

  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setMediaPath(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing image:', error);
      Alert.alert('Error', 'Gagal memilih gambar');
    }
  };

  const handleCreateCard = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Create card data
      const cardData = {
        deckId,
        frontContent,
        backContent,
        mediaPath: mediaPath || undefined,
      };

      try {
        // Try to create on server
        const response = await cardsAPI.createCard(cardData);
        const newCard = response.data.data;
        
        // Save to local storage
        await storage.saveCards([newCard]);
      } catch (apiError) {
        console.log('Failed to create card on server, saving locally', apiError);
        
        // If API fails, save locally
        const now = new Date();
        const localCard = {
          id: uuidv4(),
          deckId,
          frontContent,
          backContent,
          mediaPath: mediaPath || undefined,
          srsData: {
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            dueDate: now,
          },
          createdAt: now,
          updatedAt: now,
        };
        
        await storage.saveCards([localCard]);
      }
      
      Alert.alert('Sukses', 'Kartu berhasil dibuat', [
        {
          text: 'Tambah Lagi',
          onPress: () => {
            setFrontContent('');
            setBackContent('');
            setMediaPath(null);
            setIsFlipped(false);
          },
        },
        {
          text: 'Kembali',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error creating card:', error);
      Alert.alert('Error', 'Gagal membuat kartu');
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.previewContainer}>
        <TouchableOpacity style={styles.cardPreview} onPress={toggleFlip} activeOpacity={0.8}>
          <View style={[styles.cardFace, !isFlipped ? styles.cardFront : styles.cardBack]}>
            {!isFlipped ? (
              <>
                {mediaPath && (
                  <Image source={{ uri: mediaPath }} style={styles.cardMedia} resizeMode="contain" />
                )}
                <Text style={styles.cardContent}>{frontContent || 'Konten Depan'}</Text>
              </>
            ) : (
              <Text style={styles.cardContent}>{backContent || 'Konten Belakang'}</Text>
            )}
          </View>
          <Text style={styles.flipHint}>Tap untuk membalik</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Konten Kartu</Text>
        
        <Input
          label="Depan"
          placeholder="Masukkan konten depan kartu"
          value={frontContent}
          onChangeText={setFrontContent}
          multiline
          numberOfLines={3}
          error={errors.frontContent}
        />
        
        <Input
          label="Belakang"
          placeholder="Masukkan konten belakang kartu"
          value={backContent}
          onChangeText={setBackContent}
          multiline
          numberOfLines={3}
          error={errors.backContent}
        />
        
        <Text style={styles.sectionTitle}>Media (Opsional)</Text>
        
        <View style={styles.mediaOptionsContainer}>
          <TouchableOpacity style={styles.mediaOption} onPress={handleTakePhoto}>
            <Icon name="camera" size={24} color="#6200EE" />
            <Text style={styles.mediaOptionText}>Ambil Foto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaOption} onPress={handleChooseImage}>
            <Icon name="image" size={24} color="#6200EE" />
            <Text style={styles.mediaOptionText}>Pilih Gambar</Text>
          </TouchableOpacity>
          
          {mediaPath && (
            <TouchableOpacity style={styles.mediaOption} onPress={() => setMediaPath(null)}>
              <Icon name="delete" size={24} color="#FF5252" />
              <Text style={[styles.mediaOptionText, { color: '#FF5252' }]}>Hapus Media</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {mediaPath && (
          <View style={styles.selectedMediaContainer}>
            <Image source={{ uri: mediaPath }} style={styles.selectedMedia} resizeMode="contain" />
          </View>
        )}
        
        <Button
          title="Buat Kartu"
          onPress={handleCreateCard}
          style={styles.createButton}
          loading={loading}
        />
      </View>
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
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardPreview: {
    width: '100%',
    height: 200,
    alignItems: 'center',
  },
  cardFace: {
    width: '100%',
    height: '90%',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
  },
  cardBack: {
    backgroundColor: '#F0E6FF',
  },
  cardMedia: {
    width: '100%',
    height: 100,
    marginBottom: 12,
    borderRadius: 8,
  },
  cardContent: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333333',
  },
  flipHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#999999',
  },
  formContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  mediaOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mediaOption: {
    alignItems: 'center',
    marginRight: 24,
  },
  mediaOptionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6200EE',
  },
  selectedMediaContainer: {
    width: '100%',
    height: 150,
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  selectedMedia: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    marginTop: 8,
  },
});

export default CreateCardScreen; 
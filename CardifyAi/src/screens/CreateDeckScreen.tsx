import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Input from '../components/Input';
import Button from '../components/Button';
import { decksAPI } from '../services/api';
import { storage } from '../services/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { generateUUID } from '../utils/uuid';
import { showSafeErrorAlert } from '../utils/helpers';

type CreateDeckScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateDeck'>;

const CreateDeckScreen: React.FC<CreateDeckScreenProps> = ({ route, navigation }) => {
  // Get flashcards from route params if available
  const flashcards = route.params?.flashcards || [];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [cardPreviews, setCardPreviews] = useState<Array<{front: string, back: string}>>(flashcards);

  useEffect(() => {
    if (flashcards.length > 0) {
      // Jika ada flashcard dari hasil scan, gunakan judul dari kartu pertama
      setTitle(`Deck dari Scan - ${new Date().toLocaleDateString()}`);
    }
  }, [flashcards]);

  const validate = () => {
    const newErrors: { title?: string } = {};
    let isValid = true;

    if (!title || title.trim() === '') {
      newErrors.title = 'Judul deck harus diisi';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setCoverImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing image:', error);
      showSafeErrorAlert('Error', 'Gagal memilih gambar');
    }
  };

  const handleAddCard = () => {
    setCardPreviews([...cardPreviews, { front: '', back: '' }]);
  };

  const handleUpdateCardPreview = (index: number, field: 'front' | 'back', value: string) => {
    const updatedPreviews = [...cardPreviews];
    updatedPreviews[index][field] = value;
    setCardPreviews(updatedPreviews);
  };

  const handleRemoveCardPreview = (index: number) => {
    const updatedPreviews = [...cardPreviews];
    updatedPreviews.splice(index, 1);
    setCardPreviews(updatedPreviews);
  };

  const handleCreateDeck = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Create deck
      const deckData = {
        title,
        description: description || undefined,
        isPublic,
        coverImagePath: coverImage || undefined,
      };

      // Generate a temporary ID for local storage
      const tempDeckId = generateUUID();
      
      try {
        // Try to create on server
        const response = await decksAPI.createDeck(deckData);
        const newDeck = response.data.data;
        
        // Save to local storage
        await storage.saveDecks([newDeck]);
        
        // Create cards if there are any
        if (cardPreviews.length > 0) {
          for (const card of cardPreviews) {
            if (card.front.trim() && card.back.trim()) {
              await decksAPI.createCard({
                deckId: newDeck.id,
                frontContent: card.front,
                backContent: card.back,
              });
            }
          }
        }
        
        // Navigate back to home screen
        navigation.navigate('Main');
        
      } catch (apiError) {
        console.log('Failed to create deck on server, saving locally', apiError);
        
        // If API fails, save locally
        const now = new Date();
        const localDeck = {
          id: tempDeckId,
          title,
          description: description || undefined,
          coverImagePath: coverImage || undefined,
          isPublic,
          createdAt: now,
          updatedAt: now,
        };
        
        await storage.saveDecks([localDeck]);
        
        // Create cards locally
        if (cardPreviews.length > 0) {
          const cards = cardPreviews
            .filter(card => card.front.trim() && card.back.trim())
            .map(card => ({
              id: generateUUID(),
              deckId: tempDeckId,
              frontContent: card.front,
              backContent: card.back,
              srsData: {
                easeFactor: 2.5,
                interval: 0,
                repetitions: 0,
                dueDate: now,
              },
              createdAt: now,
              updatedAt: now,
            }));
          
          if (cards.length > 0) {
            await storage.saveCards(cards);
          }
        }
        
        // Navigate back to home screen
        navigation.navigate('Main');
      }
      
      showSafeErrorAlert('Sukses', 'Deck berhasil dibuat', () => {
        navigation.goBack();
      });
      
    } catch (error) {
      console.error('Error creating deck:', error);
      showSafeErrorAlert('Error', 'Gagal membuat deck');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <Input
          label="Judul Deck"
          placeholder="Masukkan judul deck"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <Input
          label="Deskripsi (Opsional)"
          placeholder="Masukkan deskripsi deck"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Deck Publik</Text>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#D1D1D1', true: '#9575CD' }}
            thumbColor={isPublic ? '#6200EE' : '#F4F3F4'}
          />
        </View>

        <Text style={styles.sectionTitle}>Cover Deck</Text>
        <TouchableOpacity style={styles.coverContainer} onPress={handleChooseImage}>
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Icon name="image-plus" size={40} color="#CCCCCC" />
              <Text style={styles.coverPlaceholderText}>Tambahkan Cover</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Kartu ({cardPreviews.length})</Text>
        
        {cardPreviews.map((card, index) => (
          <View key={index} style={styles.cardPreview}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardNumber}>Kartu {index + 1}</Text>
              <TouchableOpacity onPress={() => handleRemoveCardPreview(index)}>
                <Icon name="close-circle" size={24} color="#FF5252" />
              </TouchableOpacity>
            </View>
            
            <Input
              label="Depan"
              placeholder="Masukkan konten depan kartu"
              value={card.front}
              onChangeText={(text) => handleUpdateCardPreview(index, 'front', text)}
              multiline
            />
            
            <Input
              label="Belakang"
              placeholder="Masukkan konten belakang kartu"
              value={card.back}
              onChangeText={(text) => handleUpdateCardPreview(index, 'back', text)}
              multiline
            />
          </View>
        ))}
        
        <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
          <Icon name="plus-circle" size={24} color="#6200EE" />
          <Text style={styles.addCardText}>Tambah Kartu</Text>
        </TouchableOpacity>

        <Button
          title="Buat Deck"
          onPress={handleCreateDeck}
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
  formContainer: {
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  coverContainer: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
  },
  coverPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999999',
  },
  cardPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F0E6FF',
    borderRadius: 8,
    marginBottom: 24,
  },
  addCardText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '500',
  },
  createButton: {
    marginTop: 8,
  },
});

export default CreateDeckScreen; 
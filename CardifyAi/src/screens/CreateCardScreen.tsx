import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import Input from '../components/Input';
import { showSafeErrorAlert } from '../utils/helpers';
import { storage } from '../services/storage';
import { Card } from '../services/srs';

type CreateCardScreenProps = NativeStackScreenProps<MainStackParamList, 'CreateCard'>;

const CreateCardScreen: React.FC<CreateCardScreenProps> = ({ navigation, route }) => {
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');
  const [tags, setTags] = useState('');
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImagePath(result.assets[0].uri);
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
      }
    } catch (error) {
      console.error('Error choosing image:', error);
      showSafeErrorAlert('Error', 'Gagal memilih gambar');
    }
  };

  const handleCreateCard = async () => {
    if (!frontContent.trim() || !backContent.trim()) {
      showSafeErrorAlert('Error', 'Front dan back content harus diisi');
      return;
    }

    const deckId = route.params?.deckId;
    if (!deckId) {
      showSafeErrorAlert('Error', 'Deck ID tidak ditemukan');
      return;
    }

    setLoading(true);
    try {
      const card: Card = {
        id: Date.now().toString(),
        deckId: deckId,
        frontContent: frontContent.trim(),
        backContent: backContent.trim(),
        mediaPath: imagePath || undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        srsData: {
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          dueDate: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save card to local storage
      await storage.saveCards([card]);

      showSafeErrorAlert('Sukses', 'Kartu berhasil dibuat', () => {
        navigation.goBack();
      });
    } catch (error) {
      console.error('Error creating card:', error);
      showSafeErrorAlert('Error', 'Gagal membuat kartu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Buat Kartu Baru</Text>
        <Text style={styles.subtitle}>
          Buat kartu flashcard baru untuk deck Anda
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Front Content"
          value={frontContent}
          onChangeText={setFrontContent}
          placeholder="Masukkan pertanyaan atau kata kunci"
          multiline
          numberOfLines={3}
        />

        <Input
          label="Back Content"
          value={backContent}
          onChangeText={setBackContent}
          placeholder="Masukkan jawaban atau definisi"
          multiline
          numberOfLines={3}
        />

        <Input
          label="Tags (opsional)"
          value={tags}
          onChangeText={setTags}
          placeholder="Masukkan tags dipisahkan dengan koma"
        />

        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Media (opsional)</Text>
          
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton} onPress={handleTakePhoto}>
              <Icon name="camera" size={24} color="#6200EE" />
              <Text style={styles.mediaButtonText}>Ambil Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton} onPress={handleChooseImage}>
              <Icon name="image" size={24} color="#6200EE" />
              <Text style={styles.mediaButtonText}>Pilih Gambar</Text>
            </TouchableOpacity>
          </View>

          {imagePath && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imagePath }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImagePath(null)}
              >
                <Icon name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

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
  form: {
    gap: 16,
  },
  mediaSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mediaButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  imagePreview: {
    marginTop: 12,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    marginTop: 24,
  },
});

export default CreateCardScreen; 
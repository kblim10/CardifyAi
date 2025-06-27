import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/AppNavigator';
import Input from '../components/Input';
import Button from '../components/Button';
import { authAPI } from '../services/api';
import { storage } from '../services/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ProfileScreenProps = NativeStackScreenProps<MainTabParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user from local storage
      const userData = await storage.getUser();
      setUser(userData);
      
      if (userData) {
        setName(userData.name);
        setEmail(userData.email);
      }
      
      // Try to get fresh data from API
      try {
        const response = await authAPI.getProfile();
        const apiUser = response.data.data;
        
        // Update local storage
        await storage.setUser(apiUser);
        
        // Update state
        setUser(apiUser);
        setName(apiUser.name);
        setEmail(apiUser.email);
      } catch (apiError) {
        console.log('Failed to fetch user from API, using local data', apiError);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateProfile = () => {
    const newErrors: { name?: string; email?: string } = {};
    let isValid = true;

    if (!name || name.trim() === '') {
      newErrors.name = 'Nama harus diisi';
      isValid = false;
    }

    if (!email || email.trim() === '') {
      newErrors.email = 'Email harus diisi';
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePassword = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = 'Password saat ini harus diisi';
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = 'Password baru harus diisi';
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password baru minimal 6 karakter';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const userData = {
        name,
        email,
      };

      // Update on server
      try {
        const response = await authAPI.updateProfile(userData);
        const updatedUser = response.data.data;
        
        // Update local storage
        await storage.setUser({
          ...user,
          ...updatedUser,
        });
        
        // Update state
        setUser(prev => prev ? { ...prev, ...updatedUser } : null);
        
        Alert.alert('Sukses', 'Profil berhasil diperbarui');
      } catch (apiError) {
        console.log('Failed to update profile on server', apiError);
        Alert.alert('Error', 'Gagal memperbarui profil');
      }
      
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      // Update password on server
      try {
        await authAPI.updatePassword(currentPassword, newPassword);
        Alert.alert('Sukses', 'Password berhasil diperbarui');
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        setIsChangePassword(false);
      } catch (apiError) {
        console.log('Failed to update password on server', apiError);
        Alert.alert('Error', 'Password saat ini tidak valid');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Gagal memperbarui password');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseProfilePicture = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 300,
        maxHeight: 300,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        // In a real app, you would upload this to the server
        // For now, just update the local state
        setUser(prev => prev ? { ...prev, profilePicture: result.assets![0].uri } : null);
      }
    } catch (error) {
      console.error('Error choosing profile picture:', error);
      Alert.alert('Error', 'Gagal memilih foto profil');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Clear token and user data
            await storage.removeToken();
            await storage.removeUser();
            
            // Navigate to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' as any }],
            });
          },
        },
      ]
    );
  };

  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.profilePictureContainer} onPress={handleChooseProfilePicture}>
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.profilePicturePlaceholderText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          <View style={styles.editProfilePictureButton}>
            <Icon name="camera" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.profileName}>{user?.name || 'Pengguna'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
      </View>

      {isEditMode ? (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Edit Profil</Text>
          
          <Input
            label="Nama"
            placeholder="Masukkan nama Anda"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          
          <Input
            label="Email"
            placeholder="Masukkan email Anda"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          
          <View style={styles.formButtons}>
            <Button
              title="Simpan"
              onPress={handleUpdateProfile}
              loading={loading}
              style={styles.saveButton}
            />
            
            <Button
              title="Batal"
              onPress={() => {
                setIsEditMode(false);
                setName(user?.name || '');
                setEmail(user?.email || '');
                setErrors({});
              }}
              type="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      ) : isChangePassword ? (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Ubah Password</Text>
          
          <Input
            label="Password Saat Ini"
            placeholder="Masukkan password saat ini"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            error={errors.currentPassword}
          />
          
          <Input
            label="Password Baru"
            placeholder="Masukkan password baru"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            error={errors.newPassword}
          />
          
          <Input
            label="Konfirmasi Password"
            placeholder="Konfirmasi password baru"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />
          
          <View style={styles.formButtons}>
            <Button
              title="Simpan"
              onPress={handleUpdatePassword}
              loading={loading}
              style={styles.saveButton}
            />
            
            <Button
              title="Batal"
              onPress={() => {
                setIsChangePassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setErrors({});
              }}
              type="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Pengaturan</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="wifi-off" size={24} color="#666666" />
                <Text style={styles.settingLabel}>Mode Offline</Text>
              </View>
              <Switch
                value={isOfflineMode}
                onValueChange={setIsOfflineMode}
                trackColor={{ false: '#D1D1D1', true: '#9575CD' }}
                thumbColor={isOfflineMode ? '#6200EE' : '#F4F3F4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="theme-light-dark" size={24} color="#666666" />
                <Text style={styles.settingLabel}>Mode Gelap</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#D1D1D1', true: '#9575CD' }}
                thumbColor={isDarkMode ? '#6200EE' : '#F4F3F4'}
              />
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Akun</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditMode(true)}>
              <Icon name="account-edit" size={24} color="#6200EE" />
              <Text style={styles.actionButtonText}>Edit Profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsChangePassword(true)}>
              <Icon name="key" size={24} color="#6200EE" />
              <Text style={styles.actionButtonText}>Ubah Password</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}>
              <Icon name="logout" size={24} color="#FF5252" />
              <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appVersion}>CardifyAi v1.0.0</Text>
            <Text style={styles.appCopyright}>© 2023 CardifyAi Team</Text>
          </View>
        </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicturePlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editProfilePictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200EE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF5252',
  },
  aboutContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  appVersion: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999999',
  },
});

export default ProfileScreen; 
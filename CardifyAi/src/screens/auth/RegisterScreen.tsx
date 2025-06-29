import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authAPI } from '../../services/api';
import { storage } from '../../services/storage';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!name) {
      newErrors.name = 'Nama harus diisi';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email harus diisi';
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password harus diisi';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.register(name, email, password);
      
      // Save token and user data
      await storage.setToken(response.data.token);
      await storage.setUser(response.data.user);
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as any }],
      });
    } catch (error: any) {
      let message = 'Terjadi kesalahan saat registrasi';
      
      if (error.message === 'Network Error') {
        message = 'Tidak dapat terhubung ke server. Periksa koneksi internet dan pastikan backend berjalan.';
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      Alert.alert('Registrasi Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Buat Akun</Text>
          <Text style={styles.headerSubtitle}>
            Daftar untuk mulai belajar dengan flashcard dan AI
          </Text>
        </View>

        <View style={styles.formContainer}>
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

          <Input
            label="Password"
            placeholder="Masukkan password Anda"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Input
            label="Konfirmasi Password"
            placeholder="Masukkan password Anda lagi"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <Button
            title="Daftar"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  formContainer: {
    width: '100%',
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 
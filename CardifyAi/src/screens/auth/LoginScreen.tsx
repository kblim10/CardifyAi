import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { SafeAreaWrapper } from '../../components/SafeAreaWrapper';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authAPI } from '../../services/api';
import { storage } from '../../services/storage';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      // Save token and user data
      await storage.setToken(response.data.token);
      await storage.setUser(response.data.user);
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as any }],
      });
    } catch (error: any) {
      let message = 'Terjadi kesalahan saat login';
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      Alert.alert('Login Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#f8f9fa" statusBarStyle="dark-content">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>CardifyAi</Text>
            <Text style={styles.tagline}>
              Belajar lebih efektif dengan flashcard dan AI
            </Text>
          </View>

        <View style={styles.formContainer}>
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaWrapper>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6200EE',
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 
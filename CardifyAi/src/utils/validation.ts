import { VALIDATION_RULES } from '../constants';

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email harus diisi' };
  }

  if (!VALIDATION_RULES.EMAIL.test(email)) {
    return { isValid: false, error: 'Format email tidak valid' };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password harus diisi');
  } else {
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      errors.push(`Password minimal ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} karakter`);
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung huruf besar');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password harus mengandung huruf kecil');
    }

    if (!/\d/.test(password)) {
      errors.push('Password harus mengandung angka');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Konfirmasi password harus diisi' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Password tidak cocok' };
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Nama harus diisi' };
  }

  if (name.length < 2) {
    return { isValid: false, error: 'Nama minimal 2 karakter' };
  }

  if (name.length > 50) {
    return { isValid: false, error: 'Nama maksimal 50 karakter' };
  }

  return { isValid: true };
};

// Title validation
export const validateTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title) {
    return { isValid: false, error: 'Judul harus diisi' };
  }

  if (title.length < VALIDATION_RULES.TITLE_MIN_LENGTH) {
    return { isValid: false, error: `Judul minimal ${VALIDATION_RULES.TITLE_MIN_LENGTH} karakter` };
  }

  if (title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
    return { isValid: false, error: `Judul maksimal ${VALIDATION_RULES.TITLE_MAX_LENGTH} karakter` };
  }

  return { isValid: true };
};

// Description validation
export const validateDescription = (description: string): { isValid: boolean; error?: string } => {
  if (description && description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    return { isValid: false, error: `Deskripsi maksimal ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} karakter` };
  }

  return { isValid: true };
};

// Card content validation
export const validateCardContent = (front: string, back: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!front || front.trim().length === 0) {
    errors.push('Pertanyaan harus diisi');
  }

  if (!back || back.trim().length === 0) {
    errors.push('Jawaban harus diisi');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// File validation
export const validateFile = (file: any, maxSize: number = 10 * 1024 * 1024): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'File harus dipilih' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: `Ukuran file maksimal ${formatFileSize(maxSize)}` };
  }

  return { isValid: true };
};

// Image validation
export const validateImage = (file: any): { isValid: boolean; error?: string } => {
  const fileValidation = validateFile(file);
  if (!fileValidation.isValid) {
    return fileValidation;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP' };
  }

  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: false, error: 'URL harus diisi' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Format URL tidak valid' };
  }
};

// Phone number validation (Indonesian format)
export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'Nomor telepon harus diisi' };
  }

  // Remove spaces, dashes, and plus sign
  const cleanPhone = phone.replace(/[\s\-+]/g, '');

  // Check if it's a valid Indonesian phone number
  const phoneRegex = /^(08|\+628|628)\d{8,11}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Format nomor telepon tidak valid' };
  }

  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: any, fieldName: string): { isValid: boolean; error?: string } => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { isValid: false, error: `${fieldName} harus diisi` };
  }

  return { isValid: true };
};

// Number validation
export const validateNumber = (value: any, fieldName: string, min?: number, max?: number): { isValid: boolean; error?: string } => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} harus berupa angka` };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} minimal ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} maksimal ${max}` };
  }

  return { isValid: true };
};

// Date validation
export const validateDate = (date: any, fieldName: string): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: `${fieldName} harus diisi` };
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} tidak valid` };
  }

  return { isValid: true };
};

// Array validation
export const validateArray = (array: any[], fieldName: string, minLength?: number, maxLength?: number): { isValid: boolean; error?: string } => {
  if (!Array.isArray(array)) {
    return { isValid: false, error: `${fieldName} harus berupa array` };
  }

  if (minLength !== undefined && array.length < minLength) {
    return { isValid: false, error: `${fieldName} minimal ${minLength} item` };
  }

  if (maxLength !== undefined && array.length > maxLength) {
    return { isValid: false, error: `${fieldName} maksimal ${maxLength} item` };
  }

  return { isValid: true };
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Form validation helper
export const validateForm = (formData: { [key: string]: any }, rules: { [key: string]: (value: any) => { isValid: boolean; error?: string } }) => {
  const errors: { [key: string]: string } = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const validation = rules[field](formData[field]);
    if (!validation.isValid) {
      errors[field] = validation.error || '';
      isValid = false;
    }
  });

  return { isValid, errors };
}; 
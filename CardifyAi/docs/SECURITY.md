# CardifyAi Security Guide

## Overview
This document outlines security measures and best practices implemented in the CardifyAi application to protect user data and ensure application security.

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: Configurable token lifetime
- **Refresh Tokens**: Secure token refresh mechanism
- **Role-based Access**: User permission management

### Data Protection
- **HTTPS Only**: All communications encrypted
- **Data Encryption**: Sensitive data encrypted at rest
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries

---

## Frontend Security

### Secure Storage
```typescript
// Secure token storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from '../utils/encryption';

class SecureStorage {
  static async setItem(key: string, value: string): Promise<void> {
    const encryptedValue = await encrypt(value);
    await AsyncStorage.setItem(key, encryptedValue);
  }

  static async getItem(key: string): Promise<string | null> {
    const encryptedValue = await AsyncStorage.getItem(key);
    if (encryptedValue) {
      return await decrypt(encryptedValue);
    }
    return null;
  }
}
```

### Input Validation
```typescript
// Comprehensive input validation
import { validateEmail, validatePassword } from '../utils/validation';

const validateLoginForm = (data: LoginForm) => {
  const errors: string[] = [];

  // Email validation
  if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  return errors;
};
```

### API Security
```typescript
// Secure API calls
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = __DEV__ 
      ? 'http://localhost:5000/api' 
      : 'https://your-production-api.com/api';
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
```

### Certificate Pinning
```typescript
// Certificate pinning for API calls
import { Platform } from 'react-native';

const pinCertificate = (url: string) => {
  if (Platform.OS === 'ios') {
    // iOS certificate pinning
    return {
      sslPinning: {
        certs: ['cert1', 'cert2']
      }
    };
  } else {
    // Android certificate pinning
    return {
      sslPinning: {
        certs: ['cert1', 'cert2']
      }
    };
  }
};
```

---

## Backend Security

### Authentication Middleware
```javascript
// JWT authentication middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};
```

### Input Sanitization
```javascript
// Input sanitization middleware
const sanitize = require('mongo-sanitize');
const xss = require('xss');

const sanitizeInput = (req, res, next) => {
  // Remove MongoDB operators
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  // XSS protection
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }

  next();
};
```

### Rate Limiting
```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
});
```

### CORS Configuration
```javascript
// Secure CORS configuration
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### Password Hashing
```javascript
// Secure password hashing
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

---

## Database Security

### MongoDB Security
```javascript
// Secure MongoDB connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      sslCA: process.env.MONGODB_CA_CERT,
      authSource: 'admin',
      retryWrites: true,
      w: 'majority',
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

### Data Validation
```javascript
// Mongoose schema validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return hasUpperCase && hasLowerCase && hasNumbers;
      },
      message: 'Password must contain uppercase, lowercase, and numbers'
    }
  }
});
```

---

## API Security

### Request Validation
```javascript
// Request validation middleware
const { body, validationResult } = require('express-validator');

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];
```

### Error Handling
```javascript
// Secure error handling
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Don't expose internal errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.message
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value'
    });
  }

  // Generic error response
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};
```

---

## Environment Security

### Environment Variables
```bash
# Production environment variables
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cardifyai?retryWrites=true&w=majority
MONGODB_CA_CERT=/path/to/ca-certificate.crt

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=90d

# API Keys
OCR_API_KEY=your-ocr-api-key
OCR_API_URL=https://api.ocr.space/parse/image

# Cloud Storage
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@cardifyai.com

# Security
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=your-session-secret
```

### Secrets Management
```javascript
// Secure secrets management
const crypto = require('crypto');

class SecretsManager {
  static encrypt(text, key) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decrypt(encryptedText, key) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
```

---

## Mobile App Security

### Biometric Authentication
```typescript
// Biometric authentication
import ReactNativeBiometrics from 'react-native-biometrics';

class BiometricAuth {
  static async isBiometricAvailable() {
    const { available, biometryType } = await ReactNativeBiometrics.isSensorAvailable();
    return { available, biometryType };
  }

  static async authenticate() {
    const { success } = await ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Confirm biometric authentication',
    });
    return success;
  }
}
```

### Secure Key Storage
```typescript
// Secure key storage using Keychain/Keystore
import Keychain from 'react-native-keychain';

class SecureKeyStorage {
  static async storeCredentials(service: string, username: string, password: string) {
    try {
      await Keychain.setInternetCredentials(service, username, password);
      return true;
    } catch (error) {
      console.error('Error storing credentials:', error);
      return false;
    }
  }

  static async getCredentials(service: string) {
    try {
      const credentials = await Keychain.getInternetCredentials(service);
      return credentials;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  }
}
```

### App Security Configuration
```typescript
// App security configuration
import { Platform } from 'react-native';

const SecurityConfig = {
  // Prevent screenshots in sensitive screens
  preventScreenshots: true,
  
  // Jailbreak/root detection
  detectJailbreak: true,
  
  // Certificate pinning
  certificatePinning: true,
  
  // Network security
  networkSecurityConfig: Platform.OS === 'android' ? {
    cleartextTraffic: false,
    networkSecurityConfig: '@xml/network_security_config'
  } : null,
  
  // App signing
  appSigning: {
    enabled: true,
    keyAlias: 'cardifyai',
    keyPassword: 'your-key-password',
  }
};
```

---

## Security Headers

### HTTP Security Headers
```javascript
// Security headers middleware
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  frameguard: {
    action: 'deny'
  }
}));
```

### CORS Security
```javascript
// Secure CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400
}));
```

---

## Security Monitoring

### Logging
```javascript
// Security logging
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' }),
    new winston.transports.Console()
  ]
});

const logSecurityEvent = (event, details) => {
  securityLogger.info({
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
};
```

### Intrusion Detection
```javascript
// Basic intrusion detection
const suspiciousActivity = (req, res, next) => {
  const suspiciousPatterns = [
    /script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /union\s+select/i
  ];

  const userInput = JSON.stringify(req.body) + JSON.stringify(req.query);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      logSecurityEvent('suspicious_activity', {
        pattern: pattern.source,
        input: userInput,
        ip: req.ip
      });
      
      return res.status(400).json({
        success: false,
        error: 'Invalid input detected'
      });
    }
  }
  
  next();
};
```

---

## Security Checklist

### Development
- [ ] Input validation implemented
- [ ] Output encoding applied
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] Secure authentication
- [ ] Password hashing
- [ ] Session management
- [ ] Error handling secure

### Deployment
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] Rate limiting enabled
- [ ] Environment variables secure
- [ ] Database connections encrypted
- [ ] Logging configured
- [ ] Monitoring enabled

### Mobile App
- [ ] Certificate pinning
- [ ] Biometric authentication
- [ ] Secure storage
- [ ] Jailbreak detection
- [ ] Screenshot prevention
- [ ] Network security
- [ ] App signing
- [ ] Code obfuscation

### Maintenance
- [ ] Regular security updates
- [ ] Dependency scanning
- [ ] Vulnerability assessment
- [ ] Penetration testing
- [ ] Security audits
- [ ] Incident response plan
- [ ] Backup security
- [ ] Access control review

---

## Incident Response

### Security Incident Plan
1. **Detection**: Monitor logs and alerts
2. **Assessment**: Evaluate impact and scope
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Document and improve

### Contact Information
- **Security Team**: security@cardifyai.com
- **Emergency**: +1-XXX-XXX-XXXX
- **Bug Reports**: bugs@cardifyai.com

### Response Timeline
- **Immediate**: Within 1 hour
- **Containment**: Within 4 hours
- **Resolution**: Within 24 hours
- **Post-mortem**: Within 1 week 
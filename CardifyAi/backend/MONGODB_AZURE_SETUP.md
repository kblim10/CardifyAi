# MONGODB ATLAS SETUP UNTUK AZURE

## 1. Whitelist Azure IP
Di MongoDB Atlas > Network Access, tambahkan IP ranges Azure:
- 0.0.0.0/0 (untuk testing - tidak disarankan untuk production)
- Atau IP ranges Azure spesifik region Anda

## 2. Connection String
Pastikan connection string di Azure App Settings:
```
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/cardifyai?retryWrites=true&w=majority&appName=CardifyAi
```

## 3. Database User
Buat database user dengan permissions:
- Read and write to any database
- Atau spesifik ke database 'cardifyai'

## 4. Security Best Practices
- Gunakan environment variables untuk credentials
- Enable Atlas authentication
- Restrict IP access ke Azure regions
- Enable database auditing
- Use SSL/TLS encryption

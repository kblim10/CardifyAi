# CardifyAi Deployment Guide

## Overview
This guide covers the deployment process for both the backend API and the React Native mobile application.

## Backend Deployment

### Prerequisites
- Node.js 16+ installed
- MongoDB database (local or cloud)
- Environment variables configured
- Domain name (optional)

### Environment Setup

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://your-mongodb-uri

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# OCR Service
OCR_API_KEY=your-ocr-api-key
OCR_API_URL=https://api.ocr.space/parse/image

# Cloud Storage (Optional)
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@cardifyai.com

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Options

#### 1. Heroku Deployment

**Step 1: Install Heroku CLI**
```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

**Step 2: Login to Heroku**
```bash
heroku login
```

**Step 3: Create Heroku App**
```bash
cd backend
heroku create cardifyai-api
```

**Step 4: Add MongoDB Add-on**
```bash
heroku addons:create mongolab:sandbox
```

**Step 5: Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set OCR_API_KEY=your-ocr-api-key
# Add other environment variables
```

**Step 6: Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**Step 7: Open App**
```bash
heroku open
```

#### 2. Railway Deployment

**Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

**Step 2: Login to Railway**
```bash
railway login
```

**Step 3: Initialize Project**
```bash
cd backend
railway init
```

**Step 4: Add Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-super-secret-jwt-key
# Add other variables
```

**Step 5: Deploy**
```bash
railway up
```

#### 3. DigitalOcean App Platform

**Step 1: Create App**
1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect your GitHub repository
4. Select the backend directory

**Step 2: Configure Environment**
- Set environment variables in the dashboard
- Configure build command: `npm install && npm run build`
- Configure run command: `npm start`

**Step 3: Deploy**
- Click "Deploy" to start the deployment process

#### 4. AWS EC2 Deployment

**Step 1: Launch EC2 Instance**
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip
```

**Step 2: Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB (if using local database)
sudo apt install mongodb
```

**Step 3: Clone Repository**
```bash
git clone https://github.com/your-username/CardifyAi.git
cd CardifyAi/backend
```

**Step 4: Install Dependencies**
```bash
npm install
npm run build
```

**Step 5: Configure Environment**
```bash
cp .env.example .env
# Edit .env file with your configuration
nano .env
```

**Step 6: Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

**Step 7: Configure Nginx (Optional)**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/cardifyai
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cardifyai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Database Setup

#### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create a new cluster
   - Choose your preferred cloud provider and region

2. **Configure Network Access**
   - Add your IP address or `0.0.0.0/0` for all IPs

3. **Create Database User**
   - Create a database user with read/write permissions

4. **Get Connection String**
   - Copy the connection string
   - Replace `<password>` with your actual password

#### Local MongoDB

```bash
# Install MongoDB
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
use cardifyai
db.createUser({
  user: "cardifyai_user",
  pwd: "your_password",
  roles: ["readWrite"]
})
```

### SSL/HTTPS Setup

#### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Cloudflare (Alternative)

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption mode to "Full"
4. Configure DNS records

---

## Frontend Deployment

### Android Build

#### 1. Generate Keystore

```bash
cd android/app
keytool -genkey -v -keystore cardifyai.keystore -alias cardifyai -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Configure Gradle

Edit `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=cardifyai.keystore
MYAPP_UPLOAD_KEY_ALIAS=cardifyai
MYAPP_UPLOAD_STORE_PASSWORD=your-store-password
MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
```

Edit `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

#### 3. Build APK

```bash
cd android
./gradlew assembleRelease
```

#### 4. Build AAB (for Google Play Store)

```bash
cd android
./gradlew bundleRelease
```

### iOS Build

#### 1. Configure Xcode

1. Open `ios/CardifyAi.xcworkspace` in Xcode
2. Select your team in Signing & Capabilities
3. Update Bundle Identifier
4. Configure App Icons and Launch Screen

#### 2. Build for Archive

```bash
cd ios
xcodebuild -workspace CardifyAi.xcworkspace -scheme CardifyAi -configuration Release -destination generic/platform=iOS archive -archivePath CardifyAi.xcarchive
```

#### 3. Export IPA

```bash
xcodebuild -exportArchive -archivePath CardifyAi.xcarchive -exportOptionsPlist exportOptions.plist -exportPath ./build
```

### App Store Deployment

#### Google Play Store

1. **Create Developer Account**
   - Go to Google Play Console
   - Pay $25 one-time fee

2. **Create App**
   - Click "Create app"
   - Fill in app details
   - Upload AAB file

3. **Configure Store Listing**
   - App description
   - Screenshots
   - Privacy policy
   - Content rating

4. **Submit for Review**
   - Complete all required sections
   - Submit for review

#### Apple App Store

1. **Create Developer Account**
   - Go to Apple Developer Program
   - Pay $99/year fee

2. **Create App**
   - Go to App Store Connect
   - Click "My Apps" → "+"
   - Fill in app details

3. **Upload Build**
   - Use Xcode or Application Loader
   - Upload IPA file

4. **Configure Store Listing**
   - App description
   - Screenshots
   - Privacy policy
   - Content rating

5. **Submit for Review**
   - Complete all required sections
   - Submit for review

### Continuous Deployment

#### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "backend"

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Setup Java
        uses: actions/setup-java@v2
        with:
          java-version: '11'
          distribution: 'adopt'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build Android APK
        run: cd android && ./gradlew assembleRelease
        
      - name: Upload APK
        uses: actions/upload-artifact@v2
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/app-release.apk
```

#### Fastlane (iOS)

Create `ios/fastlane/Fastfile`:

```ruby
default_platform(:ios)

platform :ios do
  desc "Deploy to App Store"
  lane :deploy do
    build_app(
      scheme: "CardifyAi",
      export_method: "app-store"
    )
    upload_to_app_store
  end
end
```

### Environment Configuration

#### Production Environment

Update `src/config/index.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-production-api.com/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};
```

#### Environment-specific Builds

Create different environment files:

`.env.production`:
```env
API_BASE_URL=https://your-production-api.com/api
ENVIRONMENT=production
```

`.env.staging`:
```env
API_BASE_URL=https://your-staging-api.com/api
ENVIRONMENT=staging
```

### Monitoring and Analytics

#### Crash Reporting

1. **Firebase Crashlytics**
   ```bash
   npm install @react-native-firebase/crashlytics
   ```

2. **Sentry**
   ```bash
   npm install @sentry/react-native
   ```

#### Analytics

1. **Firebase Analytics**
   ```bash
   npm install @react-native-firebase/analytics
   ```

2. **Mixpanel**
   ```bash
   npm install react-native-mixpanel
   ```

### Performance Optimization

#### Bundle Size Optimization

1. **Enable Hermes**
   ```json
   // android/app/build.gradle
   project.ext.react = [
       enableHermes: true
   ]
   ```

2. **Enable ProGuard**
   ```gradle
   // android/app/build.gradle
   def enableProguardInReleaseBuilds = true
   ```

3. **Remove Unused Dependencies**
   ```bash
   npm install -g depcheck
   depcheck
   ```

#### Image Optimization

1. **Compress Images**
   ```bash
   npm install -g imagemin-cli
   imagemin images/* --out-dir=optimized
   ```

2. **Use WebP Format**
   - Convert images to WebP for smaller file sizes

### Security Checklist

- [ ] HTTPS enabled for all API calls
- [ ] JWT tokens properly configured
- [ ] API keys stored securely
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Error messages don't expose sensitive data
- [ ] Regular security updates

### Backup Strategy

#### Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb://your-connection-string" --out=backup/

# Restore
mongorestore --uri="mongodb://your-connection-string" backup/
```

#### Automated Backups

```bash
# Cron job for daily backup
0 2 * * * /usr/bin/mongodump --uri="mongodb://your-connection-string" --out=/backup/$(date +\%Y\%m\%d)/
```

### Troubleshooting

#### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Clear cache: `npm start -- --reset-cache`
   - Clean build: `cd android && ./gradlew clean`

2. **API Connection Issues**
   - Verify API URL configuration
   - Check CORS settings
   - Test API endpoints manually

3. **Performance Issues**
   - Enable Hermes engine
   - Optimize images
   - Remove unused dependencies

4. **App Store Rejection**
   - Follow Apple's Human Interface Guidelines
   - Provide clear app description
   - Include privacy policy
   - Test on multiple devices

### Maintenance

#### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Monitor app performance
- [ ] Review crash reports
- [ ] Backup database weekly
- [ ] Update SSL certificates
- [ ] Monitor API usage
- [ ] Review user feedback

#### Monitoring Tools

- **Backend**: New Relic, DataDog, or AWS CloudWatch
- **Mobile**: Firebase Performance, Crashlytics
- **Database**: MongoDB Atlas monitoring
- **API**: Postman monitoring or custom solutions 
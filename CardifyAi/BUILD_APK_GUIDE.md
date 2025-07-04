# BUILD APK PRODUCTION GUIDE

## 1. Update API URL
Pastikan di src/services/api.ts production URL sudah benar:
```typescript
return 'https://cardifyai-backend.azurewebsites.net/api';
```

## 2. Generate Release APK
cd android
./gradlew assembleRelease

## 3. Generate Signed APK
# Buat keystore jika belum ada:
keytool -genkey -v -keystore cardifyai-release-key.keystore -alias cardifyai-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Edit android/gradle.properties:
```
MYAPP_RELEASE_STORE_FILE=cardifyai-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=cardifyai-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_password_here
MYAPP_RELEASE_KEY_PASSWORD=your_password_here
```

# Edit android/app/build.gradle:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
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

## 4. Build Signed APK
cd android
./gradlew assembleRelease

## 5. APK Location
APK akan tersimpan di:
android/app/build/outputs/apk/release/app-release.apk

# CardifyAi

CardifyAi adalah aplikasi mobile pembelajaran berbasis flashcard yang memadukan teknologi AI dan algoritma Spaced Repetition System (SRS) untuk membantu pengguna belajar secara efektif dan efisien. Dengan antarmuka intuitif dan dukungan offline, CardifyAi cocok untuk siswa, mahasiswa, dan siapa pun yang ingin meningkatkan daya ingat materi pelajaran.

## 🎯 Tujuan

- Membantu pengguna menghafal konsep penting melalui metode ilmiah.
- Mempermudah proses pembuatan flashcard dengan bantuan AI dan OCR.
- Menyediakan sistem review otomatis menggunakan algoritma SRS.

## 🚀 Fitur Utama

- **Sistem Flashcard**: Membuat dan mengelola koleksi flashcard dengan animasi flip dan swipe.
- **Spaced Repetition System (SRS)**: Algoritma berdasarkan SM-2 untuk mengatur jadwal review.
- **OCR & Ekstraksi Teks**: Scan gambar/dokumen untuk mengekstrak teks otomatis.
- **Generasi AI**: Membuat flashcard dari teks yang diekstrak.
- **Sinkronisasi Cloud**: Akses flashcard dari berbagai perangkat.
- **Mode Offline**: Gunakan aplikasi tanpa koneksi internet.
- **Upload File**: Mendukung gambar dan dokumen PDF.
- **Tema Gelap/Terang**: Tampilan sesuai preferensi pengguna.
- **Statistik Belajar**: Tampilkan progres harian/mingguan.

## 🛠 Teknologi

### Frontend

- **Framework**: React Native + TypeScript
- **Navigasi**: @react-navigation/native
- **Database Lokal**: SQLite
- **OCR**: tesseract.js
- **Animasi**: lottie-react-native, react-native-reanimated

### Backend

- **Runtime**: Node.js (Express.js)
- **Database**: MongoDB Atlas
- **Autentikasi**: JWT + bcrypt
- **Upload File**: Multer / Cloudinary
- **OCR Service**: Tesseract.js

## 📁 Struktur Proyek

/src
/components      # Komponen UI
/screens         # Halaman aplikasi
/navigation      # Navigasi aplikasi
/services        # API, database lokal, OCR
/utils           # Helpers
/assets          # Gambar, font, dll

/backend
/controllers     # Logika bisnis
/models          # Model MongoDB
/routes          # Endpoint API
/middleware      # Auth, upload handler
/services        # OCR, AI, file handler
/utils           # Helpers
/config          # DB config, env
server.js        # Entry point


## ⚙️ Instalasi

### Frontend (React Native)

```bash
# Instal dependensi
npm install

# Jalankan di Android
npm run android

# Jalankan di iOS
npm run ios
````

### Backend (Node.js)

```bash
cd backend

# Instal dependensi
npm install

# Jalankan server
npm start
```

## 📦 Dependensi Utama

### Frontend

* @react-navigation/native
* react-native-sqlite-storage
* expo-document-picker
* expo-image-picker
* tesseract.js
* lottie-react-native
* react-native-reanimated

### Backend

* express
* mongoose
* jsonwebtoken
* bcryptjs
* multer
* cors, dotenv, morgan

## 🧾 Model Data

### Deck

* `id`: String
* `title`: String
* `description`: String (opsional)
* `coverImagePath`: String (opsional)
* `isPublic`: Boolean
* `tags`: String\[] (opsional)
* `createdAt`: Date
* `updatedAt`: Date

### Card

* `id`: String
* `deckId`: String
* `frontContent`: String
* `backContent`: String
* `tags`: String\[] (opsional)
* `mediaPath`: String (opsional)
* `srsData`: CardReviewData
* `createdAt`: Date
* `updatedAt`: Date

### CardReviewData (SRS)

* `easeFactor`: Number
* `interval`: Number
* `repetitions`: Number
* `dueDate`: Date
* `lastReviewedAt`: Date

## 🔄 Alur Kerja

1. Pengguna membuat atau memilih deck.
2. Tambahkan kartu manual atau gunakan AI.
3. Unggah gambar/dokumen untuk generate kartu otomatis.
4. Algoritma SRS tentukan kartu yang perlu direview.
5. Review kartu dengan swipe berdasarkan kesulitan.
6. Data disimpan dan jadwal review dioptimalkan.

## 🧪 Contoh Penggunaan

* Buat akun/login
* Buat deck atau impor file PDF/gambar
* Gunakan AI untuk generate kartu otomatis
* Review kartu sesuai jadwal SRS
* Cek progres belajar di dashboard

## 📝 Catatan Pengembangan

* Gunakan `.env` untuk kunci API dan config rahasia
* Pastikan izin kamera/penyimpanan diset di Android/iOS
* Semua request ke backend harus pakai token
* Gunakan SecureStore/AsyncStorage untuk token

## 🤝 Kontribusi

Lihat file `CONTRIBUTING.md` untuk panduan kontribusi.

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** – lihat file `LICENSE` untuk detail.

# Panduan Kontribusi untuk CardifyAi

Halo! Terima kasih telah tertarik untuk berkontribusi ke proyek **CardifyAi**. Dengan kontribusi kamu, kami bisa membuat aplikasi pembelajaran berbasis flashcard ini menjadi lebih baik dan bermanfaat bagi banyak orang.

## Cara Berkontribusi

1. **Fork repositori** ini ke akun GitHub kamu.
2. Buat branch baru dengan nama yang deskriptif:
   ```bash
   git checkout -b fitur/nama-fitur-baru
   ```
3. Lakukan perubahan atau penambahan sesuai dengan issue yang ingin kamu selesaikan.
4. Commit perubahan dengan pesan commit yang jelas:
  ```bash
  git commit -m "Tambah: Tombol tema gelap di pengaturan"
  ```
5. Push ke branch kamu:
   ```bash
   git push origin fitur/nama-fitur-baru
   ```
6. Buat Pull Request (PR) ke repositori utama dengan deskripsi perubahan yang jelas.
a. Pedoman Kode
- Pastikan kode bersih, terdokumentasi, dan mudah dibaca.
- Gunakan TypeScript secara konsisten.
- Ikuti gaya penulisan kode yang sudah ada di proyek.
- Tambahkan komentar jika diperlukan untuk menjelaskan logika yang kompleks.
b. Testing
- Jika kamu menambahkan fitur baru, pastikan menulis unit test jika memungkinkan.
- Jalankan linting dan pastikan tidak ada error:
   ```bash
  npm run lint
   ```
c. Pelaporan Masalah
Jika kamu menemukan bug atau punya ide untuk fitur baru, silakan buka issue di repositori ini. Sertakan detail seperti:
- Deskripsi masalah/ide
- Langkah-langkah reproduksi (jika bug)
- Versi OS, device, dan aplikasi

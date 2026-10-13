# Our Little Birthday Story 🎀

Hadiah ulang tahun interaktif berbahasa Indonesia: tujuh bab scrapbook, kalender, kartu alasan, galeri polaroid, permainan lilin, surat cinta, dan hadiah terakhir. Dibangun dengan React 19, Vite 7, Tailwind CSS 4, Framer Motion, GSAP ScrollTrigger, serta Lucide React.

## Menjalankan

Gunakan Node.js 22.12+ (lingkungan ini diuji dengan Node.js 24).

```bash
npm install
npm run dev
```

Build produksi dan pemeriksaan hasil:

```bash
npm run build
npm run preview
```

Untuk instalasi yang identik dengan lockfile, gunakan `npm ci`. Jika direktori cache npm default tidak dapat ditulis di cloud, gunakan `npm ci --cache /tmp/hbd-npm-cache`.

## Personalisasi

Edit **`src/data/birthdayConfig.js`**:

- `recipientName`, `senderName`: nama penerima dan pengirim.
- `birthdayDate`: tanggal `YYYY-MM-DD`; kalender mengikuti bulan, tahun, dan hari dalam minggu yang sebenarnya.
- `heroTitle`: gunakan `\n` untuk memisahkan dua baris judul.
- `heroSubtitle`, `copy`, `calendarMessage`, `reasons`, `wishMessage`, `letter`, `finalTitle`, `finalMessage`: judul serta pesan utama.
- `photos`: path foto di folder `public/images/`, misalnya `/images/kita-di-pantai.jpg`. Empat foto direkomendasikan untuk komposisi satu layar. Gambar portrait atau persegi memberikan hasil terbaik; gambar galeri dipotong dengan `object-fit: cover`, viewer menampilkan foto utuh.
- `captions`: caption sesuai urutan foto.
- `backgroundMusic`: path audio, misalnya `/audio/lagu-kita.mp3`. Tempatkan file milik Anda di `public/audio/`.
- `enableMusic`, `enableConfetti`, `enableScrollAnimations`: sakelar fitur.

Foto default adalah **ilustrasi SVG pengganti**, bukan foto pribadi. Jika foto tidak ditemukan, ilustrasi fallback muncul. Musik default merupakan melodi music-box instrumental asli sepanjang 24 detik yang dapat diulang; tidak memakai rekaman pihak ketiga. Musik dimulai lewat tombol pembuka atau tombol musik, volume naik perlahan ke 30%, dan tombol mute juga menonaktifkan efek suara. Kegagalan audio tidak menghalangi cerita. Semua font disertakan lokal melalui Fontsource; aplikasi tidak memerlukan koneksi ke Google Fonts, backend, akun, atau API key.

## Interaksi

1. Buka kejutan untuk memulai musik dan pindah ke kalender.
2. Sentuh tanggal lewat tombol kejutan untuk melihat pesan tambahan.
3. Geser kartu atau gunakan panah; sentuh kartu untuk membaliknya.
4. Buka foto, lalu geser atau gunakan panah di viewer. Tutup melalui tombol, backdrop, atau Escape.
5. Nyalakan lilin → buat permohonan → tiup. Permainan bisa diulang.
6. Buka amplop, baca surat dengan scroll internal, lalu tutup.
7. Buka hadiah, kirim pelukan, atau ulangi cerita untuk mereset permainan dan interaksi.

Navigasi titik di sisi layar memungkinkan akses langsung ke setiap bab. Modal mengunci scroll latar, mempertahankan fokus keyboard, dan mengembalikannya ketika ditutup. Preferensi reduced motion menonaktifkan animasi ambient, parallax, dan confetti. Pada layar sangat pendek (tinggi di bawah 530 px), section dapat memanjang agar konten tetap terbaca; ukuran HP normal memakai tepat `100svh`.

## Struktur proyek

```text
public/
  audio/romantic.wav
  images/memory-1.svg ... memory-4.svg, fallback.svg
src/
  main.jsx
  BirthdayApp.jsx
  styles.css
  data/birthdayConfig.js
  components/
    Illustrations.jsx      # Kue, pita, hadiah, pelukan SVG/CSS
    Shared.jsx             # Section, tombol, modal, gambar fallback, confetti
    MusicController.jsx    # Musik, fade-in, mute, efek suara
    StorySections.jsx      # Tujuh bab beserta state interaksi
 tests/story.spec.js
index.html
package.json
package-lock.json
vite.config.js             # Plugin React dan Tailwind CSS 4
playwright.config.js
```

## Pengujian

```bash
npx playwright install chromium
npm test
```

Jika Chromium sistem sudah tersedia:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

Suite menguji alur lengkap, galeri, focus trap, fallback foto, kontrol musik, permainan lilin, surat, hadiah, replay, ukuran section, serta overflow pada 360×640, 390×844, dan 1440×900. Tidak memerlukan mikrofon: lilin ditiup melalui tombol.

## Publikasi website

Deploy isi `dist/` ke hosting statis setelah `npm run build`. Tidak perlu server aplikasi. Jika hosting berada di subdirektori, sesuaikan `base` pada konfigurasi Vite dan path aset pada konfigurasi ulang tahun. Berkas foto pribadi dan audio yang disertakan dalam deploy akan dapat diakses pengunjung website; hanya sertakan aset yang ingin dibagikan.

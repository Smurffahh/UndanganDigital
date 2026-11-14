# Fauzan & Sinta - Platform Undangan Digital & Dashboard Admin

Platform web undangan pernikahan digital interaktif dengan ornamen budaya Nusantara, sistem konfirmasi kehadiran (RSVP), dan pemutar musik terintegrasi. Proyek ini dilengkapi Dashboard Admin untuk pengelolaan konten acara, manajemen data tamu, serta pengiriman pesan undangan massal via WhatsApp Web.

[![Next.js](https://img.shields.io/badge/Next.js-15.2-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.39-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Neon PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat-square&logo=postgresql&logoColor=black)](https://neon.tech/)

---

## Fitur Utama

### Halaman Undangan Publik
- **Sampul Interaktif (Cover Gate)**: Pembuka undangan sinematik dengan sapaan nama tamu dinamis via parameter `?kpd=`. Sistem menyediakan fallback otomatis ke "Tamu Undangan" jika parameter kosong, serta tetap mendukung format lama `?to=`.
- **Pemutar Musik Latar**: Pemutar musik audio terintegrasi dengan kontrol putar/jeda, visual piringan hitam vinyl, serta perlindungan auto-pause saat berpindah tab peramban.
- **Desain Mobile-First & Ornamen Nusantara**: Tata letak responsif penuh (320px hingga desktop) dengan motif Batik Kawung, Pita Songket, Gunungan Wayang, dan Mihrab Islami tanpa pergeseran horizontal (*zero horizontal scroll*).
- **Profil Mempelai & Deskripsi Acara**: Menampilkan nama kedua mempelai, foto, urutan kelahiran dalam keluarga, serta nama orang tua.
- **Hitung Mundur Waktu Acara**: Penghitung mundur waktu nyata menggunakan transisi digit NumberFlow dengan tipografi angka tabular (*tabular numbers*).
- **Detail Acara & Integrasi Peta**: Rincian waktu Akad Nikah dan Resepsi, alamat gedung, Plus Code lokasi, tautan Google Maps, serta opsi simpan jadwal ke Google Calendar atau berkas `.ics`.
- **Galeri Foto & Alur Perjalanan**: Tampilan dokumentasi foto mempelai serta lini masa perjalanan cinta (*love story*).
- **Buku Tamu & RSVP Interaktif**: Formulir konfirmasi kehadiran dan ucapan doa restu yang dilengkapi filter status kehadiran serta pencarian pesan secara langsung (*real-time*).
- **Amplop Digital & QRIS**: Kartu rekening bank berdesain kartu debit premium dengan tombol salin nomor rekening instan dan modal kode QRIS layar penuh.

### Dashboard Admin
- **Pengaturan Konten Real-Time**: Pembaruan profil mempelai, jadwal acara, teks deskripsi, daftar rekening bank, dan gambar QRIS langsung dari antarmuka peramban.
- **Kontrol Visibilitas Seksi (Toggle On/Off)**: Tombol switch untuk menyembunyikan atau menampilkan seksi **Galeri Foto** dan seksi **Alur Perjalanan** beserta tautan navigasinya secara instan.
- **Manajemen Tamu Terpusat**: Tambah kontak manual perorangan, tambah massal berbasis teks (*bulk text input*), dan pencarian daftar tamu.
- **Impor & Ekspor Spreadsheet (.xlsx / .csv)**: Dukungan impor data tamu dengan pencocokan nama kolom fleksibel (*case-insensitive*). Tamu tanpa nomor WhatsApp tetap dapat diimpor.
- **Normalisasi Nomor Telepon Otomatis**: Konversi format nomor telepon lokal (`08xx`, `8xx`, `+628xx`, `00628xx`) ke format internasional resmi `628xx` secara otomatis, disertai sanitasi proteksi terhadap *formula injection*.
- **Pembaruan Data Aman (Safe Upsert)**: Data tamu yang namanya telah terdaftar di database akan diperbarui nomor kontak atau kategorinya tanpa merusak atau mengubah token tautan undangan (`slugQuery`).
- **Antrean Kirim WhatsApp Web (Smart WA Queue)**: Pengiriman pesan massal menggunakan satu target tab peramban (`undangan_wa_sender`) dengan jeda aman anti-spam, template pesan berparameter dinamis, serta pencatatan otomatis status pengiriman (`Belum Dikirim` / `Terkirim`).
- **Bilah Aksi Massal (Bulk Action Toolbar)**: Filter 4 status tamu (Semua, Belum Dikirim, Sudah Terkirim, Belum Ada WA), tombol kirim massal terpilih, tandai status massal, salin tautan massal, ekspor data terpilih, dan hapus data terpilih.

---

## Panduan Penggunaan Dashboard

### Mengubah Konten dan Tampilan Acara
1. Akses halaman login admin di `/admin/login`, lalu masukkan username dan password.
2. Pilih tab **Pengaturan Acara** untuk memperbarui data mempelai, tanggal pernikahan, waktu akad/resepsi, lokasi acara, link Google Maps, daftar rekening, dan gambar QRIS.
3. Untuk menyembunyikan atau menampilkan seksi tertentu di halaman publik:
   - **Tampilkan Seksi Galeri Foto**: Geser toggle untuk mengaktifkan atau menonaktifkan seksi galeri foto dan menu navigasinya.
   - **Tampilkan Seksi Alur Perjalanan**: Geser toggle untuk mengaktifkan atau menonaktifkan seksi kisah cinta dan menu navigasinya.
4. Klik tombol **Simpan Perubahan** untuk menyimpan data ke database.

### Mengelola Daftar Tamu dan Impor Berkas
1. Buka tab **Kelola Tamu**.
2. **Tambah Perorangan**: Masukkan Nama Tamu, Nomor WhatsApp, dan Kategori pada form manual, lalu klik **+ Simpan ke Daftar** atau **Simpan & Langsung Kirim WA**.
3. **Tambah Massal (Teks)**: Klik tombol **+ Tambah Massal (Teks)**, tempel daftar nama dan nomor telepon (format: `Nama | Nomor WA` atau nama saja per baris), lalu klik tombol simpan.
4. **Impor Spreadsheet**:
   - Unduh format resmi melalui tombol **Unduh Template (.xlsx)** atau **Unduh Template (.csv)**.
   - Isi berkas dengan struktur kolom utama: `Nama_Tamu`, `Nomor_WhatsApp`, dan `Kategori`. Kolom nomor telepon dapat dikosongkan jika tamu belum memiliki WhatsApp.
   - Klik tombol **Unggah Berkas (Excel / CSV)**.
   - Tinjau data pada modal verifikasi pra-simpan. Baris bertanda **Tamu Baru** akan didaftarkan, sedangkan baris bertanda **Perbarui Data** akan memperbarui kontak tamu eksisting tanpa mengubah link undangan.
   - Klik **Simpan Tamu Valid ke Database**.

### Mengirim Undangan via WhatsApp Massal
1. Sesuaikan kalimat pengantar pada bagian **Template Pengantar Undangan WhatsApp**. Anda dapat menyisipkan variabel `{nama}`, `{link}`, `{mempelai}`, `{tanggal_acara}`, dan `{lokasi_acara}`. Klik **Simpan Perubahan Template**.
2. **Kirim Seluruh Tamu Belum Terkirim**: Klik tombol **Kirim Massal Belum Terkirim**.
3. **Kirim Tamu Pilihan**: Centang kotak di samping nama tamu yang ingin dikirimi pesan, lalu klik tombol **Kirim WA Massal** pada bilah aksi mengambang (*Bulk Toolbar*). Tamu tanpa nomor WhatsApp akan otomatis dilewati dari antrean.
4. Pada modal antrean pengiriman, klik tombol **Kirim Sekarang & Lanjut** (atau tekan tombol `Enter` pada keyboard). Peramban akan membuka tab WhatsApp Web dengan nomor tujuan dan pesan yang sudah terisi.
5. Setelah pesan terkirim di WhatsApp Web, kembali ke halaman dashboard. Sistem menerapkan jeda aman selama 2 detik sebelum tombol kirim berikutnya aktif. Status pengiriman tamu otomatis diperbarui menjadi "Terkirim" beserta catatan waktu pengirimannya.

### Format Tautan Undangan Tamu
- **Format Token Aman**: `https://domain.com/?kpd=K9mP4x`
- **Format Nama Terbuka**: `https://domain.com/?kpd=Bpk.+H.+Ahmad+Fauzi`
- **Format Tanpa Parameter**: `https://domain.com/` (otomatis menampilkan sapaan "Tamu Undangan")
- **Kompatibilitas Parameter Lama**: `https://domain.com/?to=Nama+Tamu` tetap didukung secara penuh.

---

## Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| Framework | Next.js 15 (App Router) | Server Components, Route Handlers, dan Optimasi Gambar |
| Bahasa | TypeScript 5.7 | Pengetikan statis ketat (*Strict Mode*) |
| Library UI | React 19 | Komponen antarmuka modern |
| Styling | Tailwind CSS v4 | CSS-first configuration via `@theme` dengan token OKLCH |
| Database | Neon Serverless PostgreSQL | Database PostgreSQL serverless berbasis cloud |
| ORM | Drizzle ORM | Pemetaan relasi data dengan skema bertipe aman |
| Keamanan | AES-256-GCM & HMAC-SHA256 | Kriptografi server-side dan blind indexing data tamu |
| Komponen UI | Sonner & NumberFlow | Notifikasi toast dan animasi angka hitung mundur |
| Spreadsheet | SheetJS (XLSX) | Pemrosesan berkas Excel (.xlsx) dan CSV (.csv) |

---

## Struktur Direktori

```text
UndanganDigital/
├── src/
│   ├── app/
│   │   ├── actions/               # Server Actions untuk enkripsi token tamu
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx # Halaman Dashboard Admin
│   │   │   └── login/page.tsx     # Halaman login otentikasi admin
│   │   ├── api/
│   │   │   ├── admin/             # Route handlers admin (Auth, Guests, Media, Settings)
│   │   │   └── rsvp/route.ts      # Route handler penerimaan konfirmasi kehadiran
│   │   ├── globals.css            # Desain token Tailwind v4 dan aturan animasi
│   │   ├── layout.tsx             # Root layout dan pemuatan Google Fonts
│   │   ├── page.tsx               # Halaman utama undangan publik (8 seksi)
│   │   ├── robots.ts              # Konfigurasi robots.txt untuk keamanan privasi
│   │   └── sitemap.ts             # Konfigurasi sitemap.xml publik
│   ├── components/
│   │   ├── admin/                 # Komponen modular Dashboard Admin
│   │   └── invitation/            # Komponen modular 8 seksi undangan publik
│   ├── db/
│   │   └── schema.ts              # Ekspor skema database Drizzle
│   ├── lib/
│   │   ├── auth.ts                # Logika otentikasi dan sesi berbasis cookie
│   │   ├── crypto.ts              # Enkripsi data sensitif (AES-256-GCM)
│   │   ├── guest-crypto.ts        # Kriptografi pembuatan token kode tamu unik
│   │   ├── guestTemplate.ts       # Generator template dan ekspor Excel/CSV
│   │   ├── guestValidator.ts      # Validasi baris impor spreadsheet
│   │   ├── phoneUtils.ts          # Normalisasi format nomor telepon WhatsApp
│   │   └── db/
│   │       ├── index.ts           # Koneksi database Neon via Drizzle
│   │       ├── schema.ts          # Skema 6 tabel PostgreSQL
│   │       └── store.ts           # Data access layer aplikasi
│   └── middleware.ts              # Proteksi rute admin dan security headers
├── public/
│   ├── audio/                     # Berkas musik latar (.mp3)
│   └── images/                    # Aset grafis, foto, dan ornamen SVG
├── drizzle.config.ts              # Konfigurasi Drizzle Kit
├── next.config.ts                 # Konfigurasi Next.js
├── package.json                   # Dependensi proyek dan skrip npm
├── prd.md                         # Dokumen spesifikasi kebutuhan produk
├── README.md                      # Dokumentasi panduan proyek
└── tsconfig.json                  # Konfigurasi TypeScript
```

---

## Panduan Instalasi dan Pengembangan Lokal

### Prasyarat Sistem
- **Node.js**: Versi 18.18.0 atau versi 20+ yang lebih baru.
- **npm**: Bawaan dari instalasi Node.js.
- **PostgreSQL Database**: Disarankan menggunakan [Neon Serverless PostgreSQL](https://neon.tech) dengan mode SSL diaktifkan.

### Langkah-Langkah Instalasi

1. **Klon Repositori**:
   ```bash
   git clone https://github.com/Smurffahh/UndanganDigital.git
   cd UndanganDigital
   ```

2. **Pasang Dependensi Proyek**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**:
   Salin berkas contoh konfigurasi:
   ```bash
   cp .env.example .env
   ```
   Buka berkas `.env` dan lengkapi nilai variabel berikut:

   | Variabel | Fungsi | Contoh Nilai |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | URL koneksi PostgreSQL ber-pooler | `postgresql://user:pass@ep-sample-pooler.neon.tech/neondb?sslmode=require` |
   | `DATABASE_URL_UNPOOLED` | URL koneksi PostgreSQL langsung | `postgresql://user:pass@ep-sample.neon.tech/neondb?sslmode=require` |
   | `ENCRYPTION_KEY` | Kunci enkripsi AES-256-GCM data sensitif | String rahasia minimal 32 karakter |
   | `BLIND_INDEX_SECRET` | Kunci salt HMAC-SHA256 untuk blind index | String rahasia salt acak |
   | `INVITATION_SECRET_KEY` | Kunci 32-byte (64 karakter hex) untuk link tamu | `e4f9b2d88c0147983ea1c5d90396489a...` (64 hex) |
   | `INVITATION_ADMIN_PIN` | PIN rahasia pengelola link tamu | `20270103` |
   | `ADMIN_USERNAME` | Username login Dashboard Admin | `admin` |
   | `ADMIN_PASSWORD` | Password login Dashboard Admin | `password_rahasia_admin` |
   | `SESSION_SECRET` | Kunci rahasia token sesi admin | String rahasia sesi acak |
   | `NODE_ENV` | Mode lingkungan kerja | `development` atau `production` |

4. **Sinkronisasi Skema Database**:
   Jalankan perintah Drizzle Kit untuk menyinkronkan seluruh tabel ke database PostgreSQL:
   ```bash
   npx drizzle-kit push
   ```

5. **Jalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```

6. **Buka Aplikasi di Peramban**:
   - Halaman Undangan Publik: `http://localhost:3000/?kpd=Bpk.+H.+Ahmad+Fauzi`
   - Halaman Dashboard Admin: `http://localhost:3000/admin/dashboard` (Gunakan kredensial yang disetel pada `.env`)

---

## Daftar Perintah

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal (*hot-reload*) |
| `npm run build` | Mengompilasi aplikasi untuk lingkungan produksi (*Next.js production build*) |
| `npm run start` | Menjalankan server hasil build produksi |
| `npm run lint` | Menjalankan audit kode menggunakan ESLint |
| `npx drizzle-kit push` | Menerapkan perubahan skema Drizzle ORM langsung ke database PostgreSQL |
| `npx drizzle-kit studio` | Membuka antarmuka visual Drizzle Studio di peramban untuk inspeksi data |

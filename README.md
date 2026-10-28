<div align="center">

# 💍 Fauzan & Sinta
### Next-Gen Digital Wedding Platform & Back-Office
**Minggu, 3 Januari 2027 • Pekanbaru, Riau**

<p align="center">
  Platform undangan pernikahan interaktif modern bernuansa <strong>Dusty Rose &amp; Antique Gold</strong>. Dirancang dengan sentuhan ornamen budaya Nusantara, ditenagai arsitektur modern Next.js 15, Tailwind CSS v4, Neon Serverless PostgreSQL, dan proteksi privasi AES-256-GCM.
</p>

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Neon Postgres](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-v0.39-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Security](https://img.shields.io/badge/Encryption-AES--256--GCM-FF3366?style=for-the-badge&logo=shield&logoColor=white)](https://csrc.nist.gov/publications/detail/sp/800-38d/final)

---

</div>

## ✨ Kenapa Proyek Ini Beda?

| Fitur Unggulan | Deskripsi Pengalaman |
| :--- | :--- |
| 🌸 **Cultural Meets Modern UI** | Harmonisasi motif tradisi Nusantara (Batik Kawung, Pita Songket Minang, Gunungan Wayang Jawa, dan Mihrab Arch) yang dipadukan dengan *Staggered Blur Reveal* saat membuka amplop dan *Floating Glass Pill Navigation* yang adaptif di berbagai resolusi layar. |
| ⏳ **Live NumberFlow Countdown & Smart Vinyl Audio** | Hitung mundur waktu nyata menuju **Minggu, 3 Januari 2027 pukul 08.00 WIB** menggunakan transisi digit mulus `<NumberFlow />` dengan font `tabular-nums`. Dilengkapi pemutar piringan hitam vinyl audio interaktif dengan *autoplay volume fade-in*, kontrol putar-jeda, dan auto-pause saat berganti tab. |
| 💳 **ATM-Style Digital Envelope + QRIS Modal** | Kartu amplop digital yang dirancang menyerupai kartu ATM debit beraksen emas dengan chip metalik SVG, tombol salin rekening interaktif dengan transisi ikon `Copy -> Check`, serta modal kode QRIS layar penuh yang siap diunduh oleh para tamu. |
| 📲 **Anti-Ban WhatsApp Dispatcher + CSV Validator** | Panel pengirim undangan WhatsApp terintegrasi di Dashboard. Mampu mengimpor ratusan kontak dari Excel/CSV, otomatis mengoreksi nomor ponsel (`08xx` / `8xx` -> `628xx`), validasi anti-duplikasi sebelum masuk basis data, dan mode kirim 1-per-1 resmi untuk menghindari risiko pemblokiran WhatsApp. |
| 🔐 **Zero-Plaintext Database Privacy** | Menjaga kerahasiaan data pribadi kedua mempelai dan para tamu undangan. Nama tamu, nomor WhatsApp, pesan ucapan doa, serta nomor rekening dienkripsi secara penuh di sisi server menggunakan **AES-256-GCM** dan **HMAC-SHA256 Blind Index** pada Neon Serverless PostgreSQL. |

---

## 🧠 Arsitektur Sistem

```mermaid
flowchart TD
    subgraph ClientLayer ["Frontend Client Layer"]
        GuestView["Tamu Undangan (/)\n• Cover Gate & Staggered Reveal\n• Countdown & Live Audio\n• RSVP & Buku Tamu\n• Amplop Digital ATM & QRIS"]
        AdminView["Dashboard Mempelai (/admin/dashboard)\n• Ringkasan KPI Kehadiran\n• Foto Utama & Galeri\n• Import Excel & WhatsApp Dispatcher\n• Pengaturan Acara & Musik"]
    end

    subgraph SecurityLayer ["Security & Session Boundary"]
        AuthMiddleware["Next.js Middleware\n• OWASP Security Headers\n• HTTP-Only Cookie Session Guard\n• Route Protection"]
        CryptoEngine["Crypto Engine (AES-256-GCM)\n• Authenticated Field Encryption\n• HMAC-SHA256 Blind Indexing\n• Anti-Timing Attack Comparator"]
    end

    subgraph BackendLayer ["Backend API & Serverless DB"]
        RouteHandlers["Next.js Route Handlers\n• /api/rsvp (Buku Tamu)\n• /api/admin/guests (Manajemen Tamu)\n• /api/admin/media (Galeri)\n• /api/admin/resolve-maps (Peta GPS)"]
        DrizzleNeon["Drizzle ORM + Neon PostgreSQL\n• wedding_settings (Enkripsi Akun)\n• gallery_photos (Urutan Galeri)\n• guests (Tamu + Blind Index)\n• rsvp_wishes (Ucapan + Moderasi)"]
    end

    GuestView -->|Kirim RSVP / Buka Link| AuthMiddleware
    AdminView -->|Akses Dashboard / Mutasi| AuthMiddleware
    AuthMiddleware --> RouteHandlers
    RouteHandlers <--> CryptoEngine
    CryptoEngine <--> DrizzleNeon
```

---

## ⚡ Quick Start (Jalankan di Komputer Lokal)

Hanya butuh 3 langkah untuk menjalankan proyek ini di lingkungan lokal Anda:

### 1. Klon Repositori
```bash
git clone https://github.com/Smurffahh/UndanganDigital.git
cd UndanganDigital
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment & Jalankan Server
Salin berkas contoh konfigurasi:
```bash
cp .env.example .env
```
Isi variabel koneksi Neon Postgres pada `.env`:
```env
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:PASSWORD@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
ENCRYPTION_KEY="fauzan-sinta-wedding-secure-encryption-key-2027-secret"
BLIND_INDEX_SECRET="wedding-blind-index-salt-secret-fauzan-sinta"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="fauzan-sinta-2027"
```

Jalankan server pengembangan:
```bash
npm run dev
```

Buka peramban di:
- **Halaman Tamu Publik:** [http://localhost:3000/?to=Nama+Tamu](http://localhost:3000/?to=Nama+Tamu)
- **Dashboard Mempelai:** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) (Login: `admin` / `fauzan-sinta-2027`)

---

## 📂 Struktur Direktori Bersih

```text
UndanganDigital/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx    # Dashboard Mempelai 4 modul
│   │   │   └── login/page.tsx        # Gerbang login admin
│   │   ├── api/
│   │   │   ├── admin/                # Endpoint admin (Auth, Guests, Media, Maps, Settings)
│   │   │   └── rsvp/route.ts         # Endpoint konfirmasi kehadiran publik
│   │   ├── globals.css               # Tailwind CSS v4 @theme OKLCH Tokens
│   │   ├── layout.tsx                # Font loader (Cinzel, Playfair, Plus Jakarta, Arabic)
│   │   └── page.tsx                  # Orkestrasi 8 seksi undangan publik
│   ├── components/
│   │   ├── admin/                    # Komponen modular Dashboard Mempelai
│   │   └── invitation/               # Komponen modular 8 seksi undangan
│   └── lib/
│       ├── auth-constants.ts         # Konstanta sesi Edge Runtime
│       ├── auth.ts                   # Autentikasi sesi & hash timing-safe
│       ├── crypto.ts                 # Enkripsi AES-256-GCM & Blind Index HMAC-SHA256
│       ├── guestTemplate.ts          # Generator file contoh .xlsx & .csv
│       ├── guestValidator.ts         # Normalisasi nomor telepon & anti-duplikasi
│       └── db/
│           ├── index.ts              # Inisialisasi Drizzle ORM & Neon HTTP/Pool
│           ├── schema.ts             # Definisi 4 tabel & indeks PostgreSQL
│           ├── seed-data.ts          # Data bawaan pernikahan Fauzan & Sinta
│           ├── seed.ts               # Skrip auto-seed database Neon
│           └── store.ts              # Data access layer dengan enkripsi otomatis
├── public/                           # Aset statis & favicon SVG
├── drizzle.config.ts                 # Konfigurasi migrasi Drizzle Kit
├── next.config.ts                    # Konfigurasi Next.js 15
├── package.json                      # Daftar dependensi & skrip eksekusi
├── prd.md                            # Dokumen spesifikasi kebutuhan produk
├── README.md                         # Dokumentasi panduan proyek
└── tsconfig.json                     # Konfigurasi TypeScript ketat
```

---

## 🛠️ Perintah Berguna

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server lokal pengembangan (*hot reload*) |
| `npm run build` | Melakukan kompilasi produksi Next.js 15 teroptimasi |
| `npm start` | Menjalankan server aplikasi siap produksi |
| `npx drizzle-kit push` | Menyinkronkan skema tabel Drizzle ke Neon Postgres |
| `npx tsc --noEmit` | Memeriksa seluruh tipe TypeScript tanpa mengeluarkan file |

---

<div align="center">

Dibuat dengan dedikasi penuh untuk **Fauzan &amp; Sinta** • Dirancang untuk keanggunan abadi.

</div>

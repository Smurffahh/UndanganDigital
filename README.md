<div align="center">

# 💍 The Wedding of Dian & Iqbal
### Platform Undangan Pernikahan Digital Interaktif & Dashboard Mempelai
**Ahad, 10 Januari 2027 • Pekanbaru, Riau**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL / Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![OWASP Top 10](https://img.shields.io/badge/Security-OWASP_Top_10-E03C31?style=for-the-badge&logo=owasp&logoColor=white)](https://owasp.org/)
[![Playwright QA](https://img.shields.io/badge/QA_Tests-100%25_Passed-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

<p align="center">
  Aplikasi undangan pernikahan modern Full-Stack berbasis <strong>Next.js 15 (App Router)</strong>, <strong>Tailwind CSS v4</strong>, dan <strong>Neon Serverless PostgreSQL</strong> dengan sentuhan kemewahan budaya Nusantara (Batik Kawung, Pita Songket Minang, Gunungan Wayang, & Mihrab Kubah Islami), dilengkapi <strong>Dashboard Mempelai Terintegrasi</strong> untuk pengiriman WhatsApp massal, import kontak Excel, manajemen foto, moderasi buku tamu RSVP, dan amplop digital bergaya kartu ATM.
</p>

[🌐 Halaman Publik](#-fitur-halaman-undangan-publik) • [🔐 Dashboard Mempelai](#-fitur-dashboard-mempelai-admin) • [🛠️ Panduan Instalasi](#-panduan-instalasi-lokal) • [🚀 Deploy ke Vercel](#-panduan-deployment-ke-vercel)

---

</div>

## 📑 Daftar Isi
- [✨ Fitur Utama](#-fitur-utama)
  - [1. Halaman Undangan Publik](#1-halaman-undangan-publik)
  - [2. Dashboard Mempelai (`/admin/dashboard`)](#2-dashboard-mempelai-admindashboard)
- [🎨 DNA Desain & Palet Warna](#-dna-desain--palet-warna)
- [🏗️ Arsitektur & Teknologi Modern](#️-arsitektur--teknologi-modern)
- [📦 Struktur Proyek](#-struktur-proyek)
- [🚀 Panduan Instalasi Lokal](#-panduan-instalasi-lokal)
- [🔑 Kredensial Admin Default](#-kredensial-admin-default)
- [🧪 Pengujian Kualitas & QA Playwright](#-pengujian-kualitas--qa-playwright)
- [☁️ Panduan Deployment ke Vercel](#️-panduan-deployment-ke-vercel)
- [🛡️ Standar Keamanan OWASP](#️-standar-keamanan-owasp)
- [📜 Lisensi & Kredit](#-lisensi--kredit)

---

## ✨ Fitur Utama

### 1. Halaman Undangan Publik

1. **Cover Gate & Staggered Reveal (`01-cover`):**
   - Menampilkan sapaan nama tamu dinamis dari parameter URL (contoh: `/?to=Bpk.+Hadi+Pratama`).
   - Efek *Ken Burns slow zoom* pada foto utama dengan kartu kaca *glassmorphism*.
   - Saat tombol *"Buka Undangan"* ditekan, sampul terangkat anggun (`cubic-bezier(0.65, 0, 0.35, 1)`) disertai efek *staggered blur reveal* pada elemen hero pembuka.
2. **Hitung Mundur Islami (`02-hitung-mundur`):**
   - Kaligrafi Arab Bismillah & QS. Ar-Rum: 21 dalam bingkai Mihrab Islami lengkung kubah.
   - 4 kotak hitung mundur waktu nyata (*Hari, Jam, Menit, Detik*) menuju 10 Januari 2027 menggunakan animasi `<NumberFlow />` dan font `tabular-nums`.
3. **Profil Mempelai Nusantara (`03-mempelai`):**
   - Kartu profil mempelai wanita (Dian) & pria (Iqbal) dengan ornamen Gunungan Wayang Jawa emas dan sudut siku kartu tradisional.
4. **Detail Acara & Integrasi Peta (`04-acara`):**
   - Waktu pelaksanaan Akad Nikah & Resepsi Pernikahan.
   - Peta interaktif Google Maps embed, tombol navigasi langsung, serta tombol **"Tambah ke Google Calendar"** dan **"Unduh File (.ics)"**.
5. **Galeri Momen Pre-Wedding (`05-galeri`):**
   - Tata letak *masonry grid* mewah dengan efek hover lembut.
   - *Accessible Lightbox* layar penuh dengan navigasi keyboard (`Escape`, `ArrowLeft`, `ArrowRight`) dan touch gesture.
6. **Buku Tamu & RSVP Real-Time (`06-rsvp`):**
   - Form konfirmasi kehadiran (*Hadir*, *Berhalangan*, *Masih Ragu*) beserta jumlah tamu dan doa restu.
   - Filter pill status kehadiran real-time beserta hitungan jumlah ucapan.
   - Fitur pencarian instan (*live search*) ucapan doa restu tamu.
7. **Amplop Digital Bergaya Kartu ATM Debit (`07-amplop`):**
   - Desain kartu bank (BCA, Mandiri) beraksen emas premium lengkap dengan ilustrasi chip metalik SVG dan nomor rekening `tabular-nums`.
   - Tombol *"Salin Nomor Rekening"* dengan transisi ikon `Copy -> Check` dan notifikasi toast `Sonner`.
   - Tombol *"Tampilkan Kode QRIS"* yang membuka modal QRIS interaktif siap unduh.
   - Kartu alamat kirim kado fisik untuk tamu yang ingin mengirimkan bingkisan.
8. **Floating Glass Pill Dock & Vinyl Music Controller (`08-penutup`):**
   - Navigasi melayang 5 tab dengan deteksi seksi aktif via `IntersectionObserver`.
   - Kontrol pemutar piringan hitam vinyl audio YouTube (*Mahalini x Nuca — Janji Kita*) dengan animasi putar halus.
   - Animasi kelopak bunga berjatuhan (*canvas petals*) yang otomatis jeda saat tab browser tidak aktif dan mematuhi `prefers-reduced-motion`.

---

### 2. Dashboard Mempelai (`/admin/dashboard`)

Halaman khusus pengantin dan keluarga untuk mengelola seluruh aspek pernikahan:

| Modul | Kemampuan & Fungsi |
| :--- | :--- |
| **Modul A: Ringkasan & Moderasi RSVP** | 5 Kartu KPI metrik waktu nyata dengan `<NumberFlow />` (*Total Diundang*, *Terkirim WA*, *Konfirmasi Hadir & Total Orang*, *Berhalangan/Ragu*, *Total Ucapan*), pencarian, filter, dan moderasi hapus ucapan spam. |
| **Modul B: Pengaturan Foto Utama & Galeri** | Atur 5 foto kunci (*Cover Gate*, *Hero Mihrab*, *Foto Dian*, *Foto Iqbal*, *QRIS*) dengan kompresi otomatis WebP di browser/server. Tambah, susun urutan, dan hapus foto galeri pre-wedding. |
| **Modul C: Tamu & WhatsApp Dispatcher** | **Editor Template WhatsApp** dengan variabel `{nama_tamu}` & `{link_undangan}` + pratinjau live. Normalisasi nomor otomatis ke `+628...`. **Tombol 1-Klik Kirim WA** yang membuka chat WhatsApp dan menandai status tamu menjadi *Terkirim*. **Import Tamu Massal dari Excel (`.xlsx`/`.csv`)** dan tombol unduh template Excel resmi. |
| **Modul D: Pengaturan Acara & Rekening** | Pengaturan nama/bio mempelai, jadwal acara ISO 8601, nama venue, koordinat Plus Code, URL navigasi maps, YouTube Audio ID, daftar dinamis rekening bank & e-wallet, serta alamat kado fisik. |

---

## 🎨 DNA Desain & Palet Warna

Sistem desain mengadopsi standar **Tailwind CSS v4** dengan token warna **OKLCH** untuk akurasi saturasi dan kehangatan visual:

```css
@theme {
  --color-cream:         oklch(97.8% 0.012 55);  /* Latar belakang krem gading hangat */
  --color-rose-100:      oklch(93.5% 0.024 35);  /* Dusty rose pastel */
  --color-rose-700:      oklch(53.1% 0.085 15);  /* Dusty rose aksen utama */
  --color-rose-900:      oklch(38.2% 0.065 10);  /* Merah marun teks judul */
  --color-gold-300:      oklch(86.8% 0.075 85);  /* Emas muda berkilau */
  --color-gold-500:      oklch(71.5% 0.125 78);  /* Emas klasik pembatas & ornamen */
  --color-gold-600:      oklch(59.8% 0.115 75);  /* Emas tembaga tombol & chip ATM */
}
```

### Tipografi Budaya & Klasik
- **Judul Utama & Romantisme:** `Cormorant Garamond` (Serif elegan) & `Great Vibes` (Kaligrafi sambung).
- **Teks Fungsional & Dashboard:** `Plus Jakarta Sans` (Sans-serif modern, bersih, & mudah dibaca).
- **Ayat & Bismillah:** `Amiri` (Kaligrafi Naskhi Arab yang syahdu).

---

## 🏗️ Arsitektur & Teknologi Modern

```
┌──────────────────────────────────────────────────────────────────┐
│                        Next.js 15 (App Router)                   │
├───────────────────────────────┬──────────────────────────────────┤
│    Frontend Publik            │    Backend & API Routes          │
│    - React 19 Client Comp     │    - Edge Middleware (Auth Guard)│
│    - Tailwind CSS v4 CSS-First│    - Signed HTTP-Only Cookies    │
│    - NumberFlow & Lucide      │    - Zod Validation & Anti-XSS   │
│    - Sonner Toast System      │    - Image MIME & Size Inspector │
├───────────────────────────────┴──────────────────────────────────┤
│                  Penyimpanan Data Dua Mode                       │
│    1. Cloud: Neon Serverless PostgreSQL via Drizzle ORM          │
│    2. Lokal: File JSON Persistence (/data/wedding-db.json)       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📦 Struktur Proyek

```text
UndanganDigital/
├── .env.example                       # Contoh environment variables
├── .gitignore                         # Isolasi kredensial, build, & node_modules
├── next.config.ts                     # Konfigurasi Next.js 15
├── package.json                       # Dependencies proyek
├── prd.md                             # Product Requirements Document resmi
├── public/                            # Favicon & aset publik statis
├── data/
│   └── wedding-db.json                # Database lokal offline
├── _legacy/                           # Arsip file asli HTML/CSS/JS lama
├── src/
│   ├── middleware.ts                  # Edge Auth Guard & OWASP Headers
│   ├── app/
│   │   ├── globals.css                # Tailwind CSS v4 @theme & ornamen
│   │   ├── layout.tsx                 # Root layout & Google Fonts
│   │   ├── page.tsx                   # Halaman undangan publik utama
│   │   ├── admin/
│   │   │   ├── login/page.tsx         # Halaman login admin 8-state
│   │   │   └── dashboard/page.tsx     # Dashboard mempelai terproteksi
│   │   └── api/
│   │       ├── rsvp/route.ts          # Endpoint RSVP publik (Zod sanitasi)
│   │       └── admin/                 # Endpoint terproteksi admin
│   │           ├── auth/route.ts      # Login & logout admin
│   │           ├── guests/route.ts    # CRUD tamu undangan & WhatsApp
│   │           ├── guests/import/     # Parser impor file Excel massal
│   │           ├── media/route.ts     # Manajemen foto & validasi berkas
│   │           ├── settings/route.ts  # Sinkronisasi acara & rekening
│   │           └── wishes/route.ts    # Moderasi ucapan & buku tamu
│   ├── components/
│   │   ├── invitation/                # Komponen modular 8 seksi undangan
│   │   └── admin/                     # Komponen modul dashboard admin
│   └── lib/
│       ├── auth.ts                    # Logika verifikasi sesi & cookie
│       ├── utils.ts                   # Helper cn() tailwind-merge
│       └── db/
│           ├── schema.ts              # Skema tabel Drizzle ORM
│           ├── seed-data.ts           # Data awal asli Dian & Iqbal
│           └── store.ts               # Storage adapter (Neon DB / JSON fallback)
├── test_invitation.py                 # E2E test Playwright halaman publik
└── test_admin.py                      # E2E test Playwright dashboard admin
```

---

## 🚀 Panduan Instalasi Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/Smurffahh/UndanganDigital.git
cd UndanganDigital
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
*(Opsional: Jika tidak mengisi `DATABASE_URL`, sistem akan otomatis menggunakan database file lokal `data/wedding-db.json` sehingga Anda langsung dapat menjalankan aplikasi 100% offline tanpa perlu setup database luar).*

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di:
- **Halaman Undangan:** `http://localhost:3000/?to=Nama+Tamu`
- **Dashboard Mempelai:** `http://localhost:3000/admin/dashboard`

---

## 🔑 Kredensial Admin Default

Untuk masuk ke halaman dashboard admin (`/admin/login`):

- **Username:** `admin`
- **Password:** `dian-iqbal-2027`

*(Anda dapat mengganti kredensial ini kapan saja melalui environment variable `ADMIN_USERNAME` dan `ADMIN_PASSWORD` pada `.env.local` atau dashboard Vercel).*

---

## 🧪 Pengujian Kualitas & QA Playwright

Proyek ini dilengkapi dengan rangkaian pengujian menyeluruh berbasis **Playwright QA** (`webapp-testing`):

```bash
# 1. Jalankan pengujian halaman publik (Desktop, Mobile 375px, Mobile 320px)
python test_invitation.py

# 2. Jalankan pengujian auth guard, modul A, B, C, D dashboard admin
python test_admin.py
```

### Hasil Verifikasi:
- ✅ **Gate 34 Passed:** Zero horizontal scroll (`scrollWidth <= clientWidth`) di layar $320\text{ px}$ dan $375\text{ px}$.
- ✅ **No iOS Safari Zoom:** Seluruh input form $\ge 16\text{ px}$ (`text-base sm:text-sm`).
- ✅ **Zero `transition-all`:** 100% transisi menggunakan properti spesifik akselerasi GPU.
- ✅ **100% Tests Passed:** Alur buka undangan, lightbox, QRIS modal, salin nomor rekening, pengiriman RSVP, import Excel, dan dispatching WhatsApp terverifikasi mulus.

---

## ☁️ Panduan Deployment ke Vercel

Aplikasi ini 100% siap dideploy ke **Vercel** dengan arsitektur serverless:

1. Buka [Vercel Dashboard](https://vercel.com) dan klik **"Add New Project"**.
2. Pilih repositori **`UndanganDigital`**.
3. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL` : Connection string database Neon Postgres Anda (gunakan `sslmode=require`).
   - `ADMIN_USERNAME` : Username admin Anda.
   - `ADMIN_PASSWORD` : Password admin Anda.
   - `SESSION_SECRET` : String rahasia acak 32+ karakter untuk keamanan session cookie.
4. Klik **"Deploy"**. Web undangan pernikahan digital Anda langsung online!

---

## 🛡️ Standar Keamanan OWASP

- **Cegah Stored XSS:** Seluruh ucapan tamu dibersihkan melalui sanitasi HTML dan skema `zod.strict()` sebelum masuk ke database.
- **Edge Security Headers:** Injeksi otomatis header keamanan HTTP:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Safe Media Ingestion:** Pemeriksaan ketat MIME type (`image/jpeg`, `image/png`, `image/webp`) dan batasan muatan payload data maksimal $5\text{ MB}$.

---

## 📜 Lisensi & Kredit

- **Pasangan Berbahagia:** Dian Ayu Puspa Sari & Iqbal Pradana.
- **Teknologi:** Next.js, React, Tailwind CSS, Neon, Lucide Icons, NumberFlow, Sonner, Playwright.
- Dibuat dengan penuh cinta dan dedikasi untuk mengabadikan momen pernikahan yang tak terlupakan. 🌸💍✨

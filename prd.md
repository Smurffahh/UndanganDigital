# Product Requirements Document: Platform Undangan Pernikahan Digital Interaktif & Dashboard Mempelai (Next-Gen Refactor `undangan-dian-iqbal`)

## Product Overview

**Product Vision:** 
Mengembangkan ulang (refactor) web undangan pernikahan statis `undangan-dian-iqbal` menjadi aplikasi Full-Stack berbasis React 19 (Next.js App Router) dan Tailwind CSS v4 yang mempertahankan kehangatan visual, budaya, dan kehalusan animasi aslinya (Motif Batik Kawung, Pita Songket, Gunungan Wayang, Bintang Emas, Bingkai Mihrab Islami), diperkaya dengan 4 Fitur & Peningkatan Visual Baru (Staggered Blur Reveal, Kartu Amplop Digital Bergaya ATM & Modal QRIS, Filter & Search Buku Tamu + Import Kontak Excel di Dashboard, serta Floating Glass Pill Navigation & Piringan Musik), serta dilengkapi Dashboard Mempelai (`/admin/dashboard`) untuk mengelola foto utama/galeri secara dinamis, buku tamu & RSVP real-time berbasis database, dan pengiriman undangan WhatsApp otomatis satu klik.

**Target Users:** 
1. **Primary Persona (Mempelai & Keluarga / Admin):** Pasangan mempelai (Fauzan & Sinta) atau panitia keluarga yang mengelola foto, daftar tamu undangan, impor kontak Excel/CSV, pengiriman pesan WhatsApp personal, dan memantau rekapitulasi kehadiran (RSVP).
2. **Secondary Persona (Tamu Undangan):** Kerabat, sahabat, dan kolega yang membuka tautan undangan melalui perangkat seluler (mayoritas via WhatsApp di Android & iOS) untuk melihat detail acara, galeri foto, mengirim konfirmasi kehadiran/doa dengan fitur filter & pencarian, serta mengirim tanda kasih (amplop digital kartu ATM & QRIS).

**Business & Project Objectives:** 
- Memodernisasi kode dari Vanilla HTML/CSS/JS menjadi komponen modular React 19 + Tailwind CSS v4 (OKLCH Design Tokens & CVA) yang mudah dikustomisasi tanpa mengubah kode sumber.
- Mempertahankan 100% DNA ornamen grafis asli: Batik Kawung, Pita Tenun Songket Minang, Gunungan Wayang Jawa, Bintang 4-Sudut Emas, Bingkai Mihrab Islami `.arch`, dan Sudut Siku Kartu `26x26px`.
- Mengimplementasikan 4 Peningkatan Visual & Fitur Baru:
  1. *Staggered Blur Reveal* saat membuka sampul undangan (`better-ui`).
  2. Kartu Amplop Digital bergaya ATM/Debit Card mewah beraksen emas + chip metalik SVG + Modal interaktif Kode QRIS (`07-amplop`).
  3. Filter pill status kehadiran & pencarian doa di Buku Tamu publik (`06-rsvp`) + Import kontak tamu via file Excel (`.xlsx`) / CSV di Dashboard Mempelai (`/admin/dashboard`).
  4. Floating Glass Pill Navigation mengambang dengan safe area (`env(safe-area-inset-bottom)`) + Tombol piringan hitam musik latar berputar (`In8kDy_WU4s`) dan kanvas kelopak bunga berjatuhan yang mematuhi `prefers-reduced-motion`.
- Memangkas waktu distribusi undangan hingga 80% melalui fitur input Nama + Nomor WhatsApp serta bulk-import Excel yang langsung menghasilkan pesan pengantar otomatis dan tautan personal (`?to=Nama+Tamu`).
- Menyimpan seluruh konfirmasi kehadiran (RSVP), jumlah tamu hadir, dan ucapan doa secara permanen dan aman di Neon Postgres dengan *graceful local fallback*.
- Menjamin performa pemuatan cepat di jaringan seluler (LCP < 2.5 detik), bebas horizontal scroll pada layar 320px–768px (`overflow-x: clip`), serta bebas auto-zoom pada input iOS Safari (`text-base sm:text-sm`).

**Success Metrics:** 
- **RSVP Conversion Rate:** >= 70% tamu yang membuka undangan mengirimkan konfirmasi kehadiran atau ucapan doa.
- **WhatsApp Dispatch Efficiency:** Waktu rata-rata pengiriman undangan per tamu dari dashboard < 5 detik (1 klik langsung membuka aplikasi WhatsApp dengan nomor tujuan dan teks pengantar terisi).
- **Mobile Performance & UX Floor:** Skor Lighthouse Performance & Accessibility >= 95; 0 kasus layar bergeser horizontal (Gate 34 `hallmark`) pada viewport 320px/375px.

---

## User Personas

### Persona 1: Mempelai / Pengelola Acara (Admin)
- **Demographics:** Usia 23–35 tahun, mengakses dashboard melalui laptop maupun smartphone, menginginkan alur kerja praktis tanpa perlu mengedit file HTML/koding.
- **Goals:** Mengganti foto sampul utama (`foto utama`) dan foto-foto `galeri` kapan saja, mengimpor daftar kontak tamu dari Excel/CSV, mengirim undangan ke WhatsApp dengan kalimat pengantar yang sopan dalam satu klik, dan melihat total tamu yang akan hadir.
- **Pain Points:** Pada versi lama, mengganti foto harus mengubah file di folder koding, mengetik pesan WhatsApp satu per satu sangat melelahkan, dan data RSVP tidak tersimpan terpusat.
- **User Journey:** Login ke `/admin/login` -> Masuk ke `/admin/dashboard` -> Unggah/atur Foto Utama & Galeri -> Import Excel / Input Nama & Nomor WA Tamu -> Klik tombol **"Kirim ke WhatsApp"** -> Memantau rekap kehadiran dan ucapan tamu secara langsung.

### Persona 2: Tamu Undangan (Mobile-First Reader)
- **Demographics:** Usia 18–65 tahun, 92% membuka tautan langsung dari ruang chat WhatsApp menggunakan browser mobile (Chrome Android / Safari iOS).
- **Goals:** Melihat sapaan nama dirinya di sampul undangan, membuka sampul dengan efek sinematik, mengetahui waktu & peta lokasi Akad/Resepsi, melihat galeri foto mempelai, mengisi konfirmasi kehadiran & doa restu serta mencari doa kerabat lain, serta menyalin nomor rekening kartu ATM atau memindai QRIS.
- **Pain Points:** Halaman undangan berat saat memuat banyak foto, musik latar tidak bisa dimatikan, layar iPhone tiba-tiba membesar (auto-zoom) saat mengetik ucapan, dan nomor rekening sulit disalin.
- **User Journey:** Klik link dari WhatsApp (`?to=Nama+Tamu`) -> Melihat `01-cover` dengan namanya -> Klik **"Buka Undangan"** (sampul terangkat, musik berputar lembut, seksi hero muncul dengan *staggered blur reveal*) -> Membaca `02-hitung-mundur`, `03-mempelai`, `04-acara`, `05-galeri` -> Mengisi `06-rsvp` -> Menyalin rekening kartu ATM / melihat QRIS di `07-amplop` -> Membaca `08-penutup`.

---

## Feature Requirements (MoSCoW Prioritization)

| Feature | Description | Priority | Acceptance Criteria | Dependencies |
|---------|-------------|----------|---------------------|--------------|
| **1. Refactor 8 Seksi Undangan ke React & Tailwind v4 + Ornamen Budaya Asli** | Konversi utuh ke-8 seksi (`01-cover`, `02-hitung-mundur`, `03-mempelai`, `04-acara`, `05-galeri`, `06-rsvp`, `07-amplop`, `08-penutup`) ke komponen React 19 + Tailwind CSS v4 dengan mempertahankan motif Batik Kawung, Pita Songket, Gunungan Wayang, Bintang 4-sudut, dan Bingkai Mihrab `.arch`. | **Must-have** | - 8 seksi tampil utuh dan responsif (320px–1440px).<br>- Token warna menggunakan OKLCH di `@theme` `globals.css`.<br>- 4 Font Google aktif via `next/font/google`. | Next.js App Router, Tailwind CSS v4, `better-ui`, `better-layout` |
| **2. Peningkatan Visual #1: Staggered Blur Reveal saat Cover Dibuka** | Transisi pembukaan sampul `01-cover` yang mengangkat tirai sampul ke atas (`cubic-bezier(0.65, 0, 0.35, 1)`), diikuti kemunculan elemen `02-hitung-mundur` secara berurutan dengan jeda `100ms`, `opacity 0->1`, `translateY 12px->0`, dan `blur(4px)->blur(0px)`. | **Must-have** | - Animasi berjalan 60fps tanpa lag.<br>- Menghormati `prefers-reduced-motion` (langsung tampil tanpa blur). | `better-ui`, `hallmark` |
| **3. Peningkatan Visual #2: Kartu Amplop Digital Bergaya ATM + Modal QRIS (`07-amplop`)** | Rekening bank (BCA, Mandiri) dan e-wallet (DANA, GoPay) dirancang menyerupai kartu ATM/Debit premium beraksen emas (chip metalik SVG, nomor `tabular-nums`, logo bank), tombol "Salin Nomor" dengan pergantian ikon `Copy -> Check` (`scale 0.25 -> 1`, `blur 4px -> 0px`) + toast `Sonner`, serta tombol **"Lihat Kode QRIS"** yang membuka modal QRIS interaktif. | **Must-have** | - Desain kartu ATM memiliki concentric border radius dan tekstur premium.<br>- Modal QRIS dapat ditutup via tombol silang, klik latar, atau tombol `Escape`. | `better-ui`, `better-accessibility`, `Sonner` |
| **4. Peningkatan Fitur #3: Filter & Search Buku Tamu (`06-rsvp`) + Import Kontak Tamu Excel (`/admin/dashboard`)** | Di halaman publik: filter pill kehadiran (`Semua`, `Hadir`, `Berhalangan`, `Masih Ragu`) dan kotak pencarian doa real-time. Di Dashboard Mempelai: fitur unggah file Excel (`.xlsx`) / CSV untuk memasukkan ratusan kontak tamu sekaligus. | **Must-have** | - Filter dan pencarian di publik berjalan instan tanpa reload halaman.<br>- Impor Excel memvalidasi kolom Nama dan Nomor WhatsApp, menormalkan nomor ke format internasional (`628...`), dan menyimpannya ke database. | `xlsx`, `react-virtuoso`, `zod`, `postgres` |
| **5. Peningkatan Visual #4: Floating Glass Pill Navigation & Piringan Musik** | Dock melayang bawah bergaya *glassmorphism* (`Mempelai · Acara · Galeri · RSVP · Amplop`) yang mendeteksi posisi scroll aktif via `IntersectionObserver` dan menghormati `env(safe-area-inset-bottom)`. Tombol piringan hitam di kanan atas yang berputar halus saat memutar lagu Mahlini x Nuca (*Janji Kita*, YouTube ID `In8kDy_WU4s`) + kanvas kelopak bunga melayang. | **Must-have** | - Dock tidak menutupi tombol formulir di bawah layar.<br>- Piringan musik berhenti berputar saat dijeda.<br>- Kanvas kelopak bunga jeda saat tab tidak aktif (`document.hidden`). | `better-layout`, `better-accessibility` |
| **6. Dashboard Pengaturan Foto Utama & Galeri** | Modul di `/admin/dashboard` untuk mengunggah, mengganti, mengurutkan, dan menghapus **Foto Utama** (Cover & Profil Mempelai) serta **Foto Galeri** (`05-galeri`). | **Must-have** | - Mendukung unggah foto (JPG/PNG/WebP) dengan validasi tipe dan ukuran.<br>- Perubahan langsung terlihat di halaman publik.<br>- Pratinjau foto memiliki `outline-black/10` dan rasio aspek terkunci. | Neon Postgres, Storage/Base64 Optimizer, `web-security-owasp` |
| **7. Manajemen Tamu & Kirim WhatsApp Otomatis (Nama + Nomor + Template)** | Modul di `/admin/dashboard` untuk menginput Nama Tamu & Nomor WhatsApp (atau import Excel), mengedit template pengantar, dan tombol **"Kirim ke WhatsApp"** yang membuka `https://wa.me/{nomor}?text={encoded_template}` serta menandai status tamu menjadi `"Sudah Dikirim"`. | **Must-have** | - Normalisasi otomatis `08xx` -> `628xx`.<br>- Variabel template: `{nama_tamu}`, `{link_undangan}`, `{nama_mempelai}`, `{tanggal_acara}`.<br>- Status terkirim tercatat di database. | Neon Postgres (`guests` table), `Sonner`, `react-virtuoso` |
| **8. Hitung Mundur (`NumberFlow`) & Simpan Kalender (`.ics` / Google Calendar)** | *Countdown timer* (`Hari`, `Jam`, `Menit`, `Detik`) dengan animasi pergantian digit halus (`@number-flow/react`) serta tombol simpan jadwal Akad/Resepsi ke Google Calendar atau unduh file `.ics`. | **Must-have** | - Menggunakan `@number-flow/react` + `tabular-nums`.<br>- Tombol kalender kompatibel di perangkat Android dan iOS. | `@number-flow/react`, `better-typography` |

---

## Technical Specifications

### Frontend (`tailwind-design-system`, `pick-ui-library`, `better-interface`)
- **Technology Stack:** Next.js (App Router, React 19, TypeScript).
- **Styling & Design System:** Tailwind CSS v4 (`@import "tailwindcss";` & blok `@theme` dengan token warna OKLCH), `clsx` + `tailwind-merge` (`cn()`), dan `class-variance-authority` (`cva`).
- **Curated UI Libraries (`pick-ui-library`):**
  - `sonner`: Notifikasi toast saat menyalin rekening, mengirim RSVP, dan aksi dashboard.
  - `@number-flow/react`: Animasi transisi digit pada *Countdown Timer* (`02-hitung-mundur`) dan statistik dashboard.
  - `react-virtuoso`: Virtualisasi tabel daftar tamu undangan di `/admin/dashboard` untuk menangani ribuan tamu tanpa lemot.
  - `lucide-react`: Ikon konsisten dengan ketebalan garis yang selaras dengan teks sekitar (`strokeWidth={1.5}` atau `2`).
  - `xlsx`: Pemrosesan file spreadsheet Excel/CSV untuk fitur bulk import tamu.

### Backend & Database (`postgres`, `web-security-owasp`)
- **API Architecture:** Next.js Route Handlers (`/api/invitation`, `/api/rsvp`, `/api/admin/media`, `/api/admin/guests`, `/api/admin/guests/import`, `/api/admin/settings`).
- **Database Schema (Neon Serverless Postgres + Drizzle ORM):**
  1. `wedding_settings`: Data mempelai, tanggal/waktu Akad & Resepsi, alamat & Plus Code, link Google Maps, YouTube video ID, daftar rekening ATM & E-Wallet, `qris_image_url`, alamat kado fisik, dan template WhatsApp.
  2. `gallery_photos`: Koleksi 11 foto asli (`id`, `image_url`, `caption`, `aspect_ratio`, `sort_order`, `created_at`).
  3. `guests`: Daftar tamu undangan (`id`, `name`, `slug_query`, `whatsapp_number`, `category`, `wa_sent_status`, `wa_sent_at`, `created_at`).
  4. `rsvp_wishes`: Konfirmasi kehadiran & doa tamu (`id`, `guest_name`, `attendance_status` [`HADIR`/`BERHALANGAN`/`RAGU`], `pax_count`, `message`, `is_approved`, `created_at`).
- **Data Access Layer with Graceful Local Fallback (`src/lib/db/queries.ts`):** Jika `DATABASE_URL` tersedia, query langsung ke Neon Postgres; jika tidak, gunakan penyimpanan lokal berbasis memori/JSON yang otomatis terisi seed data asli agar aplikasi dapat langsung berjalan tanpa hambatan setup.

---

## Release Planning (Urutan Pengerjaan Bertahap & Rapi)

### Tahap 0: Dokumentasi PRD & Spesifikasi 4 Fitur Baru (Selesai)
- Menyelaraskan seluruh spesifikasi dan inventarisasi aset ke dalam `prd.md`.

### Fase 1: Setup Fondasi Next.js, Tailwind CSS v4, & Skema Database (v1.0-alpha)
- Mengamankan file asli ke folder `_legacy/`.
- Inisialisasi React 19 + Next.js App Router + Tailwind CSS v4 + OKLCH Tokens + 4 Font Google.
- Definisi skema Drizzle ORM, seed data bawaan, dan fallback queries.

### Fase 2: Refactor 8 Seksi Halaman Undangan Publik + 4 Fitur Visual Baru (v1.0-beta)
- Membangun komponen modular: `CoverGate` (Staggered Blur Reveal), `CountdownHero` (`NumberFlow`), `CoupleProfile` (Mihrab & Gunungan), `EventDetails` (Akad, Resepsi, Maps, Kalender), `PhotoGallery` (Lightbox aksesibel), `RsvpGuestbook` (Filter & Search ucapan), `DigitalEnvelope` (Desain Kartu ATM + Modal QRIS), `ClosingFooter` & `FloatingControls` (Glass Pill Dock & Piringan Musik).
- Verifikasi komprehensif Playwright (`webapp-testing`) pada resolusi mobile (`320px`, `375px`) dan desktop (`1280px`).

### Fase 3: Dashboard Mempelai (`/admin/dashboard`) — Pengaturan Foto, Import Excel, & Kirim WA (v1.0-rc)
- Membangun halaman Login Admin & Workspace Dashboard (Sidenav Kiri).
- Modul CRUD Foto Utama & Galeri.
- Modul Daftar Tamu: Input manual + Import Excel (`.xlsx`/`.csv`) + Tombol Kirim ke WhatsApp otomatis dengan template personal + Rekapitulasi RSVP.

### Fase 4: Audit Keamanan (`web-security-owasp`) & Audit 5 Domain (`better-interface` + `hallmark`) (v1.0-production)
- Verifikasi responsivitas `320px–1280px`, disiplin 8-state komponen, pengujian Playwright komprehensif, dan verifikasi deployment Vercel.

### Fase 5: Countdown 3 Januari 2027, Background Music Player, & Google Maps Resolver (v1.1)
- Penetapan target countdown ke **Minggu, 3 Januari 2027 pukul 08:00 WIB** (`2027-01-03T08:00:00+07:00`) dengan label tanggal tampilan `Minggu · 03 · Januari · 2027`.
- Pemutar musik latar belakang hybrid HTML5 `<audio>` dengan auto-play volume fade-in saat tombol *"Buka Undangan"* diklik, vinyl controller berputar, badge judul lagu, 4 preset lagu romantis siap pakai, custom MP3 URL, dan fallback YouTube.
- Integrasi lokasi Google Maps terbaru (`https://maps.app.goo.gl/HFXpTdshy7Vhwoxs8` / `-7.310076, 109.296186`) dan endpoint `/api/admin/resolve-maps` untuk mengurai shortlink peta secara otomatis di Dashboard Mempelai lengkap dengan live embed preview dan uji dengar musik.

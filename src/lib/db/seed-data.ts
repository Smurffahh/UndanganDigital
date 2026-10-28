export interface MusicPreset {
  id: string;
  title: string;
  artist: string;
  sourceType: "audio_url" | "youtube";
  url: string;
  youtubeId?: string;
}

export const WEDDING_MUSIC_PRESETS: MusicPreset[] = [
  {
    id: "preset-1",
    title: "Romantic Piano & Strings Wedding Instrumental",
    artist: "Wedding Studio (Instrumental)",
    sourceType: "audio_url",
    url: "/audio/romantic-piano.wav",
  },
  {
    id: "preset-2",
    title: "Mahalini x Nuca — Janji Kita",
    artist: "Mahalini x Nuca",
    sourceType: "youtube",
    url: "https://www.youtube.com/watch?v=In8kDy_WU4s",
    youtubeId: "In8kDy_WU4s",
  },
  {
    id: "preset-3",
    title: "Shane Filan — Beautiful In White (Romantic Instrumental)",
    artist: "Shane Filan (Acoustic Piano)",
    sourceType: "audio_url",
    url: "/audio/wedding-instrumental.wav",
  },
  {
    id: "preset-4",
    title: "Javanese / Acoustic Sundanese Instrumental Wedding",
    artist: "Traditional Acoustic Gamelan Strings",
    sourceType: "audio_url",
    url: "/audio/javanese-romance.wav",
  },
];

export const DEFAULT_WEDDING_SETTINGS = {
  brideName: "Sinta Maria Utami",
  brideBirth: "Pekanbaru, 10 September 2005",
  brideBio:
    "Gadis berhati hangat dan penuh kelembutan yang tumbuh bersama doa, melangkah dengan keyakinan menyambut takdir indah bersama sang belahan jiwa.",
  bridePhotoUrl:
    "https://i.pinimg.com/1200x/6e/44/49/6e444942c44381802cfd324cf65b27aa.jpg",
  groomName: "Fauzan Ma'ruf",
  groomBirth: "3 Mei 1997",
  groomBio:
    "Pria berhati tenang dan tegas yang percaya bahwa jodoh adalah ketetapan terbaik dari ikhtiar tulus yang diiringi restu kedua orang tua.",
  groomPhotoUrl:
    "https://i.pinimg.com/736x/b5/ef/95/b5ef95fd3cd9129193935dc4b50ecaa0.jpg",
  coverPhotoUrl:
    "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg",
  heroPhotoUrl:
    "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg",
  weddingDateIso: "2027-01-03T08:00:00+07:00",
  eventDateLabel: "Minggu · 03 · Januari · 2027",
  akadTime: "Pukul 08.00 – 10.00 WIB",
  resepsiTime: "Pukul 11.00 – 14.00 WIB",
  venueName: "Gedung Pertemuan & Kediaman Mempelai",
  venueAddress: "Pekanbaru, Riau",
  venuePlusCode: "Plus Code: F9M2+C8 Simpang Baru",
  googleMapsUrl: "https://maps.app.goo.gl/HFXpTdshy7Vhwoxs8",
  mapsLatitude: "-7.310076",
  mapsLongitude: "109.296186",
  googleMapsEmbed: "https://maps.google.com/maps?q=-7.310076,109.296186&z=17&output=embed",
  youtubeVideoId: "In8kDy_WU4s",
  musicEnabled: true,
  musicTitle: "Shane Filan - Beautiful In White (Romantic Instrumental)",
  musicSourceType: "preset",
  musicUrl: "/audio/wedding-instrumental.wav",
  bankAccounts: [
    {
      brand: "Bank BCA",
      type: "Transfer Bank",
      number: "1234567890",
      holder: "Sinta Maria Utami",
    },
    {
      brand: "Bank Mandiri",
      type: "Transfer Bank",
      number: "1230007890123",
      holder: "Fauzan Ma'ruf",
    },
  ],
  ewallets: [
    {
      brand: "DANA",
      type: "E-Wallet",
      number: "0812-xxxx-xxxx",
      holder: "Sinta Maria Utami",
    },
    {
      brand: "GoPay",
      type: "E-Wallet",
      number: "0812-xxxx-xxxx",
      holder: "Fauzan Ma'ruf",
    },
  ],
  giftAddress: {
    receiver: "Sinta Maria Utami",
    phone: "0812-xxxx-xxxx",
    address:
      "Jl. Contoh Alamat No. 10, Kel. Air Putih, Kec. Tuah Madani, Kota Pekanbaru, Riau 28127",
  },
  qrisImageUrl:
    "https://images.unsplash.com/photo-1595079672139-cdc4b0b44714?auto=format&fit=crop&w=600&q=80",
  waMessageTemplate: `Kepada Yth.
*{nama_tamu}*

_Assalamu’alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*Fauzan & Sinta*

Informasi lengkap mengenai waktu, lokasi acara, dan konfirmasi kehadiran dapat diakses melalui tautan undangan resmi berikut:
{link_undangan}

Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

_Wassalamu’alaikum Warahmatullahi Wabarakatuh_

Kami yang berbahagia,
*Fauzan & Sinta*
#SINgkatceritaFAUZAN`,
};

export const DEFAULT_GALLERY_PHOTOS = [
  {
    id: 1,
    imageUrl:
      "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg",
    caption: "Fauzan & Sinta berbaring di padang rumput saat senja",
    aspectRatio: "3/4",
    sortOrder: 1,
  },
  {
    id: 2,
    imageUrl:
      "https://i.pinimg.com/736x/1e/66/40/1e66403fd678e4bd02d2c728d96d01af.jpg",
    caption: "Pelaminan taman berhias kain putih dan kelopak bunga",
    aspectRatio: "3/4",
    sortOrder: 2,
  },
  {
    id: 3,
    imageUrl:
      "https://i.pinimg.com/1200x/6e/44/49/6e444942c44381802cfd324cf65b27aa.jpg",
    caption: "Sinta dengan gaun putih di tepi pantai",
    aspectRatio: "3/4",
    sortOrder: 3,
  },
  {
    id: 4,
    imageUrl:
      "https://i.pinimg.com/736x/36/4e/56/364e567b8658c94789cf9b8cb5cadcc2.jpg",
    caption: "Tart pernikahan mewah dengan rangkaian rose pink dan emas",
    aspectRatio: "1/1",
    sortOrder: 4,
  },
  {
    id: 5,
    imageUrl:
      "https://i.pinimg.com/736x/27/ff/f9/27fff9dc2d4b12d4b7335b2060067f28.jpg",
    caption: "Meja resepsi bernuansa blush dengan deretan lilin",
    aspectRatio: "4/5",
    sortOrder: 5,
  },
  {
    id: 6,
    imageUrl:
      "https://i.pinimg.com/736x/b5/ef/95/b5ef95fd3cd9129193935dc4b50ecaa0.jpg",
    caption: "Fauzan dengan setelan jas abu-abu modern",
    aspectRatio: "3/4",
    sortOrder: 6,
  },
  {
    id: 7,
    imageUrl:
      "https://i.pinimg.com/736x/a2/bd/28/a2bd28b0561574a6bfe38ad177d8531e.jpg",
    caption: "Bouquet mawar putih dan eucalyptus",
    aspectRatio: "1/1",
    sortOrder: 7,
  },
  {
    id: 8,
    imageUrl:
      "https://i.pinimg.com/736x/b8/1d/15/b81d154ee42661c94443a579698d2466.jpg",
    caption: "Cincin kawin di atas bantalan sutra berukir",
    aspectRatio: "1/1",
    sortOrder: 8,
  },
  {
    id: 9,
    imageUrl:
      "https://i.pinimg.com/736x/68/aa/a4/68aaa415ef1e88a0b5a32ec69472eec3.jpg",
    caption: "Dekorasi lorong masuk berhias lampu fairy warm white",
    aspectRatio: "3/4",
    sortOrder: 9,
  },
  {
    id: 10,
    imageUrl:
      "https://i.pinimg.com/736x/41/5b/4b/415b4ba2541f92e624b4df9d2c20697e.jpg",
    caption: "Souvenir lilin aromaterapi dalam kantong organza",
    aspectRatio: "1/1",
    sortOrder: 10,
  },
  {
    id: 11,
    imageUrl:
      "https://i.pinimg.com/736x/0b/33/57/0b3357b4a035ad1cd8882d868d0338fa.jpg",
    caption: "Lilin rose gold untuk menghangatkan suasana",
    aspectRatio: "4/5",
    sortOrder: 11,
  },
];

export const DEFAULT_RSVP_WISHES = [
  {
    id: 1,
    guestName: "Alumni SMA Negeri",
    attendanceStatus: "Hadir",
    paxCount: 2,
    message:
      "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Selamat berbahagia Fauzan dan Sinta!",
    createdAt: "2026-10-25T08:00:00.000Z",
  },
  {
    id: 2,
    guestName: "Keluarga Besar H. Ridwan",
    attendanceStatus: "Hadir",
    paxCount: 4,
    message:
      "Selamat menempuh bahtera rumah tangga yang sakinah mawaddah warahmah untuk ananda Fauzan dan ananda Sinta. Aamiin.",
    createdAt: "2026-10-26T08:00:00.000Z",
  },
  {
    id: 3,
    guestName: "Rekan Kerja Divisi IT",
    attendanceStatus: "Masih Ragu",
    paxCount: 1,
    message:
      "Selamat bro Fauzan! Lancar sampai hari H ya, semoga menjadi keluarga yang bahagia selamanya.",
    createdAt: "2026-10-27T08:00:00.000Z",
  },
];

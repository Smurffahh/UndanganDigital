export const DEFAULT_WEDDING_SETTINGS = {
  brideName: "Sinta Maharani",
  brideBirth: "Pekanbaru, 10 September 2005",
  brideBio:
    "Gadis lembut yang tumbuh bersama doa, menantikan hari penuh berkah bersama belahan jiwanya.",
  bridePhotoUrl:
    "https://i.pinimg.com/1200x/6e/44/49/6e444942c44381802cfd324cf65b27aa.jpg",
  groomName: "Fauzan Pratama",
  groomBirth: "3 Mei 1997",
  groomBio:
    "Pria berhati tenang yang percaya bahwa pernikahan adalah ikhtiar terindah untuk saling menyempurnakan.",
  groomPhotoUrl:
    "https://i.pinimg.com/736x/b5/ef/95/b5ef95fd3cd9129193935dc4b50ecaa0.jpg",
  coverPhotoUrl:
    "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg",
  heroPhotoUrl:
    "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg",
  weddingDateIso: "2027-01-10T08:00:00+07:00",
  akadTime: "Pukul 08.00 – 10.00 WIB",
  resepsiTime: "Pukul 11.00 – 14.00 WIB",
  venueName: "Kelurahan Air Putih",
  venueAddress: "Tuah Madani, Kota Pekanbaru, Riau",
  venuePlusCode: "Plus Code: F9M2+C8 Simpang Baru",
  googleMapsUrl:
    "https://www.google.com/maps/place/Kedai+Harian+Bang+Zali/@0.4835204,101.3506971,56m/data=!3m1!1e3!4m6!3m5!1s0x31d5a9d1656c3223:0xab29da710b18cf47!8m2!3d0.4835685!4d101.3507545!16s%2Fg%2F11kmnsnh90?entry=ttu",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=0.4835204,101.3506971&z=17&output=embed",
  youtubeVideoId: "In8kDy_WU4s",
  bankAccounts: [
    {
      brand: "Bank BCA",
      type: "Transfer Bank",
      number: "1234567890",
      holder: "Sinta Maharani",
    },
    {
      brand: "Bank Mandiri",
      type: "Transfer Bank",
      number: "1230007890123",
      holder: "Fauzan Pratama",
    },
  ],
  ewallets: [
    {
      brand: "DANA",
      type: "E-Wallet",
      number: "0812-xxxx-xxxx",
      holder: "Sinta Maharani",
    },
    {
      brand: "GoPay",
      type: "E-Wallet",
      number: "0812-xxxx-xxxx",
      holder: "Fauzan Pratama",
    },
  ],
  giftAddress: {
    receiver: "Sinta Maharani",
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
*Fauzan & Sinta*`,
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
    caption: "Fauzan membawa buket bunga",
    aspectRatio: "3/4",
    sortOrder: 6,
  },
  {
    id: 7,
    imageUrl:
      "https://i.pinimg.com/736x/30/9c/1f/309c1f0214ff6c5b77953039a3181020.jpg",
    caption: "Sajian meja resepsi dusty rose dan rose gold",
    aspectRatio: "3/4",
    sortOrder: 7,
  },
  {
    id: 8,
    imageUrl:
      "https://i.pinimg.com/736x/12/25/ac/1225acf966ce6ba667380e74f4047724.jpg",
    caption: "Buket bunga pink dalam vas emas",
    aspectRatio: "1/1",
    sortOrder: 8,
  },
  {
    id: 9,
    imageUrl:
      "https://i.pinimg.com/736x/1d/41/b9/1d41b9a5b75d1b2f90de0ef7d2a8eaa0.jpg",
    caption: "Kursi tamu berhias pita blush dan emas",
    aspectRatio: "3/4",
    sortOrder: 9,
  },
  {
    id: 10,
    imageUrl:
      "https://i.pinimg.com/736x/08/5b/fd/085bfdba6639cb00bfdd67f58334ce19.jpg",
    caption: "Tart pink berornamen emas beserta aneka manisan",
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
    guestName: "Keluarga Besar Mempelai Wanita",
    attendanceStatus: "Hadir",
    paxCount: 2,
    message:
      "Selamat menempuh hidup baru, Fauzan & Sinta! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: 2,
    guestName: "Sahabat Kecil Fauzan",
    attendanceStatus: "Hadir",
    paxCount: 1,
    message:
      "Akhirnya ya, Bro! Barakallahu lakuma wa baraka alaikuma. Sampai jumpa di hari bahagia!",
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: 3,
    guestName: "Alumni SMA Negeri",
    attendanceStatus: "Masih Ragu",
    paxCount: 1,
    message:
      "Semoga lancar acaranya! Kami usahakan datang, doa terbaik untuk kalian berdua.",
    createdAt: new Date(Date.now() - 86400000),
  },
];

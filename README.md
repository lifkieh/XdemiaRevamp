# Xdemia Revamp — Prototipe UI/UX

Prototipe revamp Xdemia: *social network for learning* untuk persona **Raka** (Gen Z learner Indonesia).
Fokus prototipe ini adalah **struktur informasi & alur**, bukan poles visual.

Semua data adalah **dummy lokal** (`src/mock/`). Tidak ada API atau backend.

## Cara menjalankan

```bash
npm install
npm run serve
```

Buka http://localhost:8080

Build produksi:

```bash
npm run build
```

## Stack

- Vue 2.6 (Options API)
- Element UI 2.15
- Vue Router 3 (mode `history`, semua rute lazy-loaded)
- Vuex 3
- Vue CLI 5 + Webpack 5

## Layout responsif

Satu information architecture, dua penataan. Ambang: **900px**.

| | Mobile (< 900px) | Desktop (>= 900px) |
|---|---|---|
| Navigasi | Bottom nav 5 tab | Sidebar kiri 6 item (+ Acara) |
| Kolom | Tunggal, maks 480px | 240px sidebar / 600px konten / 300px kolom kanan, maks 1200px terpusat |
| Kolom kanan | — | Widget Streak, Deadline terdekat, Acara terdekat, Kenalan yuk |
| Chat & Notifikasi | Drawer penuh | Panel mengambang |
| Search | Di halaman Jelajah | Juga di top bar |

Mode ditentukan satu getter Vuex (`layout/isDesktop`), jadi bottom nav dan sidebar tidak pernah muncul bersamaan. Di bawah 1100px kolom kanan disembunyikan supaya konten tidak sesak.

## Keputusan desain

1. **Satu sistem navigasi per ukuran layar**: bottom nav 5 tab di mobile, sidebar kiri di desktop. Tidak pernah keduanya.
2. **Ikon selalu berlabel** — tidak ada ikon telanjang, termasuk di top bar dan aksi postingan.
3. **Feed-first** — buka app langsung ketemu konten, bukan menu.
4. **Search jadi pintu utama** di tab Jelajah, dengan filter chip yang reaktif.
5. **Satu pola kartu** (`BaseCard.vue`) dipakai ulang di semua daftar.
6. **Istilah manusia**: "Materi", "Jurnal", "Tersimpan" — bukan istilah internal.
7. **Tap target minimal 44px**, mobile-first, container maksimal 480px dan terpusat di desktop.
8. **Tiga state per layar**: loading (skeleton), kosong (empty state), normal.
9. Palet teal `#17a2a2`, radius `14px`, semua lewat CSS variable di `src/assets/base.css`.

## Struktur folder

```
src/
├── assets/base.css        # CSS variable (warna, radius, spasi) + class util
├── components/
│   ├── TopBar.vue         # logo/search, tombol Chat, tombol Notif, avatar
│   ├── BottomNav.vue      # navigasi utama 5 tab (mobile)
│   ├── SideNav.vue        # navigasi kiri 6 item (desktop)
│   ├── RightRail.vue      # kolom kanan kontekstual (desktop)
│   ├── OverlayPanel.vue   # drawer di mobile, panel mengambang di desktop
│   ├── BaseCard.vue       # pola kartu tunggal (thumb + judul + subjudul + slot)
│   ├── FilterChips.vue    # chip filter reaktif (v-model)
│   ├── SearchBar.vue      # input pencarian
│   ├── EmptyState.vue     # tampilan kalau data kosong
│   ├── CardSkeleton.vue   # skeleton loading (el-skeleton)
│   ├── ChatDrawer.vue     # overlay chat: daftar percakapan + jendela chat
│   └── NotifDrawer.vue    # overlay notifikasi + tandai semua dibaca
├── views/
│   ├── Home.vue           # / — composer + feed campuran
│   ├── Explore.vue        # /explore — search + filter chip
│   ├── Learn.vue          # /learn — "Lanjutkan belajar" + "Untuk kamu"
│   ├── LearnDetail.vue    # /learn/:id — deskripsi + checklist modul
│   ├── Scholarships.vue   # /scholarships — filter + tombol Simpan
│   ├── Events.vue         # /events — acara akan datang & sudah lewat
│   ├── CommunityDetail.vue# /community/:id — Tentang, Diskusi, Anggota, File
│   └── You.vue            # /you — profil + tab konten
├── mock/                  # data dummy JSON (feed, explore, courses, dll.)
├── router/index.js
└── store/
    ├── index.js
    └── modules/
        ├── bookmarks.js   # beasiswa & materi tersimpan
        └── user.js        # profil + jumlah notifikasi belum dibaca
```

## Jenis item di feed

| Tipe | Tampil sebagai |
|---|---|
| `learning_nudge` | Kartu ajakan lanjut belajar + progress bar |
| `scholarship_alert` | Kartu pengingat deadline beasiswa |
| `post` | Postingan orang + aksi Suka / Komentar / Bagikan |
| `article` | Ringkasan tulisan + aksi Baca / Simpan |
| `community_update` | Kabar dari komunitas |

## Catatan

- **Dummy data.** Semua isi dari `src/mock/`. Loading disimulasikan 500–600 ms supaya skeleton kelihatan.
- **Upgrade-friendly ke Vue 3.** Komponen ditulis dengan Options API polos, tanpa filter, tanpa `$children`, tanpa mixin global. State global sudah dipisah per modul Vuex sehingga gampang dipindah ke Pinia. Yang perlu diganti saat migrasi: Element UI → Element Plus, dan `new Vue()` → `createApp()`.
- `postcss.config.js` sengaja ada dan kosong supaya PostCSS tidak ikut konfigurasi dari folder induk.

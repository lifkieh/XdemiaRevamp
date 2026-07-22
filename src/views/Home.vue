<template>
  <div class="screen">
    <!-- Composer ringkas: satu aksi utama di layar ini -->
    <div class="card composer">
      <div class="row">
        <div class="thumb thumb-round composer-avatar">{{ inisial }}</div>
        <button class="composer-input grow" @click="tulisPostingan">
          Apa yang kamu pelajari hari ini?
        </button>
      </div>
    </div>

    <!-- Filter kategori: chip di layar lebar, dropdown di layar sempit -->
    <div v-if="!memuat && feedAman.length > 0" class="filter-bar">
      <div v-if="pakaiChip" class="chips" role="tablist">
        <button
          v-for="k in kategori"
          :key="k.id"
          class="chip"
          :class="{ 'is-active': k.id === filterAktif }"
          role="tab"
          :aria-selected="k.id === filterAktif ? 'true' : 'false'"
          @click="filterAktif = k.id"
        >
          {{ k.label }}
          <span class="hitung">{{ jumlahPer[k.id] }}</span>
        </button>
      </div>

      <div v-else class="pilih-baris">
        <label for="filter-feed" class="pilih-label">Tampilkan</label>
        <el-select id="filter-feed" v-model="filterAktif" class="pilih">
          <el-option
            v-for="k in kategori"
            :key="k.id"
            :value="k.id"
            :label="k.label + ' (' + jumlahPer[k.id] + ')'"
          />
        </el-select>
      </div>
    </div>

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <EmptyState
      v-else-if="feedAman.length === 0"
      ikon="el-icon-chat-line-square"
      judul="Feed kamu masih kosong"
      pesan="Ikuti orang atau komunitas dulu biar ada yang muncul di sini."
    >
      <el-button type="primary" @click="$router.push('/explore')">Cari yang seru</el-button>
    </EmptyState>

    <EmptyState
      v-else-if="feedTampil.length === 0"
      ikon="el-icon-files"
      judul="Kosong dulu di sini"
      :pesan="'Belum ada ' + labelAktif.toLowerCase() + ' di berandamu.'"
    >
      <el-button type="primary" @click="filterAktif = 'semua'">Lihat semua</el-button>
    </EmptyState>

    <template v-else>
      <div v-for="item in feedTampil" :key="item.id">
        <!-- Dorongan belajar -->
        <div v-if="item.tipe === 'learning_nudge'" class="card nudge">
          <!-- Kartu lanjutkan: isinya dari riwayat lintas jenis, bukan cuma materi -->
          <template v-if="item.sumber === 'lanjutkan' && lanjutkanTeratas">
            <div class="row row-top">
              <div class="thumb nudge-thumb"><i :class="infoLanjut.ikon"></i></div>
              <div class="grow">
                <p class="title">{{ infoLanjut.judulKartu }}</p>
                <p class="lanjut-judul">{{ lanjutkanTeratas.judul }}</p>
                <div class="lanjut-meta">
                  <span class="pill">{{ infoLanjut.label }}</span>
                  <span class="muted">{{ lanjutkanTeratas.sisa }}</span>
                </div>
                <el-progress
                  :percentage="lanjutkanTeratas.progress"
                  :stroke-width="6"
                  :show-text="false"
                  class="nudge-progress"
                />
              </div>
            </div>
            <div class="card-foot">
              <el-button type="primary" size="small" @click="bukaLanjutkan(lanjutkanTeratas)">
                {{ infoLanjut.tombol }}
              </el-button>
            </div>
          </template>

          <!-- Dorongan lain (mis. pengingat streak) tetap seperti semula -->
          <template v-else>
            <div class="row row-top">
              <div class="thumb nudge-thumb"><i class="el-icon-reading"></i></div>
              <div class="grow">
                <p class="title">{{ item.judul }}</p>
                <p class="muted">{{ item.deskripsi }}</p>
                <el-progress
                  v-if="item.progress > 0"
                  :percentage="item.progress"
                  :stroke-width="6"
                  :show-text="false"
                  class="nudge-progress"
                />
              </div>
            </div>
            <div class="card-foot">
              <el-button type="primary" size="small" @click="$router.push('/learn/' + item.materiId)">
                {{ item.progress > 0 ? 'Lanjutkan' : 'Mulai belajar' }}
              </el-button>
            </div>
          </template>
        </div>

        <!-- Info beasiswa -->
        <div v-else-if="item.tipe === 'scholarship_alert'" class="card alert">
          <div class="row row-top">
            <div class="thumb alert-thumb"><i class="el-icon-medal"></i></div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.deskripsi }}</p>
            </div>
          </div>
          <div class="card-foot">
            <el-button type="primary" size="small" @click="$router.push('/scholarships')">Lihat beasiswa</el-button>
          </div>
        </div>

        <!-- Update komunitas -->
        <div
          v-else-if="item.tipe === 'community_update'"
          class="card is-clickable"
          @click="$router.push('/community/' + item.komunitasId)"
        >
          <div class="row row-top">
            <div class="thumb">{{ item.judul.charAt(0) }}</div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.deskripsi }}</p>
              <span class="pill">{{ item.anggota }}</span>
            </div>
          </div>
        </div>

        <!-- Artikel / jurnal -->
        <div
          v-else-if="item.tipe === 'article'"
          class="card is-clickable"
          @click="bukaArtikel(item)"
        >
          <div class="row row-top">
            <div class="thumb"><i class="el-icon-document"></i></div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.sumber }} · {{ item.baca }}</p>
            </div>
          </div>
          <p class="article-ringkasan">{{ item.ringkasan }}</p>
          <div class="card-foot">
            <button class="tap" @click.stop="bukaArtikel(item)">
              <i class="el-icon-reading"></i><span>Baca</span>
            </button>
            <button class="tap" @click.stop="simpanArtikel(item)">
              <i class="el-icon-collection-tag"></i><span>Simpan</span>
            </button>
          </div>
        </div>

        <!-- Postingan orang: teks dulu, media opsional, dipisah garis (bukan kartu) -->
        <article v-else class="post">
          <header class="row row-top penulis" @click="bukaProfil(item)">
            <div class="thumb thumb-round">{{ item.inisial }}</div>
            <div class="grow">
              <p class="title">{{ item.penulis }}</p>
              <p class="muted">{{ item.peran }} · {{ item.waktu }}</p>
            </div>
          </header>

          <p class="post-konten">{{ item.konten }}</p>

          <!-- media hanya dirender kalau ada, jadi post teks tidak menyisakan ruang kosong -->
          <figure
            v-if="item.media && item.media.tipe === 'gambar'"
            class="post-media"
            :style="gayaMedia(item.media)"
          >
            <img :src="item.media.url" :alt="item.media.alt" loading="lazy">
          </figure>

          <div class="post-aksi">
            <button class="tap" :class="{ 'is-active': disukai[item.id] }" @click="toggleSuka(item)">
              <i :class="disukai[item.id] ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
              <span>Suka {{ jumlahSuka(item) }}</span>
            </button>
            <button class="tap" @click="belumTersedia">
              <i class="el-icon-chat-line-round"></i><span>Komentar {{ item.komentar }}</span>
            </button>
            <button class="tap" @click="belumTersedia">
              <i class="el-icon-share"></i><span>Bagikan</span>
            </button>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<script>
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import feedData from '@/mock/feed.json'
import riwayatLanjut from '@/mock/lanjutkan.json'
// label, ikon, tombol, dan rute per jenis isi yang bisa dilanjutkan
import petaLanjut from '@/mock/peta-lanjut.json'

export default {
  name: 'HomeView',
  components: { CardSkeleton, EmptyState },
  data () {
    return {
      memuat: true,
      feed: [],
      disukai: {},
      riwayatLanjut,
      filterAktif: 'semua',
      kategori: [
        { id: 'semua', label: 'Semua' },
        { id: 'post', label: 'Postingan' },
        { id: 'article', label: 'Artikel' },
        { id: 'scholarship_alert', label: 'Beasiswa' },
        { id: 'learning_nudge', label: 'Belajar' },
        { id: 'community_update', label: 'Komunitas' }
      ]
    }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] },
    // layar lebar pakai baris chip, layar sempit pakai dropdown biar hemat ruang
    pakaiChip () { return this.$store.state.layout.lebar >= 768 },
    // Satu sumber bentuk-aman untuk feed. Semua .length dan .filter di template
    // maupun computed lain lewat sini, jadi render pertama tidak pernah
    // menyentuh nilai undefined walau data belum datang.
    feedAman () { return Array.isArray(this.feed) ? this.feed : [] },
    // menyaring salinan, array feed asli tidak disentuh
    feedTampil () {
      const daftar = this.feedAman
      if (this.filterAktif === 'semua') return daftar
      return daftar.filter((item) => item.tipe === this.filterAktif)
    },
    jumlahPer () {
      const daftar = this.feedAman
      const hasil = { semua: daftar.length }
      this.kategori.forEach((k) => {
        if (k.id === 'semua') return
        hasil[k.id] = daftar.filter((item) => item.tipe === k.id).length
      })
      return hasil
    },
    labelAktif () {
      const k = this.kategori.filter((x) => x.id === this.filterAktif)[0]
      return k ? k.label : 'isi'
    },
    // satu item saja: yang paling baru disentuh
    lanjutkanTeratas () {
      const daftar = Array.isArray(this.riwayatLanjut) ? this.riwayatLanjut : []
      if (!daftar.length) return null
      return daftar.slice().sort((a, b) => new Date(b.terakhir) - new Date(a.terakhir))[0]
    },
    infoLanjut () {
      const jenis = this.lanjutkanTeratas ? this.lanjutkanTeratas.jenis : 'materi'
      return petaLanjut[jenis] || petaLanjut.materi
    }
  },
  created () {
    // Simulasi ambil data dari server
    this.timer = setTimeout(() => {
      this.feed = feedData
      this.memuat = false
    }, 600)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    // disukai adalah map id -> boolean, bukan daftar. Jangan pernah dipanggil
    // .length di sini; kalau perlu jumlahnya pakai Object.keys(disukai).length.
    jumlahSuka (item) {
      const peta = this.disukai || {}
      return item.suka + (peta[item.id] ? 1 : 0)
    },
    toggleSuka (item) {
      const peta = this.disukai || {}
      this.$set(this.disukai, item.id, !peta[item.id])
    },
    // Tinggi thumbnail dikunci lewat CSS; rasio hanya menentukan lebarnya.
    // --rasio dipakai aspect-ratio, --rasio-angka dipakai cadangan calc().
    gayaMedia (media) {
      const rasio = String(media.rasio || '16/9')
      const bagian = rasio.split('/')
      const w = parseFloat(bagian[0]) || 16
      const t = parseFloat(bagian[1]) || 9
      return {
        '--rasio': w + ' / ' + t,
        '--rasio-angka': (w / t).toFixed(4)
      }
    },
    bukaLanjutkan (item) {
      const info = petaLanjut[item.jenis] || petaLanjut.materi
      this.$router.push(info.rute + item.refId)
    },
    bukaArtikel (item) {
      if (item.artikelId) this.$router.push('/artikel/' + item.artikelId)
    },
    bukaProfil (item) {
      if (item.orangId) this.$router.push('/profil/' + item.orangId)
    },
    simpanArtikel (item) {
      if (item.artikelId) this.$store.dispatch('bookmarks/toggleArtikel', item.artikelId)
      this.$message({ message: 'Disimpan: ' + item.judul, type: 'success' })
    },
    tulisPostingan () {
      this.$store.dispatch('compose/buka')
    },
    belumTersedia () {
      this.$message('Belum aktif di prototipe ini.')
    }
  }
}
</script>

<style scoped>
/* ---------- filter kategori ---------- */
.filter-bar {
  position: sticky;
  top: 56px;
  z-index: 10;
  background: var(--bg);
  padding: 8px 0 4px;
  margin: 0 -2px 4px;
}

/* top bar desktop lebih tinggi, jadi titik lengketnya ikut turun */
.app-desktop .filter-bar { top: 64px; }

.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 6px;
  scrollbar-width: none;
}

.chips::-webkit-scrollbar { display: none; }

.chip {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: var(--tap);
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

.chip:hover { border-color: var(--brand); color: var(--brand); }

.chip.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}

.hitung {
  font-size: 11px;
  font-weight: 700;
  background: var(--bg);
  color: var(--muted);
  border-radius: 999px;
  padding: 1px 7px;
}

.chip.is-active .hitung { background: rgba(255, 255, 255, .22); color: #fff; }

.pilih-baris {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 2px 4px;
}

.pilih-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  flex: none;
}

.pilih { flex: 1; }
.pilih >>> .el-input__inner { min-height: var(--tap); }

.composer { padding: 10px 12px; }

.composer-avatar { background: var(--brand); color: #fff; width: 40px; height: 40px; }

.composer-input {
  min-height: 44px;
  text-align: left;
  border: 0;
  background: var(--bg);
  border-radius: 999px;
  padding: 0 16px;
  color: var(--muted);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
}

.composer-input:hover { color: var(--brand); }

.card-foot {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
}

/* ---------- postingan gaya Threads: dipisah garis, bukan kartu ---------- */
.post {
  padding: 14px 2px;
  border-bottom: 1px solid var(--line-kuat);
  background: transparent;
}

.post + .post { margin-top: 0; }

/* header dirapatkan ke teks supaya satu blok terasa menyatu */
.post-konten {
  margin: 6px 0 0;
  font-size: 14.5px;
  line-height: 1.55;
  white-space: pre-line;
}

/* Thumbnail: tinggi dikunci, lebar ikut rasio. Rata kiri, nempel ke teks. */
.post-media {
  display: inline-block;
  vertical-align: top;
  margin: 10px 0 0;
  height: 180px;
  width: auto;
  max-width: 100%;
  aspect-ratio: var(--rasio, 16 / 9);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
}

.post-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

@media (max-width: 600px) {
  .post-media { height: 160px; }
}

/* cadangan untuk browser tanpa aspect-ratio: lebar dihitung dari tinggi tetap */
@supports not (aspect-ratio: 16 / 9) {
  .post-media { width: calc(180px * var(--rasio-angka, 1.7778)); }

  @media (max-width: 600px) {
    .post-media { width: calc(160px * var(--rasio-angka, 1.7778)); }
  }
}

.post-aksi {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.is-clickable { cursor: pointer; }
.is-clickable:hover { border-color: var(--brand); }

.penulis { cursor: pointer; }
.penulis:hover .title { color: var(--brand); }

.article-ringkasan {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--muted);
}

.lanjut-judul {
  margin: 2px 0 0;
  font-size: 14.5px;
  font-weight: 600;
}

.lanjut-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.nudge { border-color: var(--brand); background: linear-gradient(180deg, var(--brand-soft), var(--card) 60%); }
.nudge-thumb { background: var(--brand); color: #fff; font-size: 22px; }
.nudge-progress { margin-top: 8px; }

.alert-thumb { background: #fff2e6; color: #c76a10; font-size: 22px; }
</style>

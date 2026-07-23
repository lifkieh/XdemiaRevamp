<template>
  <div class="screen">
    <!-- Organisasi/institusi dapat dashboard, bukan feed pribadi -->
    <InstitutionDashboard v-if="peran === 'organisasi'" />

    <template v-else>
    <!-- Composer ringkas: satu aksi utama di layar ini -->
    <div class="card composer">
      <div class="row">
        <div class="thumb thumb-round composer-avatar">{{ inisial }}</div>
        <button class="composer-input grow" @click="tulisPostingan">
          {{ composerPrompt }}
        </button>
      </div>
    </div>

    <!-- Filter kategori: chip di layar lebar, dropdown di layar sempit -->
    <div v-if="!memuat && feedAman.length > 0" class="filter-bar">
      <div v-if="pakaiChip" class="chips-wrap">
        <button
          v-if="chipBisaKiri"
          type="button"
          class="chip-nav chip-nav-kiri"
          aria-label="Previous"
          @click="geserChip(-1)"
        ><i class="el-icon-arrow-left"></i></button>

        <div
          ref="chipsEl"
          class="chips"
          :class="{ 'fade-kiri': chipBisaKiri, 'fade-kanan': chipBisaKanan }"
          role="tablist"
          @scroll="cekChipScroll"
        >
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

        <button
          v-if="chipBisaKanan"
          type="button"
          class="chip-nav chip-nav-kanan"
          aria-label="Next"
          @click="geserChip(1)"
        ><i class="el-icon-arrow-right"></i></button>
      </div>

      <div v-else class="pilih-baris">
        <label for="filter-feed" class="pilih-label">{{ $t('home.show') }}</label>
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
      :judul="$t('home.emptyTitle')"
      :pesan="$t('home.emptyText')"
    >
      <el-button type="primary" @click="$router.push('/explore')">{{ $t('home.emptyAction') }}</el-button>
    </EmptyState>

    <EmptyState
      v-else-if="feedTampil.length === 0"
      ikon="el-icon-files"
      :judul="$t('home.filterEmptyTitle')"
      :pesan="$t('home.filterEmptyText', { kind: labelAktif.toLowerCase() })"
    >
      <el-button type="primary" @click="filterAktif = 'semua'">{{ $t('home.filterEmptyAction') }}</el-button>
    </EmptyState>

    <template v-else>
      <div v-for="item in feedTampil" :key="item.id">
        <!-- Dorongan belajar -->
        <div v-if="item.tipe === 'learning_nudge'" class="card nudge type-nudge">
          <!-- Kartu lanjutkan: isinya dari riwayat lintas jenis, bukan cuma materi -->
          <template v-if="item.sumber === 'lanjutkan' && lanjutkanTeratas">
            <div class="row row-top">
              <div class="thumb nudge-thumb"><i :class="infoLanjut.ikon"></i></div>
              <div class="grow">
                <p class="title">{{ $t('continueCard.' + infoLanjut.kunci + '.title') }}</p>
                <p class="lanjut-judul" data-content="true">{{ lanjutkanTeratas.judul }}</p>
                <div class="lanjut-meta">
                  <span class="pill">{{ $t('continueCard.' + infoLanjut.kunci + '.label') }}</span>
                  <span class="muted">{{ $sisa(lanjutkanTeratas.sisa) }}</span>
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
                {{ $t('continueCard.' + infoLanjut.kunci + '.button') }}
              </el-button>
            </div>
          </template>

          <!-- Dorongan lain (mis. pengingat streak) tetap seperti semula -->
          <template v-else>
            <div class="row row-top">
              <div class="thumb nudge-thumb"><i class="el-icon-reading"></i></div>
              <div class="grow">
                <p class="title">{{ $t('home.nudge.streakTitle', { n: streak }) }}</p>
                <p class="muted">{{ $t('home.nudge.streakText') }}</p>
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
                {{ item.progress > 0 ? $t('common.continue') : $t('home.startLearning') }}
              </el-button>
            </div>
          </template>
        </div>

        <!-- Info beasiswa -->
        <div v-else-if="item.tipe === 'scholarship_alert'" class="card alert type-scholarship">
          <div class="row row-top">
            <div class="thumb alert-thumb"><i class="el-icon-medal"></i></div>
            <div class="grow">
              <p class="title">{{ judulAlert(item) }}</p>
              <p class="muted">
                {{ beasiswaAlert(item).jenjang }} · {{ $t('country.' + beasiswaAlert(item).negaraKode) }} ·
                <span data-content="true">{{ item.catatan }}</span>
              </p>
            </div>
          </div>
          <div class="card-foot">
            <el-button type="primary" size="small" @click="$router.push('/beasiswa/' + item.beasiswaId)">{{ $t('home.viewScholarship') }}</el-button>
          </div>
        </div>

        <!-- Update komunitas -->
        <div
          v-else-if="item.tipe === 'community_update'"
          class="card is-clickable type-community"
          @click="$router.push('/community/' + item.komunitasId)"
        >
          <div class="row row-top">
            <div class="thumb">{{ item.judul.charAt(0) }}</div>
            <div class="grow">
              <p class="title" data-content="true">{{ item.judul }}</p>
              <p class="muted" data-content="true">{{ item.deskripsi }}</p>
              <span class="pill">{{ $t('common.members', { n: $angka(item.jumlahAnggota) }) }}</span>
            </div>
          </div>
        </div>

        <!-- Artikel / jurnal -->
        <div
          v-else-if="item.tipe === 'article'"
          class="card is-clickable type-article"
          @click="bukaArtikel(item)"
        >
          <figure v-if="item.gambarId" class="article-banner">
            <img :src="gambarSrc(item.gambarId)" alt="">
          </figure>
          <div class="row row-top">
            <div class="thumb"><i class="el-icon-document"></i></div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted"><span data-content="true">{{ item.sumber }}</span> · {{ $t('common.readTime', { n: item.menitBaca }) }}</p>
            </div>
          </div>
          <p class="article-ringkasan" data-content="true">{{ item.ringkasan }}</p>
          <div class="card-foot">
            <button class="tap" @click.stop="bukaArtikel(item)">
              <i class="el-icon-reading"></i><span>{{ $t('common.read') }}</span>
            </button>
            <button class="tap" @click.stop="simpanArtikel(item)">
              <i class="el-icon-collection-tag"></i><span>{{ $t('common.save') }}</span>
            </button>
          </div>
        </div>

        <!-- Postingan orang: teks dulu, media opsional, dipisah garis (bukan kartu) -->
        <article v-else class="post">
          <header class="row row-top penulis" @click="bukaProfil(item)">
            <div class="thumb thumb-round">{{ item.inisial }}</div>
            <div class="grow">
              <p class="title" data-content="true">
                {{ item.penulis }}
                <i v-if="item.verified" class="el-icon-success verif-badge" :title="$t('common.verified')"></i>
              </p>
              <p class="muted"><span data-content="true">{{ item.peran }}</span> · {{ $waktuRelatif(item.waktu) }}</p>
            </div>
          </header>

          <p class="post-konten" data-content="true">{{ item.konten }}</p>

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
              <span>{{ $t('common.like') }} {{ jumlahSuka(item) }}</span>
            </button>
            <button class="tap" @click="belumTersedia">
              <i class="el-icon-chat-line-round"></i><span>{{ $t('common.comment') }} {{ item.komentar }}</span>
            </button>
            <button class="tap" @click="belumTersedia">
              <i class="el-icon-share"></i><span>{{ $t('common.share') }}</span>
            </button>
          </div>
        </article>
      </div>
    </template>
    </template>
  </div>
</template>

<script>
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import InstitutionDashboard from '@/components/InstitutionDashboard.vue'
import feedData from '@/mock/feed.json'
import riwayatLanjut from '@/mock/lanjutkan.json'
import beasiswaData from '@/mock/scholarships.json'
// label, ikon, tombol, dan rute per jenis isi yang bisa dilanjutkan
import petaLanjut from '@/mock/peta-lanjut.json'

export default {
  name: 'HomeView',
  components: { CardSkeleton, EmptyState, InstitutionDashboard },
  data () {
    return {
      memuat: true,
      feed: [],
      disukai: {},
      riwayatLanjut,
      filterAktif: 'semua',
      idKategori: ['semua', 'post', 'article', 'scholarship_alert', 'learning_nudge', 'community_update'],
      chipBisaKiri: false,
      chipBisaKanan: false
    }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] },
    peran () { return this.$store.getters['user/peran'] },
    composerPrompt () {
      const peta = {
        dosen: 'home.composerDosen',
        peneliti: 'home.composerPeneliti',
        organisasi: 'home.composerOrganisasi'
      }
      return this.$t(peta[this.peran] || 'home.composer')
    },
    streak () { return this.$store.getters['user/streak'] },
    kategori () {
      return this.idKategori.map((id) => ({
        id,
        label: this.$t('home.filters.' + (id === 'semua' ? 'all' : id))
      }))
    },
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
      this.$nextTick(this.cekChipScroll)
    }, 600)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.cekChipScroll)
  },
  mounted () {
    window.addEventListener('resize', this.cekChipScroll)
  },
  methods: {
    cekChipScroll () {
      const el = this.$refs.chipsEl
      if (!el) { this.chipBisaKiri = false; this.chipBisaKanan = false; return }
      this.chipBisaKiri = el.scrollLeft > 4
      this.chipBisaKanan = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    },
    geserChip (arah) {
      const el = this.$refs.chipsEl
      if (!el) return
      el.scrollBy({ left: arah * Math.round(el.clientWidth * 0.7), behavior: 'smooth' })
    },
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
    gambarSrc (id) {
      return require(`@/assets/assets/portraits/${id}.png`)
    },
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
    beasiswaAlert (item) {
      return beasiswaData.filter((b) => b.id === item.beasiswaId)[0] || {}
    },
    judulAlert (item) {
      const b = this.beasiswaAlert(item)
      return this.$t('home.alertClosing', { name: b.nama, n: b.sisaHari })
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
      this.$message({ message: this.$t('scholarship.savedToast', { name: item.judul }), type: 'success' })
    },
    tulisPostingan () {
      this.$store.dispatch('compose/buka')
    },
    belumTersedia () {
      this.$message(this.$t('common.notAvailable'))
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

.chips-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 2px 2px 6px;
  scrollbar-width: none;
  scroll-behavior: smooth;
}

.chips::-webkit-scrollbar { display: none; }

.chips.fade-kanan { mask-image: linear-gradient(90deg, #000 88%, transparent); -webkit-mask-image: linear-gradient(90deg, #000 88%, transparent); }
.chips.fade-kiri { mask-image: linear-gradient(270deg, #000 88%, transparent); -webkit-mask-image: linear-gradient(270deg, #000 88%, transparent); }
.chips.fade-kiri.fade-kanan { mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }

.chip-nav {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  box-shadow: var(--shadow);
}

.chip-nav:hover { border-color: var(--brand); color: var(--brand); }

.chip {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  font-size: 12.5px;
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
  font-size: 10.5px;
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

.article-banner {
  margin: -12px -12px 10px;
  aspect-ratio: 21 / 9;
  overflow: hidden;
  border-radius: var(--radius) var(--radius) 0 0;
  background: #0c2329;
}

.article-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
  filter: grayscale(60%) contrast(1.05);
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

.verif-badge { color: var(--accent, #4dba87); font-size: 13px; vertical-align: middle; }

/* ---------- aksen warna per jenis konten: cepat dipindai sekilas ---------- */
.type-nudge { border-left: 3px solid var(--brand); }
.type-scholarship { border-left: 3px solid #e08a3c; }
.type-community { border-left: 3px solid #8b5cf6; }
.type-community .thumb { background: #8b5cf6; color: #fff; }
.type-article { border-left: 3px solid #4c6ef5; }
.type-article .thumb { background: #4c6ef5; color: #fff; }
</style>

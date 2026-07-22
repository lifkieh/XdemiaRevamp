<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>Kembali</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!acara"
      ikon="el-icon-warning-outline"
      judul="Acara nggak ketemu"
      pesan="Mungkin sudah dihapus atau tautannya salah."
    >
      <el-button type="primary" @click="$router.push('/events')">Lihat semua acara</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="cover">
          <span class="cover-inisial">{{ acara.inisial }}</span>
        </div>
        <div class="hero-isi">
          <h1 class="title-lg">{{ acara.judul }}</h1>
          <p class="muted">Diselenggarakan {{ acara.penyelenggara }}</p>

          <div class="pil-baris">
            <span class="pill">{{ acara.akses }}</span>
            <span class="pill">{{ acara.privasi }}</span>
            <span v-if="acara.hadiah > 0" class="pill pill-warn">
              <i class="el-icon-trophy"></i> Hadiah {{ rupiah(acara.hadiah) }}
            </span>
            <span v-if="acara.lewat" class="pill">Sudah lewat</span>
          </div>

          <div class="ringkas">
            <div class="ringkas-baris">
              <i class="el-icon-date"></i>
              <div>
                <p class="ringkas-judul">{{ acara.tanggal }}</p>
                <p class="muted">Mulai {{ acara.waktu }}</p>
              </div>
            </div>
            <div class="ringkas-baris">
              <i :class="acara.daring ? 'el-icon-video-camera' : 'el-icon-location-outline'"></i>
              <div>
                <p class="ringkas-judul">{{ acara.lokasi }}</p>
                <p class="muted">{{ acara.daring ? 'Acara daring' : 'Acara tatap muka' }}</p>
              </div>
            </div>
            <div class="ringkas-baris">
              <i class="el-icon-user"></i>
              <div>
                <p class="ringkas-judul">{{ acara.peserta }} orang {{ acara.lewat ? 'hadir' : 'ikut' }}</p>
                <p class="muted">Kuota {{ acara.akses === 'Tertutup' ? 'terbatas' : 'terbuka' }}</p>
              </div>
            </div>
          </div>

          <div class="aksi">
            <el-button
              class="tombol-utama"
              :type="ikut ? 'default' : 'primary'"
              :disabled="acara.lewat"
              @click="toggleIkut"
            >
              {{ acara.lewat ? 'Acara sudah lewat' : (ikut ? 'Batal ikut' : 'Ikut acara') }}
            </el-button>
            <el-button class="tombol-simpan" @click="toggleSimpan">
              <i :class="tersimpan ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
              {{ tersimpan ? 'Tersimpan' : 'Simpan' }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="card">
        <p class="title">Tentang acara</p>
        <p class="paragraf">{{ acara.deskripsi }}</p>
      </div>

      <section class="section">
        <div class="section-head">
          <h2 class="title">Peserta</h2>
          <span class="muted">{{ acara.daftarPeserta.length }} ditampilkan</span>
        </div>
        <BaseCard
          v-for="p in acara.daftarPeserta"
          :key="p.id"
          :inisial="p.inisial"
          :judul="p.nama"
          :subjudul="p.peran"
          bulat
        />
      </section>
    </template>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import events from '@/mock/events.json'

export default {
  name: 'EventDetailView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, acara: null, ikut: false }
  },
  computed: {
    tersimpan () {
      return this.acara ? this.$store.getters['bookmarks/isAcaraTersimpan'](this.acara.id) : false
    }
  },
  created () { this.muat() },
  beforeDestroy () { clearTimeout(this.timer) },
  watch: {
    '$route.params.id' () { this.muat() }
  },
  methods: {
    muat () {
      this.memuat = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.acara = events.filter((e) => e.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    rupiah (n) { return 'Rp' + n.toLocaleString('id-ID') },
    toggleIkut () {
      this.ikut = !this.ikut
      this.$message({
        message: this.ikut ? 'Kamu ikut: ' + this.acara.judul : 'Batal ikut acara',
        type: this.ikut ? 'success' : 'info'
      })
    },
    toggleSimpan () {
      this.$store.dispatch('bookmarks/toggleAcara', this.acara.id)
    }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.hero { padding: 0; overflow: hidden; }

.cover {
  height: 120px;
  background: linear-gradient(120deg, var(--brand), #3fc9c0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-inisial { color: #fff; font-size: 40px; font-weight: 800; letter-spacing: 1px; }

.hero-isi { padding: 14px; }

.pil-baris { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }

.ringkas { margin-top: 14px; }

.ringkas-baris {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}

.ringkas-baris i { font-size: 18px; color: var(--brand); margin-top: 2px; }
.ringkas-judul { margin: 0; font-size: 14px; font-weight: 600; }

.aksi { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.tombol-utama { flex: 1; min-height: 44px; min-width: 180px; }
.tombol-simpan { min-height: 44px; }

.paragraf { margin: 8px 0 0; font-size: 14.5px; }
</style>

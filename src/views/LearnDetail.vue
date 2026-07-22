<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>Kembali</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!materi"
      ikon="el-icon-warning-outline"
      judul="Materi nggak ketemu"
      pesan="Mungkin sudah dihapus atau tautannya salah."
    >
      <el-button type="primary" @click="$router.push('/learn')">Lihat semua materi</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="cover">
          <span class="cover-inisial">{{ materi.judul.charAt(0) }}</span>
        </div>

        <div class="hero-isi">
          <span class="pill jenis">{{ isKursus ? 'Kursus berjadwal' : 'Materi mandiri' }}</span>
          <h1 class="title-lg">{{ materi.judul }}</h1>
          <p class="muted">{{ materi.penyedia }} · {{ materi.durasi }}</p>

          <div class="row penulis">
            <div class="thumb thumb-round">{{ materi.penulis.charAt(0) }}</div>
            <div class="grow">
              <p class="title nama-penulis">{{ materi.penulis }}</p>
              <p class="muted">Penyusun materi</p>
            </div>
          </div>

          <div class="pil-baris">
            <span class="pill">{{ materi.jenjang }}</span>
            <span v-for="t in materi.tag" :key="t" class="pill">{{ t }}</span>
          </div>

          <p class="deskripsi">{{ materi.deskripsi }}</p>

          <!-- Kursus punya jadwal, materi mandiri tidak -->
          <div v-if="isKursus" class="jadwal">
            <div class="jadwal-baris">
              <i class="el-icon-date"></i>
              <div>
                <p class="jadwal-judul">{{ materi.tanggalMulai }} — {{ materi.tanggalSelesai }}</p>
                <p class="muted">Periode kursus</p>
              </div>
            </div>
            <div class="jadwal-baris">
              <i class="el-icon-alarm-clock"></i>
              <div>
                <p class="jadwal-judul">{{ materi.jadwal }}</p>
                <p class="muted">Pertemuan rutin</p>
              </div>
            </div>
          </div>

          <el-progress :percentage="persen" :stroke-width="8" :show-text="false" class="bar" />
          <p class="muted">{{ selesai }} dari {{ modul.length }} modul selesai</p>

          <div class="aksi">
            <el-button type="primary" class="tombol-utama" @click="mulai">
              {{ labelTombol }}
            </el-button>
            <el-button class="tombol-simpan" @click="toggleSimpan">
              <i :class="tersimpan ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
              {{ tersimpan ? 'Tersimpan' : 'Simpan' }}
            </el-button>
          </div>
        </div>
      </div>

      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ isKursus ? 'Silabus kursus' : 'Daftar modul' }}</h2>
          <span class="muted">{{ modul.length }} modul</span>
        </div>

        <div class="card daftar">
          <label
            v-for="(m, i) in modul"
            :key="m.id"
            class="modul"
          >
            <el-checkbox v-model="m.selesai">
              <span class="modul-nomor">{{ i + 1 }}.</span>
              <span :class="{ 'is-done': m.selesai }">{{ m.judul }}</span>
            </el-checkbox>
          </label>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import courses from '@/mock/courses.json'

export default {
  name: 'LearnDetailView',
  components: { CardSkeleton, EmptyState },
  data () {
    return { memuat: true, materi: null, modul: [] }
  },
  computed: {
    isKursus () { return !!this.materi && this.materi.jenis === 'kursus' },
    selesai () { return this.modul.filter((m) => m.selesai).length },
    persen () {
      if (!this.modul.length) return 0
      return Math.round((this.selesai / this.modul.length) * 100)
    },
    labelTombol () {
      if (this.persen > 0) return 'Lanjutkan belajar'
      return this.isKursus ? 'Daftar kursus' : 'Mulai belajar'
    },
    tersimpan () {
      return this.materi ? this.$store.getters['bookmarks/isMateriTersimpan'](this.materi.id) : false
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
        const sumber = courses.filter((c) => c.id === this.$route.params.id)[0]
        if (sumber) {
          // Salin biar checklist bisa diubah tanpa nyentuh data mock aslinya
          this.materi = sumber
          this.modul = sumber.modul.map((m) => ({ id: m.id, judul: m.judul, selesai: m.selesai }))
        } else {
          this.materi = null
          this.modul = []
        }
        this.memuat = false
      }, 500)
    },
    mulai () {
      const berikut = this.modul.filter((m) => !m.selesai)[0]
      if (!berikut) {
        this.$message({ message: 'Semua modul sudah selesai. Mantap!', type: 'success' })
        return
      }
      berikut.selesai = true
      this.$message({ message: 'Modul "' + berikut.judul + '" ditandai selesai.', type: 'success' })
    },
    toggleSimpan () {
      this.$store.dispatch('bookmarks/toggleMateri', this.materi.id)
    }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.hero { padding: 0; overflow: hidden; }

.cover {
  height: 110px;
  background: linear-gradient(120deg, var(--brand), #3fc9c0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-inisial { color: #fff; font-size: 38px; font-weight: 800; }

.hero-isi { padding: 14px; }

.jenis { margin-bottom: 8px; }

.penulis {
  margin-top: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.penulis .thumb { width: 38px; height: 38px; font-size: 15px; }
.nama-penulis { font-size: 14px; }

.pil-baris { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }

.deskripsi { margin: 12px 0; font-size: 14.5px; }

.jadwal {
  background: var(--brand-soft);
  border-radius: var(--radius-sm);
  padding: 4px 12px;
  margin-bottom: 14px;
}

.jadwal-baris {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid rgba(23, 162, 162, .18);
}

.jadwal-baris:last-child { border-bottom: 0; }
.jadwal-baris i { color: var(--brand-dark); font-size: 17px; margin-top: 2px; }
.jadwal-judul { margin: 0; font-size: 14px; font-weight: 600; }

.bar { margin-bottom: 6px; }

.aksi { display: flex; gap: 8px; margin-top: 14px; }
.tombol-utama { flex: 1; min-height: 44px; }
.tombol-simpan { min-height: 44px; }

.daftar { padding: 4px 12px; }

.modul {
  display: block;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  min-height: 44px;
  cursor: pointer;
}

.modul:last-child { border-bottom: 0; }
.modul-nomor { color: var(--muted); margin-right: 6px; }
.is-done { color: var(--muted); text-decoration: line-through; }
</style>

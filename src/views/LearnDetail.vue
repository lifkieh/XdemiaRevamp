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
      <div class="card">
        <div class="row row-top">
          <div class="thumb">{{ materi.judul.charAt(0) }}</div>
          <div class="grow">
            <h1 class="title-lg">{{ materi.judul }}</h1>
            <p class="muted">{{ materi.penyedia }} · {{ materi.durasi }}</p>
          </div>
        </div>

        <p class="deskripsi">{{ materi.deskripsi }}</p>

        <el-progress :percentage="persen" :stroke-width="8" :show-text="false" class="bar" />
        <p class="muted">{{ selesai }} dari {{ modul.length }} modul selesai</p>

        <div class="aksi">
          <el-button type="primary" class="tombol-utama" @click="mulai">
            {{ persen > 0 ? 'Lanjutkan belajar' : 'Mulai belajar' }}
          </el-button>
          <el-button class="tombol-simpan" @click="toggleSimpan">
            <i :class="tersimpan ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
            {{ tersimpan ? 'Tersimpan' : 'Simpan' }}
          </el-button>
        </div>
      </div>

      <section class="section">
        <div class="section-head">
          <h2 class="title">Daftar modul</h2>
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
    selesai () { return this.modul.filter((m) => m.selesai).length },
    persen () {
      if (!this.modul.length) return 0
      return Math.round((this.selesai / this.modul.length) * 100)
    },
    tersimpan () {
      return this.materi ? this.$store.getters['bookmarks/isMateriTersimpan'](this.materi.id) : false
    }
  },
  created () {
    this.timer = setTimeout(() => {
      const sumber = courses.filter((c) => c.id === this.$route.params.id)[0]
      if (sumber) {
        // Salin biar checklist bisa diubah tanpa nyentuh data mock aslinya
        this.materi = sumber
        this.modul = sumber.modul.map((m) => ({ id: m.id, judul: m.judul, selesai: m.selesai }))
      }
      this.memuat = false
    }, 500)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
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

.deskripsi { margin: 12px 0; font-size: 14.5px; }

.bar { margin-bottom: 6px; }

.aksi {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

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

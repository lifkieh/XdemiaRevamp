<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>{{ $t('common.back') }}</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!materi"
      ikon="el-icon-warning-outline"
      :judul="$t('course.notFoundTitle')"
      :pesan="$t('course.notFoundText')"
    >
      <el-button type="primary" @click="$router.push('/learn')">{{ $t('course.notFoundAction') }}</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="cover">
          <span class="cover-inisial">{{ materi.judul.charAt(0) }}</span>
        </div>

        <div class="hero-isi">
          <span class="pill jenis">{{ isKursus ? $t('course.scheduled') : $t('course.selfPaced') }}</span>
          <h1 class="title-lg" data-content="true">{{ materi.judul }}</h1>
          <p class="muted"><span data-content="true">{{ materi.penyedia }}</span> · {{ $durasi(materi.jamDurasi) }}</p>

          <div class="pil-baris">
            <span class="pill">{{ $t('course.level.' + materi.level) }}</span>
            <span v-for="t in materi.tag" :key="t" class="pill" data-content="true">{{ t }}</span>
          </div>

          <el-progress :percentage="persen" :stroke-width="8" :show-text="false" class="bar" />
          <p class="muted">{{ $t('course.modulesDone', { done: selesai, total: modul.length }) }}</p>

          <div class="aksi">
            <el-button type="primary" class="tombol-utama" @click="mulai">
              {{ labelTombol }}
            </el-button>
            <el-button class="tombol-simpan" @click="toggleSimpan">
              <i :class="tersimpan ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
              {{ tersimpan ? $t('common.saved') : $t('common.save') }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- Panel penyedia & penulis: selalu terlihat, di desktop jadi kolom samping -->
      <div class="card panel">
        <div class="panel-baris">
          <div class="thumb panel-ikon"><i class="el-icon-office-building"></i></div>
          <div class="grow">
            <p class="panel-label">{{ $t('course.provider') }}</p>
            <p class="panel-nilai" data-content="true">{{ materi.penyedia }}</p>
          </div>
        </div>

        <div class="panel-baris">
          <div class="thumb thumb-round panel-ikon">{{ materi.penulis.charAt(0) }}</div>
          <div class="grow">
            <p class="panel-label">{{ $t('course.author') }}</p>
            <p class="panel-nilai" data-content="true">{{ materi.penulis }}</p>
          </div>
        </div>

        <template v-if="isKursus">
          <div class="panel-baris">
            <div class="thumb panel-ikon"><i class="el-icon-date"></i></div>
            <div class="grow">
              <p class="panel-label">{{ $t('course.startEnd') }}</p>
              <p class="panel-nilai">{{ $tanggal(materi.mulaiIso) }} — {{ $tanggal(materi.selesaiIso) }}</p>
              <p class="muted">{{ jadwalTeks }} · {{ $t('course.meetings') }}</p>
            </div>
          </div>

          <div class="panel-baris">
            <div class="thumb panel-ikon"><i class="el-icon-user"></i></div>
            <div class="grow">
              <p class="panel-label">{{ $t('course.enrollments') }}</p>
              <p class="panel-nilai">{{ $t('course.enrollmentsCount', { n: $angka(materi.pendaftar) }) }}</p>
            </div>
          </div>
        </template>
      </div>

      <el-tabs v-model="tab" class="tab-materi">
        <el-tab-pane :label="$t('course.tabAbout')" name="tentang">
          <div class="card">
            <p class="title">{{ $t('common.about') }}</p>
            <p class="deskripsi" data-content="true">{{ materi.deskripsi }}</p>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="$t('course.tabModules')" name="modul">
          <div class="section-head">
            <h2 class="title">{{ isKursus ? $t('course.syllabus') : $t('course.modules') }}</h2>
            <span class="muted">{{ $t('course.moduleCount', { n: modul.length }) }}</span>
          </div>

          <div class="card daftar">
            <label
              v-for="(m, i) in modul"
              :key="m.id"
              class="modul"
            >
              <el-checkbox v-model="m.selesai">
                <span class="modul-nomor">{{ i + 1 }}.</span>
                <span :class="{ 'is-done': m.selesai }" data-content="true">{{ m.judul }}</span>
              </el-checkbox>
            </label>
          </div>
        </el-tab-pane>
      </el-tabs>
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
    return { memuat: true, materi: null, modul: [], tab: 'tentang' }
  },
  computed: {
    isKursus () { return !!this.materi && this.materi.jenis === 'kursus' },
    selesai () { return this.modul.filter((m) => m.selesai).length },
    persen () {
      if (!this.modul.length) return 0
      return Math.round((this.selesai / this.modul.length) * 100)
    },
    labelTombol () {
      if (this.persen > 0) return this.$t('course.continueLearning')
      return this.isKursus ? this.$t('course.enrol') : this.$t('course.startLearning')
    },
    tersimpan () {
      return this.materi ? this.$store.getters['bookmarks/isMateriTersimpan'](this.materi.id) : false
    },
    // "Tiap Sabtu, 09.00" dirangkai dari angka hari + jam supaya ikut bahasa
    jadwalTeks () {
      if (!this.materi || !this.materi.jadwalHari) return ''
      const tag = this.$i18n.locale === 'id' ? 'id-ID' : 'en-GB'
      const hari = this.materi.jadwalHari.map((h) => {
        const d = new Date(2026, 0, 4 + h)
        return new Intl.DateTimeFormat(tag, { weekday: 'long' }).format(d)
      }).join(' & ')
      return this.$t('course.jadwalPola', { hari, jam: this.$jam(this.materi.jadwalJam) })
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
    // Enroll / Start hanya tampilan: tidak mengubah progres apa pun
    mulai () {
      this.$message(this.isKursus ? this.$t('course.enrolNote') : this.$t('course.startNote'))
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

.panel { padding: 4px 14px; }

.panel-baris {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.panel-baris:last-child { border-bottom: 0; }

.panel-ikon { width: 38px; height: 38px; font-size: 17px; }

.panel-label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--muted);
}

.panel-nilai { margin: 2px 0 0; font-size: 14px; font-weight: 600; }

.tab-materi { margin-top: 14px; }
.tab-materi >>> .el-tabs__nav-wrap::after { height: 1px; background: var(--line); }
.tab-materi >>> .el-tabs__item { padding: 0 14px; }

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

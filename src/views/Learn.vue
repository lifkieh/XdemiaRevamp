<template>
  <div class="screen">
    <div class="row belajar-head">
      <div class="grow">
        <h1 class="title-lg">Belajar</h1>
        <p class="muted">Streak kamu {{ streak }} hari. Jangan putus ya.</p>
      </div>
      <span class="pill"><i class="el-icon-trophy"></i> {{ streak }} hari</span>
    </div>

    <FilterChips v-model="jenis" :opsi="opsiJenis" />
    <p class="muted penjelasan">{{ penjelasan }}</p>

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <template v-else>
      <!-- Lanjutkan: lintas jenis, bukan cuma materi, urut dari yang terakhir dibuka.
           Disembunyikan saat chip dipersempit ke Materi/Kursus supaya isinya tidak
           bertabrakan dengan penyaringan katalog. -->
      <section v-if="jenis === 'Semua'" class="section">
        <div class="section-head">
          <h2 class="title">Lanjutkan</h2>
          <span class="muted">dari yang terakhir dibuka</span>
        </div>

        <EmptyState
          v-if="lanjutkan.length === 0"
          ikon="el-icon-reading"
          judul="Belum ada yang dimulai"
          pesan="Pilih satu materi di bawah, 10 menit aja cukup buat mulai."
        />

        <BaseCard
          v-for="isi in lanjutkan"
          :key="isi.id"
          :inisial="isi.judul.charAt(0)"
          :judul="isi.judul"
          :subjudul="isi.penyedia"
          clickable
          @click.native="bukaLanjutkan(isi)"
        >
          <template slot="meta">
            <span class="pill">
              <i :class="petaLanjut[isi.jenis].ikon"></i> {{ petaLanjut[isi.jenis].label }}
            </span>
            <span class="muted">{{ isi.sisa }}</span>
          </template>
          <div class="progress-baris">
            <el-progress :percentage="isi.progress" :stroke-width="6" :show-text="false" />
            <span class="muted progress-teks">{{ isi.progress }}% selesai</span>
          </div>
        </BaseCard>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="title">Untuk kamu</h2>
          <span class="muted">{{ untukKamu.length }} materi</span>
        </div>

        <EmptyState
          v-if="untukKamu.length === 0"
          ikon="el-icon-reading"
          judul="Belum ada rekomendasi"
          pesan="Coba ganti jenisnya di atas."
        />

        <BaseCard
          v-for="materi in untukKamu"
          :key="materi.id"
          :inisial="materi.judul.charAt(0)"
          :judul="materi.judul"
          :subjudul="materi.penyedia + ' · ' + materi.durasi"
          clickable
          @click.native="buka(materi.id)"
        >
          <template slot="meta">
            <span class="pill">{{ materi.jenis === 'kursus' ? 'Kursus' : 'Materi' }}</span>
            <span v-if="materi.jenis === 'kursus'" class="pill">
              <i class="el-icon-date"></i> Mulai {{ materi.tanggalMulai }}
            </span>
            <span v-else class="pill">{{ materi.jenjang }}</span>
          </template>
          <template slot="action">
            <el-button size="small" type="primary" @click.stop="buka(materi.id)">
              {{ materi.jenis === 'kursus' ? 'Daftar' : 'Mulai' }}
            </el-button>
          </template>
        </BaseCard>
      </section>
    </template>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import FilterChips from '@/components/FilterChips.vue'
import courses from '@/mock/courses.json'
import riwayatLanjut from '@/mock/lanjutkan.json'
import petaLanjut from '@/mock/peta-lanjut.json'

export default {
  name: 'LearnView',
  components: { BaseCard, CardSkeleton, EmptyState, FilterChips },
  data () {
    return {
      memuat: true,
      materi: [],
      riwayatLanjut,
      petaLanjut,
      jenis: 'Semua',
      opsiJenis: ['Semua', 'Materi', 'Kursus']
    }
  },
  computed: {
    streak () { return this.$store.getters['user/streak'] },
    penjelasan () {
      if (this.jenis === 'Materi') return 'Materi bisa dibuka kapan saja, belajar sesuai kecepatan kamu.'
      if (this.jenis === 'Kursus') return 'Kursus punya tanggal mulai dan selesai, jadwalnya diikuti bareng.'
      return 'Materi bisa dibuka kapan saja; kursus punya jadwal mulai dan selesai.'
    },
    tersaring () {
      if (this.jenis === 'Materi') return this.materi.filter((m) => m.jenis === 'materi')
      if (this.jenis === 'Kursus') return this.materi.filter((m) => m.jenis === 'kursus')
      return this.materi
    },
    // Rail lanjutkan tidak ikut chip Materi/Kursus: isinya riwayat lintas jenis
    // (materi, artikel, jurnal), diurutkan dari yang terakhir dibuka.
    lanjutkan () {
      const daftar = Array.isArray(this.riwayatLanjut) ? this.riwayatLanjut : []
      return daftar
        .slice()
        .sort((a, b) => new Date(b.terakhir) - new Date(a.terakhir))
        .slice(0, 3)
    },
    untukKamu () { return this.tersaring.filter((m) => m.progress === 0) }
  },
  created () {
    this.timer = setTimeout(() => {
      this.materi = courses
      this.memuat = false
    }, 600)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    buka (id) { this.$router.push('/learn/' + id) },
    bukaLanjutkan (isi) {
      const info = this.petaLanjut[isi.jenis] || this.petaLanjut.materi
      this.$router.push(info.rute + isi.refId)
    }
  }
}
</script>

<style scoped>
.belajar-head { margin: 4px 2px 12px; }
.belajar-head .title-lg { margin-bottom: 2px; }

.penjelasan { margin: 0 2px 12px; font-size: 12.5px; }

.progress-baris { margin-top: 10px; }
.progress-teks { display: block; margin-top: 4px; }
</style>

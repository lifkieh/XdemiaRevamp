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
      <section class="section">
        <div class="section-head">
          <h2 class="title">Lanjutkan belajar</h2>
          <span class="muted">{{ lanjutkan.length }} materi</span>
        </div>

        <EmptyState
          v-if="lanjutkan.length === 0"
          ikon="el-icon-reading"
          judul="Belum ada yang dimulai"
          pesan="Pilih satu materi di bawah, 10 menit aja cukup buat mulai."
        />

        <BaseCard
          v-for="materi in lanjutkan"
          :key="materi.id"
          :inisial="materi.judul.charAt(0)"
          :judul="materi.judul"
          :subjudul="materi.penyedia + ' · ' + materi.durasi"
          clickable
          @click.native="buka(materi.id)"
        >
          <template slot="meta">
            <span class="pill">{{ materi.jenis === 'kursus' ? 'Kursus' : 'Materi' }}</span>
            <span class="pill">{{ materi.jenjang }}</span>
          </template>
          <div class="progress-baris">
            <el-progress :percentage="materi.progress" :stroke-width="6" :show-text="false" />
            <span class="muted progress-teks">{{ materi.progress }}% selesai</span>
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

export default {
  name: 'LearnView',
  components: { BaseCard, CardSkeleton, EmptyState, FilterChips },
  data () {
    return {
      memuat: true,
      materi: [],
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
    lanjutkan () { return this.tersaring.filter((m) => m.progress > 0) },
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
    buka (id) { this.$router.push('/learn/' + id) }
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

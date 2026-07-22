<template>
  <div class="screen">
    <div class="row belajar-head">
      <div class="grow">
        <h1 class="title-lg">{{ $t('learn.title') }}</h1>
        <p class="muted">{{ $t('learn.streak', { n: streak }) }}</p>
      </div>
      <span class="pill"><i class="el-icon-trophy"></i> {{ $t('learn.streakPill', { n: streak }) }}</span>
    </div>

    <FilterChips :value="labelJenis" :opsi="opsiJenis" @input="pilihJenis" />
    <p class="muted penjelasan">{{ penjelasan }}</p>

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <template v-else>
      <!-- Lanjutkan: lintas jenis, bukan cuma materi, urut dari yang terakhir dibuka.
           Disembunyikan saat chip dipersempit ke Materi/Kursus supaya isinya tidak
           bertabrakan dengan penyaringan katalog. -->
      <section v-if="jenis === 'all'" class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('learn.continueTitle') }}</h2>
          <span class="muted">{{ $t('learn.continueSub') }}</span>
        </div>

        <EmptyState
          v-if="lanjutkan.length === 0"
          ikon="el-icon-reading"
          :judul="$t('learn.emptyStartedTitle')"
          :pesan="$t('learn.emptyStartedText')"
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
              <i :class="petaLanjut[isi.jenis].ikon"></i> {{ $t('continueCard.' + petaLanjut[isi.jenis].kunci + '.label') }}
            </span>
            <span class="muted">{{ $sisa(isi.sisa) }}</span>
          </template>
          <div class="progress-baris">
            <el-progress :percentage="isi.progress" :stroke-width="6" :show-text="false" />
            <span class="muted progress-teks">{{ $t('common.percentDone', { n: isi.progress }) }}</span>
          </div>
        </BaseCard>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('learn.forYou') }}</h2>
          <span class="muted">{{ $t('learn.count', { n: untukKamu.length }) }}</span>
        </div>

        <EmptyState
          v-if="untukKamu.length === 0"
          ikon="el-icon-reading"
          :judul="$t('learn.emptyForYouTitle')"
          :pesan="$t('learn.emptyForYouText')"
        />

        <BaseCard
          v-for="materi in untukKamu"
          :key="materi.id"
          :inisial="materi.judul.charAt(0)"
          :judul="materi.judul"
          :subjudul="materi.penyedia + ' · ' + $durasi(materi.jamDurasi)"
          clickable
          @click.native="buka(materi.id)"
        >
          <template slot="meta">
            <span class="pill">{{ materi.jenis === 'kursus' ? $t('learn.filters.kursus') : $t('learn.filters.materi') }}</span>
            <span v-if="materi.jenis === 'kursus'" class="pill">
              <i class="el-icon-date"></i> {{ $t('course.startsOn', { date: $tanggal(materi.mulaiIso) }) }}
            </span>
            <span v-else class="pill">{{ $t('course.level.' + materi.level) }}</span>
          </template>
          <template slot="action">
            <el-button size="small" type="primary" @click.stop="buka(materi.id)">
              {{ materi.jenis === 'kursus' ? $t('learn.enrol') : $t('common.start') }}
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
      jenis: 'all',
      idJenis: ['all', 'materi', 'kursus']
    }
  },
  computed: {
    streak () { return this.$store.getters['user/streak'] },
    opsiJenis () { return this.idJenis.map((id) => this.$t('learn.filters.' + id)) },
    labelJenis () { return this.$t('learn.filters.' + this.jenis) },
    penjelasan () {
      if (this.jenis === 'materi') return this.$t('learn.hintMateri')
      if (this.jenis === 'kursus') return this.$t('learn.hintKursus')
      return this.$t('learn.hintAll')
    },
    tersaring () {
      if (this.jenis === 'all') return this.materi
      return this.materi.filter((m) => m.jenis === this.jenis)
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
    pilihJenis (label) {
      const i = this.opsiJenis.indexOf(label)
      if (i !== -1) this.jenis = this.idJenis[i]
    },
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

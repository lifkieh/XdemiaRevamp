<template>
  <aside class="rail" :aria-label="$t('rail.aria')">
    <div class="rail-isi">
      <!-- Streak: pembelajar. Untuk peran lain, tampilkan ringkasan kontribusi -->
      <div v-if="peran === 'mahasiswa'" class="card widget">
        <div class="row">
          <div class="thumb widget-ikon"><i class="el-icon-trophy"></i></div>
          <div class="grow">
            <p class="title">{{ $t('rail.streak', { n: streak }) }}</p>
            <p class="muted">{{ $t('rail.streakText') }}</p>
          </div>
        </div>
        <el-progress :percentage="persenStreak" :stroke-width="6" :show-text="false" class="bar" />
      </div>

      <div v-else class="card widget">
        <div class="row">
          <div class="thumb widget-ikon"><i :class="ringkasanPeran.ikon"></i></div>
          <div class="grow">
            <p class="title">{{ ringkasanPeran.judul }}</p>
            <p class="muted">{{ ringkasanPeran.teks }}</p>
          </div>
        </div>
      </div>

      <!-- Trending: muncul di Jelajah -->
      <div v-if="tampilkan.trending" class="card widget">
        <p class="title widget-judul">{{ $t('rail.trending') }}</p>
        <div v-for="(t, i) in trending" :key="t.label" class="baris baris-trending">
          <span class="trending-no">{{ i + 1 }}</span>
          <div class="grow">
            <p class="baris-judul" data-content="true">{{ t.label }}</p>
            <p class="muted">{{ $t('rail.trendingCount', { n: t.jumlah }) }}</p>
          </div>
        </div>
      </div>

      <!-- Materi: muncul di Belajar -->
      <div v-if="tampilkan.materi" class="card widget">
        <p class="title widget-judul">{{ $t('rail.continueLearning') }}</p>
        <router-link
          v-for="m in materiLanjut"
          :key="m.id"
          :to="'/learn/' + m.id"
          class="baris"
        >
          <div class="thumb thumb-mini">{{ m.judul.charAt(0) }}</div>
          <div class="grow">
            <p class="baris-judul" data-content="true">{{ m.judul }}</p>
            <p class="muted">{{ $t('common.percentDone', { n: m.progress }) }}</p>
          </div>
        </router-link>
      </div>

      <!-- Deadline beasiswa -->
      <div v-if="tampilkan.beasiswa" class="card widget">
        <p class="title widget-judul">{{ $t('rail.deadlines') }}</p>
        <router-link
          v-for="b in beasiswaDekat"
          :key="b.id"
          to="/scholarships"
          class="baris"
        >
          <div class="thumb thumb-mini">{{ b.inisial }}</div>
          <div class="grow">
            <p class="baris-judul" data-content="true">{{ b.nama }}</p>
            <span class="pill" :class="{ 'pill-warn': b.sisaHari <= 7 }">{{ $t('common.daysLeft', { n: b.sisaHari }) }}</span>
          </div>
        </router-link>
      </div>

      <!-- Acara terdekat -->
      <div v-if="tampilkan.acara" class="card widget">
        <p class="title widget-judul">{{ $t('rail.events') }}</p>
        <router-link
          v-for="e in acaraDekat"
          :key="e.id"
          to="/events"
          class="baris"
        >
          <div class="thumb thumb-mini">{{ e.inisial }}</div>
          <div class="grow">
            <p class="baris-judul" data-content="true">
              {{ e.judul }}
              <span v-if="e.registrasiDibuka" class="pill pill-live pill-mini">{{ $t('common.registrationOpen') }}</span>
            </p>
            <p class="muted">{{ $tanggal(e.tanggalIso, true) }} · {{ $jam(e.jamMulai) }}</p>
          </div>
        </router-link>
      </div>

      <!-- Saran koneksi: selalu tampil -->
      <div class="card widget">
        <p class="title widget-judul">{{ $t('rail.people') }}</p>
        <div v-for="o in saranOrang" :key="o.id" class="baris">
          <div class="thumb thumb-mini thumb-round">{{ o.inisial }}</div>
          <div class="grow">
            <p class="baris-judul" data-content="true">{{ o.nama }}</p>
            <p class="muted" data-content="true">{{ o.peran }}</p>
          </div>
          <el-button size="mini" type="primary" @click="ikuti(o)">{{ $t('common.follow') }}</el-button>
        </div>
      </div>

      <p class="muted catatan">{{ $t('common.prototypeNote') }}</p>
    </div>
  </aside>
</template>

<script>
import scholarships from '@/mock/scholarships.json'
import courses from '@/mock/courses.json'
import explore from '@/mock/explore.json'
import events from '@/mock/events.json'

export default {
  name: 'RightRail',
  computed: {
    streak () { return this.$store.getters['user/streak'] },
    persenStreak () { return Math.min(100, this.streak * 100 / 7) },
    peran () { return this.$store.getters['user/peran'] },
    ringkasanPeran () {
      const peta = {
        dosen: { ikon: 'el-icon-collection', judul: this.$t('rail.dosenJudul'), teks: this.$t('rail.dosenTeks') },
        peneliti: { ikon: 'el-icon-document-checked', judul: this.$t('rail.penelitiJudul'), teks: this.$t('rail.penelitiTeks') },
        organisasi: { ikon: 'el-icon-office-building', judul: this.$t('rail.organisasiJudul'), teks: this.$t('rail.organisasiTeks') }
      }
      return peta[this.peran] || peta.dosen
    },
    // isi kolom kanan menyesuaikan halaman yang sedang dibuka
    tampilkan () {
      const n = this.$route.name
      return {
        materi: n === 'learn' || n === 'learn-detail',
        beasiswa: n !== 'events' && n !== 'explore',
        acara: n === 'events' || n === 'home',
        trending: n === 'explore'
      }
    },
    trending () {
      return [
        { label: 'LPDP 2026', jumlah: 812 },
        { label: 'Machine Learning', jumlah: 604 },
        { label: 'Building Blocks', jumlah: 411 },
        { label: 'Riset Skripsi', jumlah: 298 },
        { label: 'IELTS', jumlah: 233 }
      ]
    },
    materiLanjut () {
      return courses.filter((c) => c.progress > 0).slice(0, 3)
    },
    beasiswaDekat () {
      return scholarships.slice().sort((a, b) => a.sisaHari - b.sisaHari).slice(0, 3)
    },
    acaraDekat () {
      return events.filter((e) => !e.lewat).slice(0, 3)
    },
    saranOrang () {
      return explore.filter((e) => e.tipe === 'orang').slice(0, 3)
    }
  },
  methods: {
    ikuti (o) {
      this.$message({ message: this.$t('explore.nowFollowing', { name: o.nama }), type: 'success' })
    }
  }
}
</script>

<style scoped>
.rail-isi {
  position: sticky;
  top: 0;
  padding: 16px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.widget { margin-bottom: 0; }

.widget-judul { margin-bottom: 8px; }

.widget-ikon {
  width: 40px;
  height: 40px;
  background: var(--brand);
  color: #fff;
  font-size: 19px;
}

.bar { margin-top: 10px; }

.baris {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-top: 1px solid var(--line);
  min-height: 44px;
  color: inherit;
}

.baris:first-of-type { border-top: 0; }

.baris:hover .baris-judul { color: var(--brand); }

.baris-judul {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.baris .muted { font-size: 12px; }

.thumb-mini {
  width: 34px;
  height: 34px;
  font-size: 13px;
}

.catatan { text-align: center; font-size: 12px; padding: 4px 0; }

.baris-trending { gap: 12px; }

.pill-mini {
  font-size: 9.5px;
  padding: 1px 6px;
  margin-left: 4px;
  vertical-align: middle;
}

.trending-no {
  width: 22px;
  flex: none;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  color: var(--brand);
}
</style>

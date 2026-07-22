<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>{{ $t('common.back') }}</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!beasiswa"
      ikon="el-icon-warning-outline"
      :judul="$t('scholarship.notFoundTitle')"
      :pesan="$t('scholarship.notFoundText')"
    >
      <el-button type="primary" @click="$router.push('/scholarships')">{{ $t('scholarship.notFoundAction') }}</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="cover"></div>
        <div class="hero-isi">
          <div class="logo-beasiswa">{{ beasiswa.inisial }}</div>
          <h1 class="title-lg" data-content="true">{{ beasiswa.nama }}</h1>
          <p class="muted" data-content="true">{{ beasiswa.penyelenggara }}</p>

          <div class="pil-baris">
            <span class="pill">{{ beasiswa.jenjang }}</span>
            <span class="pill">{{ $t('country.' + beasiswa.negaraKode) }}</span>
            <span class="pill" :class="{ 'pill-warn': beasiswa.sisaHari <= 7 }">{{ $t('common.daysLeft', { n: beasiswa.sisaHari }) }}</span>
          </div>

          <div class="aksi">
            <el-button type="primary" class="tombol-utama" @click="kunjungi">
              <i class="el-icon-link"></i> {{ $t('scholarship.visitSite') }}
            </el-button>
            <el-button class="tombol-simpan" @click="toggleSimpan">
              <i :class="tersimpan ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
              {{ tersimpan ? $t('common.saved') : $t('common.save') }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="card">
        <p class="title">{{ $t('scholarship.about') }}</p>
        <p class="paragraf" data-content="true">{{ beasiswa.tentang }}</p>
        <div class="info">
          <span class="muted">{{ $t('scholarship.coverage') }}</span>
          <span data-content="true">{{ beasiswa.cakupan }}</span>
        </div>
      </div>

      <div class="card">
        <p class="title">{{ $t('scholarship.requirements') }}</p>
        <ul class="daftar-titik">
          <li v-for="(s, i) in beasiswa.syarat" :key="'sy-' + i" data-content="true">{{ s }}</li>
        </ul>
      </div>

      <div class="card">
        <p class="title">{{ $t('scholarship.benefits') }}</p>
        <ul class="daftar-centang">
          <li v-for="(b, i) in beasiswa.benefit" :key="'bn-' + i">
            <i class="el-icon-check"></i><span data-content="true">{{ b }}</span>
          </li>
        </ul>
      </div>

      <div class="card">
        <p class="title">{{ $t('scholarship.howToApply') }}</p>
        <ol class="daftar-langkah">
          <li v-for="(c, i) in beasiswa.caraDaftar" :key="'cd-' + i">
            <span class="nomor">{{ i + 1 }}</span>
            <span data-content="true">{{ c }}</span>
          </li>
        </ol>
      </div>

      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('scholarship.similar') }}</h2>
          <router-link to="/scholarships" class="muted">{{ $t('common.seeAll') }}</router-link>
        </div>
        <BaseCard
          v-for="b in mirip"
          :key="b.id"
          :inisial="b.inisial"
          :judul="b.nama"
          :subjudul="b.penyelenggara"
          clickable
          @click.native="$router.push('/beasiswa/' + b.id)"
        >
          <template slot="meta">
            <span class="pill">{{ b.jenjang }}</span>
            <span class="pill">{{ $t('country.' + b.negaraKode) }}</span>
            <span class="pill" :class="{ 'pill-warn': b.sisaHari <= 7 }">{{ $t('common.daysLeft', { n: b.sisaHari }) }}</span>
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
import scholarships from '@/mock/scholarships.json'

export default {
  name: 'ScholarshipDetailView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, beasiswa: null }
  },
  computed: {
    tersimpan () {
      return this.beasiswa ? this.$store.getters['bookmarks/isBeasiswaTersimpan'](this.beasiswa.id) : false
    },
    mirip () {
      if (!this.beasiswa) return []
      const sama = scholarships.filter((b) => b.id !== this.beasiswa.id && b.jenjang === this.beasiswa.jenjang)
      const lain = scholarships.filter((b) => b.id !== this.beasiswa.id && b.jenjang !== this.beasiswa.jenjang)
      return sama.concat(lain).slice(0, 3)
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
        this.beasiswa = scholarships.filter((b) => b.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    toggleSimpan () {
      this.$store.dispatch('bookmarks/toggleBeasiswa', this.beasiswa.id)
      this.$message({
        message: this.tersimpan ? this.$t('scholarship.savedToast', { name: this.beasiswa.nama }) : this.$t('scholarship.removedToast'),
        type: this.tersimpan ? 'success' : 'info'
      })
    },
    kunjungi () {
      this.$message(this.$t('scholarship.siteNote', { site: this.beasiswa.situs }))
    }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.hero { padding: 0; overflow: hidden; }
.cover { height: 88px; background: linear-gradient(120deg, var(--brand), #3fc9c0); }
.hero-isi { padding: 0 14px 14px; }

.logo-beasiswa {
  width: 64px;
  height: 64px;
  border-radius: var(--radius);
  background: var(--brand);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--card);
  margin-top: -32px;
  margin-bottom: 8px;
}

.pil-baris { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }

.aksi { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
.tombol-utama { flex: 1; min-height: 44px; min-width: 200px; }
.tombol-simpan { min-height: 44px; }

.paragraf { margin: 8px 0 0; font-size: 14.5px; }

.info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  font-size: 14px;
}

.daftar-titik { margin: 8px 0 0; padding-left: 20px; font-size: 14.5px; }
.daftar-titik li { margin-bottom: 6px; }

.daftar-centang { margin: 8px 0 0; padding: 0; list-style: none; font-size: 14.5px; }
.daftar-centang li { display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-start; }
.daftar-centang i { color: var(--brand); margin-top: 3px; }

.daftar-langkah { margin: 8px 0 0; padding: 0; list-style: none; font-size: 14.5px; }
.daftar-langkah li { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }

.nomor {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand-soft);
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
</style>

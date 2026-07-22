<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>{{ $t('common.back') }}</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!lembaga"
      ikon="el-icon-warning-outline"
      :judul="$t('institution.notFoundTitle')"
      :pesan="$t('institution.notFoundText')"
    >
      <el-button type="primary" @click="$router.push('/explore')">{{ $t('institution.notFoundAction') }}</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="cover"></div>
        <div class="hero-isi">
          <div class="logo">{{ lembaga.inisial }}</div>
          <h1 class="title-lg" data-content="true">{{ lembaga.nama }}</h1>
          <p class="muted"><span data-content="true">{{ lembaga.tipe }}</span> · <span data-content="true">{{ lembaga.kota }}</span>, {{ $t('country.' + lembaga.negaraKode) }}</p>

          <div class="pil-baris">
            <span class="pill">{{ $t('common.followers', { n: pengikut }) }}</span>
            <span v-if="lembaga.prodi > 0" class="pill">{{ $t('institution.programmes', { n: lembaga.prodi }) }}</span>
          </div>

          <div class="aksi">
            <el-button
              class="tombol-utama"
              :type="mengikuti ? 'default' : 'primary'"
              @click="toggleIkuti"
            >
              {{ mengikuti ? $t('common.unfollow') : $t('common.follow') }}
            </el-button>
            <el-button class="tombol-ikon" @click="belumTersedia">
              <i class="el-icon-share"></i> {{ $t('common.share') }}
            </el-button>
          </div>
        </div>
      </div>

      <el-tabs v-model="tab" class="tab-lembaga">
        <el-tab-pane :label="$t('institution.tabs.about')" name="tentang">
          <div class="card">
            <p class="title">{{ $t('common.about') }}</p>
            <p class="paragraf" data-content="true">{{ lembaga.deskripsi }}</p>
          </div>
          <div class="card">
            <p class="title">{{ $t('common.info') }}</p>
            <div class="info"><span class="muted">{{ $t('common.type') }}</span><span data-content="true">{{ lembaga.tipe }}</span></div>
            <div class="info"><span class="muted">{{ $t('common.location') }}</span><span><span data-content="true">{{ lembaga.kota }}</span>, {{ $t('country.' + lembaga.negaraKode) }}</span></div>
            <div class="info"><span class="muted">{{ $t('you.stats.followers') }}</span><span>{{ pengikut }}</span></div>
            <div v-if="lembaga.prodi > 0" class="info">
              <span class="muted">{{ $t('institution.programmesLabel') }}</span><span>{{ lembaga.prodi }}</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="$t('institution.tabs.members')" name="anggota">
          <BaseCard
            v-for="a in lembaga.anggota"
            :key="a.id"
            :inisial="a.inisial"
            :judul="a.nama"
            :subjudul="a.peran"
            bulat
          >
            <template slot="action">
              <el-button size="small" @click="belumTersedia">{{ $t('common.follow') }}</el-button>
            </template>
          </BaseCard>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import institutions from '@/mock/institutions.json'

export default {
  name: 'InstitutionDetailView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, lembaga: null, tab: 'tentang', mengikuti: false }
  },
  computed: {
    pengikut () {
      return this.lembaga ? this.lembaga.pengikut.toLocaleString('id-ID') : '0'
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
        this.lembaga = institutions.filter((i) => i.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    toggleIkuti () {
      this.mengikuti = !this.mengikuti
      this.$message({
        message: this.mengikuti ? this.$t('explore.nowFollowing', { name: this.lembaga.nama }) : this.$t('common.unfollow'),
        type: this.mengikuti ? 'success' : 'info'
      })
    },
    belumTersedia () { this.$message(this.$t('common.notAvailable')) }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.hero { padding: 0; overflow: hidden; }
.cover { height: 96px; background: linear-gradient(120deg, var(--brand), #3fc9c0); }
.hero-isi { padding: 0 14px 14px; }

.logo {
  width: 68px;
  height: 68px;
  border-radius: var(--radius);
  background: var(--brand);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--card);
  margin-top: -34px;
  margin-bottom: 8px;
}

.pil-baris { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }

.aksi { display: flex; gap: 8px; margin-top: 12px; }
.tombol-utama { flex: 1; min-height: 44px; }
.tombol-ikon { min-height: 44px; }

.tab-lembaga { margin-top: 14px; }
.tab-lembaga >>> .el-tabs__nav-wrap::after { height: 1px; background: var(--line); }
.tab-lembaga >>> .el-tabs__item { padding: 0 14px; }

.paragraf { margin: 8px 0 0; font-size: 14.5px; }

.info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}
.info:last-child { border-bottom: 0; }
</style>

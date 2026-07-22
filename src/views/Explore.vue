<template>
  <div class="screen">
    <div class="row jelajah-head">
      <h1 class="title-lg grow">Jelajah</h1>
      <router-link to="/events" class="tap tautan-acara">
        <i class="el-icon-date"></i><span>Acara</span>
      </router-link>
    </div>

    <SearchBar v-model="kueri" placeholder="Cari orang, komunitas, kampus, jurnal" />
    <FilterChips v-model="filter" :opsi="opsiFilter" />

    <CardSkeleton v-if="memuat" :jumlah="5" />

    <EmptyState
      v-else-if="hasil.length === 0"
      ikon="el-icon-search"
      judul="Nggak ketemu"
      pesan="Coba kata kunci lain atau ganti filternya."
    />

    <template v-else>
      <p class="muted hasil-info">{{ hasil.length }} hasil</p>
      <BaseCard
        v-for="item in hasil"
        :key="item.id"
        :inisial="item.inisial"
        :judul="item.nama"
        :subjudul="item.info"
        :bulat="item.tipe === 'orang'"
        :clickable="!!item.komunitasId"
        @click.native="buka(item)"
      >
        <template slot="meta">
          <span class="pill">{{ labelTipe[item.tipe] }}</span>
        </template>
        <template slot="action">
          <el-button
            size="small"
            :type="diikuti[item.id] ? 'default' : 'primary'"
            @click.stop="toggleIkuti(item)"
          >
            {{ diikuti[item.id] ? 'Batal' : item.aksi }}
          </el-button>
        </template>
      </BaseCard>
    </template>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import FilterChips from '@/components/FilterChips.vue'
import BaseCard from '@/components/BaseCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import exploreData from '@/mock/explore.json'

export default {
  name: 'ExploreView',
  components: { SearchBar, FilterChips, BaseCard, EmptyState, CardSkeleton },
  data () {
    return {
      memuat: true,
      kueri: '',
      filter: 'Semua',
      opsiFilter: ['Semua', 'Orang', 'Komunitas', 'Kampus', 'Jurnal'],
      labelTipe: { orang: 'Orang', komunitas: 'Komunitas', kampus: 'Kampus', jurnal: 'Jurnal' },
      data: [],
      diikuti: {}
    }
  },
  computed: {
    hasil () {
      const q = this.kueri.trim().toLowerCase()
      const f = this.filter.toLowerCase()
      return this.data.filter((item) => {
        const cocokFilter = this.filter === 'Semua' || item.tipe === f
        const cocokKueri = !q ||
          item.nama.toLowerCase().indexOf(q) !== -1 ||
          item.info.toLowerCase().indexOf(q) !== -1
        return cocokFilter && cocokKueri
      })
    }
  },
  created () {
    // kueri bisa datang dari search di top bar desktop
    if (this.$route.query.q) this.kueri = String(this.$route.query.q)
    this.timer = setTimeout(() => {
      this.data = exploreData
      this.memuat = false
    }, 600)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  watch: {
    '$route.query.q' (q) { this.kueri = q ? String(q) : '' }
  },
  methods: {
    buka (item) {
      if (item.komunitasId) this.$router.push('/community/' + item.komunitasId)
    },
    toggleIkuti (item) {
      const baru = !this.diikuti[item.id]
      this.$set(this.diikuti, item.id, baru)
      this.$message({
        message: baru ? (item.aksi === 'Gabung' ? 'Gabung ke ' : 'Mengikuti ') + item.nama : 'Batal, ' + item.nama,
        type: baru ? 'success' : 'info'
      })
    }
  }
}
</script>

<style scoped>
.jelajah-head { margin: 4px 2px 10px; }

.tautan-acara {
  color: var(--brand);
  font-weight: 600;
  font-size: 13.5px;
}
.hasil-info { margin: 2px 2px 8px; }
</style>

<template>
  <div class="screen">
    <div class="row beasiswa-head">
      <h1 class="title-lg grow">Beasiswa</h1>
      <span class="pill">{{ jumlahTersimpan }} tersimpan</span>
    </div>

    <SearchBar v-model="kueri" placeholder="Cari nama beasiswa atau negara" />

    <div class="filter-baris">
      <FilterChips v-model="jenjang" :opsi="opsiJenjang" />
      <FilterChips v-model="negara" :opsi="opsiNegara" />
      <FilterChips v-model="urutan" :opsi="opsiUrutan" />
    </div>

    <CardSkeleton v-if="memuat" :jumlah="5" />

    <EmptyState
      v-else-if="hasil.length === 0"
      ikon="el-icon-medal"
      judul="Belum ada beasiswa yang cocok"
      pesan="Coba longgarkan filternya, mungkin ada yang kelewat."
    >
      <el-button type="primary" @click="resetFilter">Reset filter</el-button>
    </EmptyState>

    <template v-else>
      <p class="muted hasil-info">{{ hasil.length }} beasiswa</p>

      <BaseCard
        v-for="b in hasil"
        :key="b.id"
        :inisial="b.inisial"
        :judul="b.nama"
        :subjudul="b.penyelenggara + ' · ' + b.cakupan"
        clickable
        @click.native="$router.push('/beasiswa/' + b.id)"
      >
        <template slot="meta">
          <span class="pill">{{ b.jenjang }}</span>
          <span class="pill">{{ b.negara }}</span>
          <span class="pill" :class="{ 'pill-warn': b.sisaHari <= 7 }">tutup {{ b.sisaHari }} hari lagi</span>
        </template>
        <template slot="action">
          <button
            class="tap simpan"
            :class="{ 'is-active': tersimpan(b.id) }"
            @click.stop="toggleSimpan(b)"
          >
            <i :class="tersimpan(b.id) ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
            <span>{{ tersimpan(b.id) ? 'Tersimpan' : 'Simpan' }}</span>
          </button>
        </template>
      </BaseCard>
    </template>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import FilterChips from '@/components/FilterChips.vue'
import BaseCard from '@/components/BaseCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import scholarships from '@/mock/scholarships.json'

export default {
  name: 'ScholarshipsView',
  components: { SearchBar, FilterChips, BaseCard, CardSkeleton, EmptyState },
  data () {
    return {
      memuat: true,
      data: [],
      kueri: '',
      jenjang: 'Semua jenjang',
      negara: 'Semua negara',
      urutan: 'Paling relevan',
      opsiJenjang: ['Semua jenjang', 'S1', 'S2', 'S3'],
      opsiNegara: ['Semua negara', 'Indonesia', 'Inggris', 'Australia', 'Jepang', 'Jerman', 'Amerika Serikat', 'Korea Selatan', 'Singapura'],
      opsiUrutan: ['Paling relevan', 'Deadline terdekat']
    }
  },
  computed: {
    jumlahTersimpan () { return this.$store.state.bookmarks.beasiswa.length },
    hasil () {
      const q = this.kueri.trim().toLowerCase()
      let list = this.data.filter((b) => {
        const cocokJenjang = this.jenjang === 'Semua jenjang' || b.jenjang === this.jenjang
        const cocokNegara = this.negara === 'Semua negara' || b.negara === this.negara
        const cocokKueri = !q ||
          b.nama.toLowerCase().indexOf(q) !== -1 ||
          b.negara.toLowerCase().indexOf(q) !== -1 ||
          b.penyelenggara.toLowerCase().indexOf(q) !== -1
        return cocokJenjang && cocokNegara && cocokKueri
      })
      if (this.urutan === 'Deadline terdekat') {
        list = list.slice().sort((a, b) => a.sisaHari - b.sisaHari)
      }
      return list
    }
  },
  created () {
    this.timer = setTimeout(() => {
      this.data = scholarships
      this.memuat = false
    }, 600)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    tersimpan (id) { return this.$store.getters['bookmarks/isBeasiswaTersimpan'](id) },
    toggleSimpan (b) {
      this.$store.dispatch('bookmarks/toggleBeasiswa', b.id)
      this.$message({
        message: this.tersimpan(b.id) ? 'Disimpan: ' + b.nama : 'Dihapus dari tersimpan',
        type: this.tersimpan(b.id) ? 'success' : 'info'
      })
    },
    resetFilter () {
      this.kueri = ''
      this.jenjang = 'Semua jenjang'
      this.negara = 'Semua negara'
      this.urutan = 'Paling relevan'
    }
  }
}
</script>

<style scoped>
.beasiswa-head { margin: 4px 2px 10px; }

/* tiga baris chip dirapatkan supaya kartu pertama tetap kelihatan tanpa scroll */
.filter-baris > * + * { margin-top: -6px; }
.filter-baris >>> .chips { padding-bottom: 6px; }

.hasil-info { margin: 2px 2px 8px; }

.simpan { flex-direction: column; gap: 0; font-size: 11px; width: 64px; }
.simpan i { font-size: 18px; }
</style>

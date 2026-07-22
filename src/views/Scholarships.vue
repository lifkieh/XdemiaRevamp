<template>
  <div class="screen">
    <div class="row beasiswa-head">
      <h1 class="title-lg grow">{{ $t('scholarship.title') }}</h1>
      <span class="pill">{{ $t('scholarship.savedCount', { n: jumlahTersimpan }) }}</span>
    </div>

    <SearchBar v-model="kueri" :placeholder="$t('scholarship.searchPlaceholder')" />

    <div class="filter-baris">
      <FilterChips v-model="jenjang" :opsi="opsiJenjang" :nilai="idJenjang" />
      <FilterChips v-model="negara" :opsi="opsiNegara" :nilai="idNegara" />
      <FilterChips v-model="urutan" :opsi="opsiUrutan" :nilai="idUrutan" />
    </div>

    <CardSkeleton v-if="memuat" :jumlah="5" />

    <EmptyState
      v-else-if="hasil.length === 0"
      ikon="el-icon-medal"
      :judul="$t('scholarship.emptyTitle')"
      :pesan="$t('scholarship.emptyText')"
    >
      <el-button type="primary" @click="resetFilter">{{ $t('scholarship.resetFilter') }}</el-button>
    </EmptyState>

    <template v-else>
      <p class="muted hasil-info">{{ $t('scholarship.count', { n: hasil.length }) }}</p>

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
          <span v-if="b.isNew" class="pill pill-new">{{ $t('common.new') }}</span>
          <span class="pill">{{ b.jenjang }}</span>
          <span class="pill">{{ $t('country.' + b.negaraKode) }}</span>
          <span class="pill" :class="{ 'pill-warn': b.sisaHari <= 7 }">{{ $t('common.daysLeft', { n: b.sisaHari }) }}</span>
        </template>
        <template slot="action">
          <button
            class="tap simpan"
            :class="{ 'is-active': tersimpan(b.id) }"
            @click.stop="toggleSimpan(b)"
          >
            <i :class="tersimpan(b.id) ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
            <span>{{ tersimpan(b.id) ? $t('common.saved') : $t('common.save') }}</span>
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
      jenjang: 'all',
      negara: 'all',
      urutan: 'relevan',
      idJenjang: ['all', 'S1', 'S2', 'S3'],
      idNegara: ['all', 'ID', 'GB', 'AU', 'JP', 'DE', 'US', 'KR', 'SG'],
      idUrutan: ['relevan', 'deadline']
    }
  },
  computed: {
    jumlahTersimpan () { return this.$store.state.bookmarks.beasiswa.length },
    opsiJenjang () { return this.idJenjang.map((id) => (id === 'all' ? this.$t('scholarship.levelAll') : id)) },
    opsiNegara () { return this.idNegara.map((id) => (id === 'all' ? this.$t('scholarship.countryAll') : this.$t('country.' + id))) },
    opsiUrutan () { return [this.$t('scholarship.sortRelevant'), this.$t('scholarship.sortDeadline')] },
    hasil () {
      const q = this.kueri.trim().toLowerCase()
      let list = this.data.filter((b) => {
        const cocokJenjang = this.jenjang === 'all' || b.jenjang === this.jenjang
        const cocokNegara = this.negara === 'all' || b.negaraKode === this.negara
        const cocokKueri = !q ||
          b.nama.toLowerCase().indexOf(q) !== -1 ||
          this.$t('country.' + b.negaraKode).toLowerCase().indexOf(q) !== -1 ||
          b.penyelenggara.toLowerCase().indexOf(q) !== -1
        return cocokJenjang && cocokNegara && cocokKueri
      })
      if (this.urutan === 'deadline') {
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
        message: this.tersimpan(b.id) ? this.$t('scholarship.savedToast', { name: b.nama }) : this.$t('scholarship.removedToast'),
        type: this.tersimpan(b.id) ? 'success' : 'info'
      })
    },
    resetFilter () {
      this.kueri = ''
      this.jenjang = 'all'
      this.negara = 'all'
      this.urutan = 'relevan'
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

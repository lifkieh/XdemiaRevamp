<template>
  <div class="screen">
    <div class="row jelajah-head">
      <h1 class="title-lg grow">{{ $t('explore.title') }}</h1>
    </div>

    <!-- Di desktop kotak pencarian ada di top bar, jadi di sini cukup untuk mobile -->
    <SearchBar
      v-if="!isDesktop"
      v-model="kueri"
      :placeholder="$t('explore.searchPlaceholder')"
    />
    <FilterChips :value="labelFilter" :opsi="opsiFilter" bungkus @input="pilihFilter" />

    <CardSkeleton v-if="memuat" :jumlah="5" />

    <EmptyState
      v-else-if="hasil.length === 0"
      ikon="el-icon-search"
      :judul="$t('explore.emptyTitle')"
      :pesan="$t('explore.emptyText')"
    />

    <template v-else>
      <div class="row info-baris">
        <p class="muted grow">{{ $t('common.results', { n: hasil.length }) }}</p>
        <router-link v-if="filter === 'jurnal'" to="/jurnal" class="tap tautan-semua">
          <i class="el-icon-notebook-2"></i><span>{{ $t('explore.allJournals') }}</span>
        </router-link>
        <router-link v-else-if="filter === 'acara'" to="/events" class="tap tautan-semua">
          <i class="el-icon-date"></i><span>{{ $t('explore.allEvents') }}</span>
        </router-link>
      </div>

      <!-- Jurnal tampil sebagai tabel supaya mudah dibandingkan -->
      <div v-if="filter === 'jurnal'" class="card tabel-bungkus">
        <el-table :data="barisJurnal" style="width: 100%" @row-click="bukaJurnal">
          <el-table-column prop="nama" :label="$t('explore.table.name')" sortable min-width="170">
            <template slot-scope="baris">
              <span class="nama-jurnal">{{ baris.row.nama }}</span>
              <p class="muted sub">{{ baris.row.penerbit }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="jumlahTulisan" :label="$t('explore.table.articles')" sortable width="100" align="right" />
          <el-table-column prop="terbit" :label="$t('explore.table.published')" sortable width="140" />
        </el-table>
      </div>

      <BaseCard
        v-for="item in hasil"
        v-else
        :key="item.id"
        :inisial="item.inisial"
        :judul="item.nama"
        :subjudul="item.info"
        :bulat="item.tipe === 'orang'"
        clickable
        @click.native="buka(item)"
      >
        <template slot="meta">
          <span class="pill">{{ $t('explore.types.' + item.tipe) }}</span>
        </template>
        <template slot="action">
          <!-- artikel dan acara langsung dibuka, tidak diikuti -->
          <el-button
            v-if="item.tipe === 'artikel' || item.tipe === 'acara'"
            size="small"
            type="primary"
            @click.stop="buka(item)"
          >
            {{ aksiLabel(item) }}
          </el-button>
          <el-button
            v-else
            size="small"
            :type="diikuti[item.id] ? 'default' : 'primary'"
            @click.stop="toggleIkuti(item)"
          >
            {{ diikuti[item.id] ? $t('common.cancel') : aksiLabel(item) }}
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
import journals from '@/mock/journals.json'

export default {
  name: 'ExploreView',
  components: { SearchBar, FilterChips, BaseCard, EmptyState, CardSkeleton },
  data () {
    return {
      memuat: true,
      kueri: '',
      filter: 'all',
      idFilter: ['all', 'orang', 'komunitas', 'kampus', 'organisasi', 'jurnal', 'artikel', 'acara'],
      data: [],
      diikuti: {}
    }
  },
  computed: {
    opsiFilter () { return this.idFilter.map((id) => this.$t('explore.filters.' + id)) },
    labelFilter () { return this.$t('explore.filters.' + this.filter) },
    hasil () {
      const q = this.kueri.trim().toLowerCase()
      return this.data.filter((item) => {
        const cocokFilter = this.filter === 'all' || item.tipe === this.filter
        const cocokKueri = !q ||
          item.nama.toLowerCase().indexOf(q) !== -1 ||
          item.info.toLowerCase().indexOf(q) !== -1
        return cocokFilter && cocokKueri
      })
    },
    isDesktop () { return this.$store.getters['layout/isDesktop'] },
    // tabel jurnal memakai data lengkap, disaring mengikuti hasil chip + kueri
    barisJurnal () {
      const idTampil = this.hasil.map((h) => h.jurnalId)
      return journals.filter((j) => idTampil.indexOf(j.id) !== -1)
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
    clearTimeout(this.timerKueri)
  },
  watch: {
    // ?q= adalah sumber kebenaran: diisi search top bar (desktop)
    // maupun kotak search di halaman ini (mobile)
    '$route.query.q' (q) {
      const nilai = q ? String(q) : ''
      if (nilai !== this.kueri) this.kueri = nilai
    },
    kueri (nilai) {
      clearTimeout(this.timerKueri)
      this.timerKueri = setTimeout(() => {
        const sekarang = this.$route.query.q ? String(this.$route.query.q) : ''
        if (sekarang === nilai) return
        const query = { ...this.$route.query }
        if (nilai) query.q = nilai
        else delete query.q
        this.$router.replace({ path: '/explore', query }).catch(() => {})
      }, 250)
    }
  },
  methods: {
    pilihFilter (label) {
      const i = this.opsiFilter.indexOf(label)
      if (i !== -1) this.filter = this.idFilter[i]
    },
    // aksi kartu mengikuti jenisnya, bukan teks dari data
    aksiLabel (item) {
      if (item.tipe === 'artikel') return this.$t('common.read')
      if (item.tipe === 'acara') return this.$t('common.view')
      if (item.tipe === 'komunitas') return this.$t('common.join')
      return this.$t('common.follow')
    },
    // tiap kartu menuju halaman detail sesuai jenisnya
    buka (item) {
      if (item.komunitasId) this.$router.push('/community/' + item.komunitasId)
      else if (item.orangId) this.$router.push('/profil/' + item.orangId)
      else if (item.kampusId) this.$router.push('/kampus/' + item.kampusId)
      else if (item.organisasiId) this.$router.push('/organisasi/' + item.organisasiId)
      else if (item.jurnalId) this.$router.push('/jurnal/' + item.jurnalId)
      else if (item.artikelId) this.$router.push('/artikel/' + item.artikelId)
      else if (item.acaraId) this.$router.push('/acara/' + item.acaraId)
    },
    bukaJurnal (baris) { this.$router.push('/jurnal/' + baris.id) },
    toggleIkuti (item) {
      const baru = !this.diikuti[item.id]
      this.$set(this.diikuti, item.id, baru)
      this.$message({
        message: baru
          ? (item.tipe === 'komunitas'
            ? this.$t('explore.joined', { name: item.nama })
            : this.$t('explore.nowFollowing', { name: item.nama }))
          : this.$t('explore.cancelled', { name: item.nama }),
        type: baru ? 'success' : 'info'
      })
    }
  }
}
</script>

<style scoped>
.jelajah-head { margin: 4px 2px 10px; }

.tautan-semua {
  color: var(--brand);
  font-weight: 600;
  font-size: 13.5px;
}

.info-baris { margin: 2px 2px 8px; }

.tabel-bungkus { padding: 4px; overflow-x: auto; }
.nama-jurnal { font-weight: 600; font-size: 14px; }
.sub { margin: 2px 0 0; font-size: 12px; }

.tabel-bungkus >>> .el-table__row { cursor: pointer; }
.tabel-bungkus >>> .el-table th { background: var(--bg); font-weight: 700; color: var(--text); }
.tabel-bungkus >>> .el-table td,
.tabel-bungkus >>> .el-table th { padding: 10px 0; }
</style>

<template>
  <div class="screen">
    <div class="row jelajah-head">
      <h1 class="title-lg grow">Jelajah</h1>
      <router-link to="/events" class="tap tautan-atas">
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
      <div class="row info-baris">
        <p class="muted grow">{{ hasil.length }} hasil</p>
        <router-link v-if="filter === 'Jurnal'" to="/jurnal" class="tap tautan-atas">
          <i class="el-icon-notebook-2"></i><span>Semua jurnal</span>
        </router-link>
      </div>

      <!-- Jurnal tampil sebagai tabel supaya mudah dibandingkan -->
      <div v-if="filter === 'Jurnal'" class="card tabel-bungkus">
        <el-table :data="barisJurnal" style="width: 100%" @row-click="bukaJurnal">
          <el-table-column prop="nama" label="Nama jurnal" sortable min-width="170">
            <template slot-scope="baris">
              <span class="nama-jurnal">{{ baris.row.nama }}</span>
              <p class="muted sub">{{ baris.row.penerbit }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="jumlahTulisan" label="Tulisan" sortable width="100" align="right" />
          <el-table-column prop="terbit" label="Terbit" sortable width="140" />
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
import journals from '@/mock/journals.json'

export default {
  name: 'ExploreView',
  components: { SearchBar, FilterChips, BaseCard, EmptyState, CardSkeleton },
  data () {
    return {
      memuat: true,
      kueri: '',
      filter: 'Semua',
      opsiFilter: ['Semua', 'Orang', 'Komunitas', 'Kampus', 'Organisasi', 'Jurnal'],
      labelTipe: {
        orang: 'Orang',
        komunitas: 'Komunitas',
        kampus: 'Kampus',
        organisasi: 'Organisasi',
        jurnal: 'Jurnal'
      },
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
    },
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
  },
  watch: {
    '$route.query.q' (q) { this.kueri = q ? String(q) : '' }
  },
  methods: {
    // tiap kartu menuju halaman detail sesuai jenisnya
    buka (item) {
      if (item.komunitasId) this.$router.push('/community/' + item.komunitasId)
      else if (item.orangId) this.$router.push('/profil/' + item.orangId)
      else if (item.kampusId) this.$router.push('/kampus/' + item.kampusId)
      else if (item.organisasiId) this.$router.push('/organisasi/' + item.organisasiId)
      else if (item.jurnalId) this.$router.push('/jurnal/' + item.jurnalId)
    },
    bukaJurnal (baris) { this.$router.push('/jurnal/' + baris.id) },
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

.tautan-atas {
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

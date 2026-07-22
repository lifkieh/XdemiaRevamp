<template>
  <div class="screen">
    <div class="row jurnal-head">
      <div class="grow">
        <h1 class="title-lg">Jurnal</h1>
        <p class="muted">Kumpulan jurnal terbuka dari kampus dan komunitas.</p>
      </div>
    </div>

    <SearchBar v-model="kueri" placeholder="Cari nama jurnal, penerbit, atau bidang" />

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <EmptyState
      v-else-if="hasil.length === 0"
      ikon="el-icon-notebook-2"
      judul="Jurnal nggak ketemu"
      pesan="Coba kata kunci lain."
    />

    <template v-else>
      <p class="muted hasil-info">{{ hasil.length }} jurnal</p>

      <div class="card tabel-bungkus">
        <el-table
          :data="hasil"
          style="width: 100%"
          :default-sort="{ prop: 'jumlahTulisan', order: 'descending' }"
          @row-click="buka"
        >
          <el-table-column prop="nama" label="Nama jurnal" sortable min-width="180">
            <template slot-scope="baris">
              <span class="nama-jurnal">{{ baris.row.nama }}</span>
              <p class="muted sub">{{ baris.row.penerbit }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="bidang" label="Bidang" sortable width="130" />
          <el-table-column prop="jumlahTulisan" label="Tulisan" sortable width="110" align="right" />
          <el-table-column prop="terbit" label="Terbit" sortable width="150" />
        </el-table>
      </div>

      <p class="muted petunjuk">Klik salah satu baris untuk melihat daftar tulisannya.</p>
    </template>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import journals from '@/mock/journals.json'

export default {
  name: 'JournalsView',
  components: { SearchBar, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, kueri: '', data: [] }
  },
  computed: {
    hasil () {
      const q = this.kueri.trim().toLowerCase()
      if (!q) return this.data
      return this.data.filter((j) =>
        j.nama.toLowerCase().indexOf(q) !== -1 ||
        j.penerbit.toLowerCase().indexOf(q) !== -1 ||
        j.bidang.toLowerCase().indexOf(q) !== -1
      )
    }
  },
  created () {
    this.timer = setTimeout(() => {
      this.data = journals
      this.memuat = false
    }, 600)
  },
  beforeDestroy () { clearTimeout(this.timer) },
  methods: {
    buka (baris) { this.$router.push('/jurnal/' + baris.id) }
  }
}
</script>

<style scoped>
.jurnal-head { margin: 4px 2px 12px; }
.jurnal-head .title-lg { margin-bottom: 2px; }

.hasil-info { margin: 2px 2px 8px; }

.tabel-bungkus { padding: 4px; overflow-x: auto; }

.nama-jurnal { font-weight: 600; font-size: 14px; }
.sub { margin: 2px 0 0; font-size: 12px; }

.petunjuk { text-align: center; font-size: 12px; margin-top: 4px; }

.tabel-bungkus >>> .el-table__row { cursor: pointer; }
.tabel-bungkus >>> .el-table th { background: var(--bg); font-weight: 700; color: var(--text); }
.tabel-bungkus >>> .el-table td,
.tabel-bungkus >>> .el-table th { padding: 10px 0; }
</style>

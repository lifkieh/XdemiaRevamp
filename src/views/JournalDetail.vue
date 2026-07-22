<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>Kembali</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!jurnal"
      ikon="el-icon-warning-outline"
      judul="Jurnal nggak ketemu"
      pesan="Mungkin sudah dihapus atau tautannya salah."
    >
      <el-button type="primary" @click="$router.push('/jurnal')">Lihat semua jurnal</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="row row-top">
          <div class="thumb logo">{{ jurnal.inisial }}</div>
          <div class="grow">
            <h1 class="title-lg">{{ jurnal.nama }}</h1>
            <p class="muted">{{ jurnal.penerbit }}</p>
          </div>
        </div>

        <p class="paragraf">{{ jurnal.deskripsi }}</p>

        <div class="info"><span class="muted">ISSN</span><span>{{ jurnal.issn }}</span></div>
        <div class="info"><span class="muted">Bidang</span><span class="pill">{{ jurnal.bidang }}</span></div>
        <div class="info"><span class="muted">Jadwal terbit</span><span>{{ jurnal.terbit }}</span></div>
        <div class="info"><span class="muted">Jumlah tulisan</span><span>{{ jurnal.jumlahTulisan }}</span></div>

        <div class="aksi">
          <el-button
            class="tombol-utama"
            :type="mengikuti ? 'default' : 'primary'"
            @click="toggleIkuti"
          >
            {{ mengikuti ? 'Berhenti mengikuti' : 'Ikuti jurnal' }}
          </el-button>
        </div>
      </div>

      <section class="section">
        <div class="section-head">
          <h2 class="title">Daftar tulisan</h2>
          <span class="muted">{{ jurnal.tulisan.length }} terbaru</span>
        </div>

        <div class="card tabel-bungkus">
          <el-table :data="jurnal.tulisan" style="width: 100%">
            <el-table-column prop="judul" label="Judul" sortable min-width="200">
              <template slot-scope="baris">
                <span class="judul-tulisan">{{ baris.row.judul }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deskripsi" label="Deskripsi" min-width="180">
              <template slot-scope="baris">
                <span class="muted">{{ baris.row.deskripsi }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="terbit" label="Terbit" sortable width="130" />
          </el-table>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import journals from '@/mock/journals.json'

export default {
  name: 'JournalDetailView',
  components: { CardSkeleton, EmptyState },
  data () {
    return { memuat: true, jurnal: null, mengikuti: false }
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
        this.jurnal = journals.filter((j) => j.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    toggleIkuti () {
      this.mengikuti = !this.mengikuti
      this.$message({
        message: this.mengikuti ? 'Mengikuti ' + this.jurnal.nama : 'Berhenti mengikuti',
        type: this.mengikuti ? 'success' : 'info'
      })
    }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.logo { width: 56px; height: 56px; background: var(--brand); color: #fff; font-size: 18px; }

.paragraf { margin: 12px 0; font-size: 14.5px; }

.info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}
.info:last-of-type { border-bottom: 0; }

.aksi { margin-top: 12px; }
.tombol-utama { width: 100%; min-height: 44px; }

.tabel-bungkus { padding: 4px; overflow-x: auto; }
.judul-tulisan { font-weight: 600; font-size: 14px; }

.tabel-bungkus >>> .el-table th { background: var(--bg); font-weight: 700; color: var(--text); }
.tabel-bungkus >>> .el-table td,
.tabel-bungkus >>> .el-table th { padding: 10px 0; }
</style>

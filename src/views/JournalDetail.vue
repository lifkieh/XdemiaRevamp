<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>{{ $t('common.back') }}</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!jurnal"
      ikon="el-icon-warning-outline"
      :judul="$t('journal.notFoundTitle')"
      :pesan="$t('journal.notFoundText')"
    >
      <el-button type="primary" @click="$router.push('/jurnal')">{{ $t('journal.notFoundAction') }}</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="row row-top">
          <div class="thumb logo">{{ jurnal.inisial }}</div>
          <div class="grow">
            <h1 class="title-lg" data-content="true">{{ jurnal.nama }}</h1>
            <p class="muted" data-content="true">{{ jurnal.penerbit }}</p>
          </div>
        </div>

        <p class="paragraf" data-content="true">{{ jurnal.deskripsi }}</p>

        <div class="info"><span class="muted">{{ $t('journal.issn') }}</span><span>{{ jurnal.issn }}</span></div>
        <div class="info"><span class="muted">{{ $t('journal.table.field') }}</span><span class="pill">{{ jurnal.bidang }}</span></div>
        <div class="info"><span class="muted">{{ $t('journal.schedule') }}</span><span>{{ $t('journalSchedule.' + jurnal.terbitKunci) }}</span></div>
        <div class="info"><span class="muted">{{ $t('journal.articleCount') }}</span><span>{{ jurnal.jumlahTulisan }}</span></div>

        <div class="aksi">
          <el-button
            class="tombol-utama"
            :type="mengikuti ? 'default' : 'primary'"
            @click="toggleIkuti"
          >
            {{ mengikuti ? $t('common.unfollow') : $t('journal.followJournal') }}
          </el-button>
        </div>
      </div>

      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('journal.articleList') }}</h2>
          <span class="muted">{{ $t('journal.latest', { n: jurnal.tulisan.length }) }}</span>
        </div>

        <div class="card tabel-bungkus">
          <el-table :data="jurnal.tulisan" style="width: 100%">
            <el-table-column prop="judul" :label="$t('journal.table.title')" sortable min-width="200">
              <template slot-scope="baris">
                <span class="judul-tulisan" data-content="true">{{ baris.row.judul }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deskripsi" :label="$t('journal.table.description')" min-width="180">
              <template slot-scope="baris">
                <span class="muted" data-content="true">{{ baris.row.deskripsi }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="terbitIso" :label="$t('journal.table.published')" sortable width="130">
              <template slot-scope="baris">{{ $bulanTahun(baris.row.terbitIso) }}</template>
            </el-table-column>
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
        message: this.mengikuti ? this.$t('explore.nowFollowing', { name: this.jurnal.nama }) : this.$t('common.unfollow'),
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

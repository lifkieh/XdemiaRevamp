<template>
  <div class="screen">
    <div class="row drive-head">
      <div class="grow">
        <h1 class="title-lg">Drive</h1>
        <p class="muted">{{ data.length }} berkas · {{ totalUkuran }} terpakai</p>
      </div>
      <el-button type="primary" size="small" class="tombol-unggah" @click="unggah">
        <i class="el-icon-upload2"></i> Unggah
      </el-button>
    </div>

    <SearchBar v-model="kueri" placeholder="Cari nama berkas" />

    <el-tabs v-model="tab" class="tab-drive">
      <el-tab-pane name="semua">
        <span slot="label"><i class="el-icon-folder"></i> Semua file</span>
      </el-tab-pane>
      <el-tab-pane name="dibagikan">
        <span slot="label"><i class="el-icon-share"></i> Dibagikan</span>
      </el-tab-pane>
    </el-tabs>

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <EmptyState
      v-else-if="hasil.length === 0"
      ikon="el-icon-folder-opened"
      judul="Nggak ada berkas"
      pesan="Coba kata kunci lain atau ganti tabnya."
    />

    <template v-else>
      <p class="muted hasil-info">{{ hasil.length }} berkas</p>

      <div class="card tabel-bungkus">
        <el-table :data="hasil" style="width: 100%" :default-sort="{ prop: 'tanggal', order: 'descending' }">
          <el-table-column prop="nama" label="Nama" sortable min-width="200">
            <template slot-scope="baris">
              <div class="sel-nama">
                <span class="tanda">{{ labelJenis(baris.row.jenis) }}</span>
                <span class="nama-berkas">{{ baris.row.nama }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ukuranByte" label="Ukuran" sortable width="110" align="right">
            <template slot-scope="baris">{{ baris.row.ukuran }}</template>
          </el-table-column>
          <el-table-column prop="tanggal" label="Tanggal" sortable width="140" />
          <el-table-column prop="jenis" label="Tipe" sortable width="110">
            <template slot-scope="baris">{{ namaJenis(baris.row.jenis) }}</template>
          </el-table-column>
          <el-table-column prop="pemilik" label="Pemilik" sortable width="150" />
          <el-table-column label="Aksi" width="110" align="right">
            <template slot-scope="baris">
              <el-button size="mini" @click="unduh(baris.row)">Unduh</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import drive from '@/mock/drive.json'

export default {
  name: 'DriveView',
  components: { SearchBar, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, tab: 'semua', kueri: '', data: [] }
  },
  computed: {
    hasil () {
      const q = this.kueri.trim().toLowerCase()
      return this.data.filter((f) => {
        const cocokTab = this.tab === 'semua' || f.dibagikan
        const cocokKueri = !q || f.nama.toLowerCase().indexOf(q) !== -1 || f.pemilik.toLowerCase().indexOf(q) !== -1
        return cocokTab && cocokKueri
      })
    },
    totalUkuran () {
      const byte = this.data.reduce((n, f) => n + f.ukuranByte, 0)
      return (byte / 1048576).toFixed(1).replace('.', ',') + ' MB'
    }
  },
  created () {
    this.timer = setTimeout(() => {
      this.data = drive
      this.memuat = false
    }, 600)
  },
  beforeDestroy () { clearTimeout(this.timer) },
  methods: {
    labelJenis (jenis) {
      const peta = { pdf: 'PDF', word: 'DOC', tabel: 'XLS', gambar: 'IMG', audio: 'MP3', video: 'VID', arsip: 'ZIP' }
      return peta[jenis] || 'FILE'
    },
    namaJenis (jenis) {
      const peta = { pdf: 'Dokumen', word: 'Dokumen', tabel: 'Tabel', gambar: 'Gambar', audio: 'Audio', video: 'Video', arsip: 'Arsip' }
      return peta[jenis] || 'Berkas'
    },
    unggah () { this.$message('Unggah berkas belum aktif di prototipe ini.') },
    unduh (f) { this.$message({ message: 'Mengunduh ' + f.nama + ' (contoh)', type: 'success' }) }
  }
}
</script>

<style scoped>
.drive-head { margin: 4px 2px 10px; }
.drive-head .title-lg { margin-bottom: 2px; }
.tombol-unggah { min-height: 44px; }

.tab-drive { margin-bottom: 8px; }
.tab-drive >>> .el-tabs__nav-wrap::after { height: 1px; background: var(--line); }
.tab-drive >>> .el-tabs__item { padding: 0 14px; }
.tab-drive >>> .el-tabs__content { display: none; }

.hasil-info { margin: 2px 2px 8px; }

.tabel-bungkus { padding: 4px; overflow-x: auto; }

.sel-nama { display: flex; align-items: center; gap: 8px; }

.tanda {
  flex: none;
  background: var(--brand-soft);
  color: var(--brand-dark);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
}

.nama-berkas { font-weight: 600; font-size: 13.5px; }

.tabel-bungkus >>> .el-table th { background: var(--bg); font-weight: 700; color: var(--text); }
.tabel-bungkus >>> .el-table td,
.tabel-bungkus >>> .el-table th { padding: 10px 0; }
</style>

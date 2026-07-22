<template>
  <div class="screen screen-komunitas">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>Kembali</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!komunitas"
      ikon="el-icon-warning-outline"
      judul="Komunitas nggak ketemu"
      pesan="Mungkin sudah dihapus atau tautannya salah."
    >
      <el-button type="primary" @click="$router.push('/explore')">Cari komunitas lain</el-button>
    </EmptyState>

    <template v-else>
      <div class="card profil">
        <div class="cover"></div>
        <div class="profil-isi">
          <div class="logo-komunitas">{{ komunitas.inisial }}</div>
          <h1 class="title-lg">{{ komunitas.nama }}</h1>
          <p class="muted">{{ jumlahAnggota }} anggota · {{ komunitas.tipe }}</p>

          <div class="aksi">
            <el-button
              class="tombol-gabung"
              :type="gabung ? 'default' : 'primary'"
              @click="toggleGabung"
            >
              {{ gabung ? 'Keluar komunitas' : 'Gabung' }}
            </el-button>
            <el-button class="tombol-ikon" @click="belumTersedia">
              <i class="el-icon-share"></i> Bagikan
            </el-button>
          </div>
        </div>
      </div>

      <el-tabs v-model="tab" class="tab-komunitas">
        <el-tab-pane label="Tentang" name="tentang">
          <div class="card">
            <p class="title">Tentang komunitas</p>
            <p class="deskripsi">{{ komunitas.deskripsi }}</p>
          </div>

          <div class="card">
            <p class="title">Info</p>
            <div class="info">
              <span class="muted">Dibuat</span>
              <span>{{ komunitas.dibuat }}</span>
            </div>
            <div class="info">
              <span class="muted">Tipe</span>
              <span class="pill">{{ komunitas.tipe }}</span>
            </div>
            <div class="info">
              <span class="muted">Anggota</span>
              <span>{{ jumlahAnggota }}</span>
            </div>
            <div class="info">
              <span class="muted">Aturan</span>
              <span class="aturan">{{ komunitas.aturan }}</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Diskusi" name="diskusi">
          <div v-for="d in komunitas.diskusi" :key="d.id" class="card">
            <div class="row row-top">
              <div class="thumb thumb-round">{{ d.inisial }}</div>
              <div class="grow">
                <p class="title">{{ d.penulis }}</p>
                <p class="muted">{{ d.waktu }}</p>
              </div>
            </div>
            <p class="post-konten">{{ d.konten }}</p>
            <div class="card-foot">
              <button class="tap" @click="belumTersedia">
                <i class="el-icon-star-off"></i><span>Suka {{ d.suka }}</span>
              </button>
              <button class="tap" @click="belumTersedia">
                <i class="el-icon-chat-line-round"></i><span>Komentar {{ d.komentar }}</span>
              </button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Anggota" name="anggota">
          <BaseCard
            v-for="a in komunitas.daftarAnggota"
            :key="a.id"
            :inisial="a.inisial"
            :judul="a.nama"
            :subjudul="a.peran"
            bulat
          >
            <template slot="action">
              <el-button size="small" @click="belumTersedia">Ikuti</el-button>
            </template>
          </BaseCard>
        </el-tab-pane>

        <el-tab-pane label="File" name="file">
          <BaseCard
            v-for="b in komunitas.berkas"
            :key="b.id"
            :inisial="labelJenis(b.jenis)"
            :judul="b.nama"
            :subjudul="b.ukuran + ' · ' + b.waktu"
          >
            <template slot="action">
              <el-button size="small" @click="belumTersedia">Unduh</el-button>
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
import communities from '@/mock/communities.json'

export default {
  name: 'CommunityDetailView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, komunitas: null, tab: 'tentang', gabung: false }
  },
  computed: {
    jumlahAnggota () {
      return this.komunitas ? this.komunitas.anggota.toLocaleString('id-ID') : '0'
    }
  },
  created () {
    this.muat()
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  watch: {
    '$route.params.id' () { this.muat() }
  },
  methods: {
    muat () {
      this.memuat = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.komunitas = communities.filter((k) => k.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    labelJenis (jenis) {
      const peta = { pdf: 'PDF', word: 'DOC', excel: 'XLS', video: 'VID', desain: 'FIG', arsip: 'ZIP', kode: 'SQL' }
      return peta[jenis] || 'FILE'
    },
    toggleGabung () {
      this.gabung = !this.gabung
      this.$message({
        message: this.gabung ? 'Kamu gabung ke ' + this.komunitas.nama : 'Kamu keluar dari ' + this.komunitas.nama,
        type: this.gabung ? 'success' : 'info'
      })
    },
    belumTersedia () { this.$message('Belum aktif di prototipe ini.') }
  }
}
</script>

<style scoped>
.screen-komunitas { padding-top: 12px; }

.kembali { margin: 0 0 6px -8px; }

.profil { padding: 0; overflow: hidden; }

.cover { height: 96px; background: linear-gradient(120deg, var(--brand), #3fc9c0); }

.profil-isi { padding: 0 14px 14px; }

.logo-komunitas {
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

.aksi { display: flex; gap: 8px; margin-top: 12px; }
.tombol-gabung { flex: 1; min-height: 44px; }
.tombol-ikon { min-height: 44px; }

.tab-komunitas { margin-top: 14px; }
.tab-komunitas >>> .el-tabs__nav-wrap::after { height: 1px; background: var(--line); }
.tab-komunitas >>> .el-tabs__item { padding: 0 14px; }

.deskripsi { margin: 8px 0 0; font-size: 14.5px; }

.info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}

.info:last-child { border-bottom: 0; }
.info .aturan { text-align: right; max-width: 62%; }

.post-konten { margin: 10px 0 0; font-size: 14.5px; }

.card-foot {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
}
</style>

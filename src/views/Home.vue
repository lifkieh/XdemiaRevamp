<template>
  <div class="screen">
    <!-- Composer ringkas: satu aksi utama di layar ini -->
    <div class="card composer">
      <div class="row">
        <div class="thumb thumb-round composer-avatar">{{ inisial }}</div>
        <button class="composer-input grow" @click="tulisPostingan">
          Apa yang kamu pelajari hari ini?
        </button>
      </div>
    </div>

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <EmptyState
      v-else-if="feed.length === 0"
      ikon="el-icon-chat-line-square"
      judul="Feed kamu masih kosong"
      pesan="Ikuti orang atau komunitas dulu biar ada yang muncul di sini."
    >
      <el-button type="primary" @click="$router.push('/explore')">Cari yang seru</el-button>
    </EmptyState>

    <template v-else>
      <div v-for="item in feed" :key="item.id">
        <!-- Dorongan belajar -->
        <div v-if="item.tipe === 'learning_nudge'" class="card nudge">
          <div class="row row-top">
            <div class="thumb nudge-thumb"><i class="el-icon-reading"></i></div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.deskripsi }}</p>
              <el-progress
                v-if="item.progress > 0"
                :percentage="item.progress"
                :stroke-width="6"
                :show-text="false"
                class="nudge-progress"
              />
            </div>
          </div>
          <div class="card-foot">
            <el-button type="primary" size="small" @click="$router.push('/learn/' + item.materiId)">
              {{ item.progress > 0 ? 'Lanjutkan' : 'Mulai belajar' }}
            </el-button>
          </div>
        </div>

        <!-- Info beasiswa -->
        <div v-else-if="item.tipe === 'scholarship_alert'" class="card alert">
          <div class="row row-top">
            <div class="thumb alert-thumb"><i class="el-icon-medal"></i></div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.deskripsi }}</p>
            </div>
          </div>
          <div class="card-foot">
            <el-button type="primary" size="small" @click="$router.push('/scholarships')">Lihat beasiswa</el-button>
          </div>
        </div>

        <!-- Update komunitas -->
        <div v-else-if="item.tipe === 'community_update'" class="card">
          <div class="row row-top">
            <div class="thumb">{{ item.judul.charAt(0) }}</div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.deskripsi }}</p>
              <span class="pill">{{ item.anggota }}</span>
            </div>
          </div>
        </div>

        <!-- Artikel / jurnal -->
        <div v-else-if="item.tipe === 'article'" class="card">
          <div class="row row-top">
            <div class="thumb"><i class="el-icon-document"></i></div>
            <div class="grow">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.sumber }} · {{ item.baca }}</p>
            </div>
          </div>
          <p class="article-ringkasan">{{ item.ringkasan }}</p>
          <div class="card-foot">
            <button class="tap" @click="belumTersedia">
              <i class="el-icon-reading"></i><span>Baca</span>
            </button>
            <button class="tap" @click="simpanArtikel(item)">
              <i class="el-icon-collection-tag"></i><span>Simpan</span>
            </button>
          </div>
        </div>

        <!-- Postingan orang -->
        <div v-else class="card">
          <div class="row row-top">
            <div class="thumb thumb-round">{{ item.inisial }}</div>
            <div class="grow">
              <p class="title">{{ item.penulis }}</p>
              <p class="muted">{{ item.peran }} · {{ item.waktu }}</p>
            </div>
          </div>
          <p class="post-konten">{{ item.konten }}</p>
          <div class="card-foot">
            <button class="tap" :class="{ 'is-active': disukai[item.id] }" @click="toggleSuka(item)">
              <i :class="disukai[item.id] ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
              <span>Suka {{ jumlahSuka(item) }}</span>
            </button>
            <button class="tap" @click="belumTersedia">
              <i class="el-icon-chat-line-round"></i><span>Komentar {{ item.komentar }}</span>
            </button>
            <button class="tap" @click="belumTersedia">
              <i class="el-icon-share"></i><span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import feedData from '@/mock/feed.json'

export default {
  name: 'HomeView',
  components: { CardSkeleton, EmptyState },
  data () {
    return {
      memuat: true,
      feed: [],
      disukai: {}
    }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] }
  },
  created () {
    // Simulasi ambil data dari server
    this.timer = setTimeout(() => {
      this.feed = feedData
      this.memuat = false
    }, 600)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    jumlahSuka (item) {
      return item.suka + (this.disukai[item.id] ? 1 : 0)
    },
    toggleSuka (item) {
      this.$set(this.disukai, item.id, !this.disukai[item.id])
    },
    simpanArtikel (item) {
      this.$message({ message: 'Disimpan: ' + item.judul, type: 'success' })
    },
    tulisPostingan () {
      this.$message('Tulis postingan belum aktif di prototipe ini.')
    },
    belumTersedia () {
      this.$message('Belum aktif di prototipe ini.')
    }
  }
}
</script>

<style scoped>
.composer { padding: 10px 12px; }

.composer-avatar { background: var(--brand); color: #fff; width: 40px; height: 40px; }

.composer-input {
  min-height: 44px;
  text-align: left;
  border: 0;
  background: var(--bg);
  border-radius: 999px;
  padding: 0 16px;
  color: var(--muted);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
}

.composer-input:hover { color: var(--brand); }

.card-foot {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
}

.post-konten {
  margin: 10px 0 0;
  font-size: 14.5px;
  white-space: pre-line;
}

.article-ringkasan {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--muted);
}

.nudge { border-color: var(--brand); background: linear-gradient(180deg, var(--brand-soft), var(--card) 60%); }
.nudge-thumb { background: var(--brand); color: #fff; font-size: 22px; }
.nudge-progress { margin-top: 8px; }

.alert-thumb { background: #fff2e6; color: #c76a10; font-size: 22px; }
</style>

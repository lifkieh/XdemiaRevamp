<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>Kembali</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!orang"
      ikon="el-icon-warning-outline"
      judul="Profil nggak ketemu"
      pesan="Mungkin akunnya sudah tidak aktif."
    >
      <el-button type="primary" @click="$router.push('/explore')">Cari orang lain</el-button>
    </EmptyState>

    <template v-else>
      <div class="card profil">
        <div class="cover"></div>
        <div class="profil-isi">
          <div class="avatar-besar">{{ orang.inisial }}</div>
          <h1 class="title-lg">{{ orang.nama }}</h1>
          <p class="muted">{{ orang.handle }} · {{ orang.peran }}</p>
          <p class="bio">{{ orang.bio }}</p>

          <div class="statistik">
            <div class="stat"><b>{{ orang.stats.postingan }}</b><span class="muted">Postingan</span></div>
            <div class="stat"><b>{{ orang.stats.pengikut }}</b><span class="muted">Pengikut</span></div>
            <div class="stat"><b>{{ orang.stats.mengikuti }}</b><span class="muted">Mengikuti</span></div>
          </div>

          <div class="aksi">
            <el-button
              class="tombol-utama"
              :type="mengikuti ? 'default' : 'primary'"
              @click="toggleIkuti"
            >
              {{ mengikuti ? 'Mengikuti' : 'Ikuti' }}
            </el-button>
            <el-button class="tombol-pesan" @click="pesan">
              <i class="el-icon-chat-dot-round"></i> Pesan
            </el-button>
          </div>
        </div>
      </div>

      <el-tabs v-model="tab" class="tab-orang">
        <el-tab-pane label="Postingan" name="postingan">
          <div v-for="p in orang.postingan" :key="p.id" class="card">
            <p class="muted">{{ p.waktu }}</p>
            <p class="post-konten">{{ p.konten }}</p>
            <div class="card-foot">
              <span class="tap"><i class="el-icon-star-off"></i><span>Suka {{ p.suka }}</span></span>
              <span class="tap"><i class="el-icon-chat-line-round"></i><span>Komentar {{ p.komentar }}</span></span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Materi" name="materi">
          <EmptyState
            v-if="materi.length === 0"
            ikon="el-icon-reading"
            judul="Belum ada materi"
            pesan="Orang ini belum membagikan materi."
          />
          <BaseCard
            v-for="m in materi"
            v-else
            :key="m.id"
            :inisial="m.judul.charAt(0)"
            :judul="m.judul"
            :subjudul="m.penyedia + ' · ' + m.durasi"
            clickable
            @click.native="$router.push('/materi/' + m.id)"
          >
            <template slot="meta">
              <span class="pill">{{ m.jenis === 'kursus' ? 'Kursus' : 'Materi' }}</span>
            </template>
          </BaseCard>
        </el-tab-pane>

        <el-tab-pane label="Komunitas" name="komunitas">
          <BaseCard
            v-for="k in komunitas"
            :key="k.id"
            :inisial="k.inisial"
            :judul="k.nama"
            :subjudul="k.anggota.toLocaleString('id-ID') + ' anggota · ' + k.tipe"
            clickable
            @click.native="$router.push('/community/' + k.id)"
          />
        </el-tab-pane>

        <el-tab-pane label="Acara" name="acara">
          <BaseCard
            v-for="a in acara"
            :key="a.id"
            :inisial="a.inisial"
            :judul="a.judul"
            :subjudul="a.tanggal + ' · ' + a.waktu"
            clickable
            @click.native="$router.push('/acara/' + a.id)"
          >
            <template slot="meta">
              <span class="pill">{{ a.lokasi }}</span>
            </template>
          </BaseCard>
        </el-tab-pane>

        <el-tab-pane label="Jaringan" name="jaringan">
          <BaseCard
            v-for="n in orang.jaringan"
            :key="n.id"
            :inisial="n.inisial"
            :judul="n.nama"
            :subjudul="n.peran"
            bulat
            clickable
            @click.native="bukaOrang(n.nama)"
          >
            <template slot="action">
              <el-button size="small" @click.stop="belumTersedia">Ikuti</el-button>
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
import people from '@/mock/people.json'
import courses from '@/mock/courses.json'
import communities from '@/mock/communities.json'
import events from '@/mock/events.json'

export default {
  name: 'PersonProfileView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, orang: null, tab: 'postingan', mengikuti: false }
  },
  computed: {
    materi () {
      if (!this.orang) return []
      return courses.filter((c) => this.orang.materi.indexOf(c.id) !== -1)
    },
    komunitas () {
      if (!this.orang) return []
      return communities.filter((k) => this.orang.komunitas.indexOf(k.id) !== -1)
    },
    acara () {
      if (!this.orang) return []
      return events.filter((e) => this.orang.acara.indexOf(e.id) !== -1)
    }
  },
  created () { this.muat() },
  beforeDestroy () { clearTimeout(this.timer) },
  watch: {
    '$route.params.id' () { this.muat() }
  },
  methods: {
    muat () {
      this.memuat = true
      this.tab = 'postingan'
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.orang = people.filter((o) => o.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    bukaOrang (nama) {
      const target = people.filter((o) => o.nama === nama)[0]
      if (target) this.$router.push('/profil/' + target.id)
    },
    toggleIkuti () {
      this.mengikuti = !this.mengikuti
      this.$message({
        message: this.mengikuti ? 'Mengikuti ' + this.orang.nama : 'Berhenti mengikuti',
        type: this.mengikuti ? 'success' : 'info'
      })
    },
    pesan () { this.$message('Buka Chat dari tombol di atas untuk mulai mengobrol.') },
    belumTersedia () { this.$message('Belum aktif di prototipe ini.') }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.profil { padding: 0; overflow: hidden; }
.cover { height: 88px; background: linear-gradient(120deg, var(--brand), #3fc9c0); }
.profil-isi { padding: 0 14px 14px; }

.avatar-besar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--brand);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--card);
  margin-top: -36px;
  margin-bottom: 8px;
}

.bio { margin: 8px 0 0; font-size: 14px; }

.statistik {
  display: flex;
  gap: 18px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.stat { display: flex; flex-direction: column; }
.stat b { font-size: 16px; }
.stat span { font-size: 12px; }

.aksi { display: flex; gap: 8px; margin-top: 12px; }
.tombol-utama { flex: 1; min-height: 44px; }
.tombol-pesan { min-height: 44px; }

.tab-orang { margin-top: 14px; }
.tab-orang >>> .el-tabs__nav-wrap::after { height: 1px; background: var(--line); }
.tab-orang >>> .el-tabs__item { padding: 0 10px; font-size: 13.5px; }

.post-konten { margin: 6px 0 0; font-size: 14.5px; }

.card-foot {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
}
</style>

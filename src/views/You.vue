<template>
  <div class="screen screen-you">
    <div class="profil card">
      <div class="cover"></div>
      <div class="profil-isi">
        <div class="avatar-besar">{{ profil.initial }}</div>
        <h1 class="title-lg">{{ profil.name }}</h1>
        <p class="muted">{{ profil.handle }} · {{ profil.campus }}</p>
        <p class="bio">{{ profil.bio }}</p>

        <div class="statistik">
          <div class="stat"><b>{{ profil.stats.postingan }}</b><span class="muted">Postingan</span></div>
          <div class="stat"><b>{{ profil.stats.pengikut }}</b><span class="muted">Pengikut</span></div>
          <div class="stat"><b>{{ profil.stats.mengikuti }}</b><span class="muted">Mengikuti</span></div>
        </div>
      </div>
    </div>

    <el-tabs v-model="tab" class="tab-kamu">
      <el-tab-pane label="Postingan" name="postingan">
        <CardSkeleton v-if="memuat" :jumlah="2" />
        <template v-else>
          <div v-for="p in profil.posts" :key="p.id" class="card">
            <p class="muted">{{ p.waktu }}</p>
            <p class="post-konten">{{ p.konten }}</p>
            <div class="card-foot">
              <span class="tap"><i class="el-icon-star-off"></i><span>Suka {{ p.suka }}</span></span>
              <span class="tap"><i class="el-icon-chat-line-round"></i><span>Komentar {{ p.komentar }}</span></span>
            </div>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane label="Materi Saya" name="materi">
        <CardSkeleton v-if="memuat" :jumlah="2" />
        <EmptyState
          v-else-if="materiSaya.length === 0"
          ikon="el-icon-reading"
          judul="Belum ada materi dimulai"
          pesan="Mulai satu materi di tab Belajar."
        >
          <el-button type="primary" @click="$router.push('/learn')">Lihat materi</el-button>
        </EmptyState>
        <BaseCard
          v-for="m in materiSaya"
          v-else
          :key="m.id"
          :inisial="m.judul.charAt(0)"
          :judul="m.judul"
          :subjudul="m.penyedia"
          clickable
          @click.native="$router.push('/learn/' + m.id)"
        >
          <el-progress :percentage="m.progress" :stroke-width="6" :show-text="false" class="bar" />
        </BaseCard>
      </el-tab-pane>

      <el-tab-pane label="Tersimpan" name="tersimpan">
        <EmptyState
          v-if="tersimpan.length === 0"
          ikon="el-icon-collection-tag"
          judul="Belum ada yang disimpan"
          pesan="Tekan Simpan di beasiswa atau materi yang menarik."
        />
        <BaseCard
          v-for="t in tersimpan"
          v-else
          :key="t.id"
          :inisial="t.inisial"
          :judul="t.judul"
          :subjudul="t.subjudul"
        >
          <template slot="meta">
            <span class="pill">{{ t.label }}</span>
          </template>
        </BaseCard>
      </el-tab-pane>

      <el-tab-pane label="File" name="file">
        <BaseCard
          v-for="f in profil.files"
          :key="f.id"
          :inisial="labelJenis(f.jenis)"
          :judul="f.nama"
          :subjudul="f.ukuran + ' · ' + f.waktu"
        >
          <template slot="meta">
            <span class="pill"><i :class="ikonJenis(f.jenis)"></i> {{ namaJenis(f.jenis) }}</span>
          </template>
          <template slot="action">
            <el-button size="small" @click="belumTersedia">Unduh</el-button>
          </template>
        </BaseCard>
      </el-tab-pane>

      <el-tab-pane label="Pengaturan" name="pengaturan">
        <div class="card">
          <button
            v-for="item in menuSetelan"
            :key="item.id"
            class="baris-setelan"
            @click="belumTersedia"
          >
            <div class="thumb setelan-ikon"><i :class="item.ikon"></i></div>
            <div class="grow kiri">
              <p class="title">{{ item.judul }}</p>
              <p class="muted">{{ item.keterangan }}</p>
            </div>
            <i class="el-icon-arrow-right panah"></i>
          </button>
        </div>

        <div class="card">
          <div class="setelan">
            <div class="grow">
              <p class="title">Pengingat belajar harian</p>
              <p class="muted">Biar streak kamu nggak putus.</p>
            </div>
            <el-switch v-model="setelan.pengingat" active-color="#17a2a2" />
          </div>
          <div class="setelan">
            <div class="grow">
              <p class="title">Info beasiswa baru</p>
              <p class="muted">Kabar kalau ada beasiswa yang cocok.</p>
            </div>
            <el-switch v-model="setelan.beasiswa" active-color="#17a2a2" />
          </div>
        </div>

        <el-button class="keluar" @click="belumTersedia">
          <i class="el-icon-switch-button"></i> Keluar akun
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import courses from '@/mock/courses.json'
import scholarships from '@/mock/scholarships.json'

export default {
  name: 'YouView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return {
      memuat: true,
      tab: 'postingan',
      setelan: { pengingat: true, beasiswa: true },
      menuSetelan: [
        { id: 's-1', judul: 'Ubah profil', keterangan: 'Nama, bio, foto, dan kampus', ikon: 'el-icon-edit' },
        { id: 's-2', judul: 'Privasi', keterangan: 'Siapa yang bisa lihat aktivitas kamu', ikon: 'el-icon-lock' },
        { id: 's-3', judul: 'Notifikasi', keterangan: 'Atur kabar yang mau kamu terima', ikon: 'el-icon-bell' },
        { id: 's-4', judul: 'Bahasa', keterangan: 'Bahasa Indonesia', ikon: 'el-icon-chat-line-square' },
        { id: 's-5', judul: 'Bantuan', keterangan: 'Pertanyaan umum dan lapor masalah', ikon: 'el-icon-question' }
      ]
    }
  },
  computed: {
    profil () { return this.$store.state.user.profil },
    materiSaya () { return courses.filter((c) => c.progress > 0) },
    tersimpan () {
      const idBeasiswa = this.$store.state.bookmarks.beasiswa
      const idMateri = this.$store.state.bookmarks.materi
      const dariBeasiswa = scholarships
        .filter((s) => idBeasiswa.indexOf(s.id) !== -1)
        .map((s) => ({ id: s.id, inisial: s.inisial, judul: s.nama, subjudul: s.penyelenggara, label: 'Beasiswa' }))
      const dariMateri = courses
        .filter((c) => idMateri.indexOf(c.id) !== -1)
        .map((c) => ({ id: c.id, inisial: c.judul.charAt(0), judul: c.judul, subjudul: c.penyedia, label: 'Materi' }))
      return dariBeasiswa.concat(dariMateri)
    }
  },
  created () {
    this.timer = setTimeout(() => { this.memuat = false }, 500)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    labelJenis (jenis) {
      const peta = { pdf: 'PDF', word: 'DOC', tabel: 'CSV', gambar: 'IMG', audio: 'MP3' }
      return peta[jenis] || 'FILE'
    },
    namaJenis (jenis) {
      const peta = { pdf: 'Dokumen', word: 'Dokumen', tabel: 'Tabel', gambar: 'Gambar', audio: 'Audio' }
      return peta[jenis] || 'Berkas'
    },
    ikonJenis (jenis) {
      const peta = {
        pdf: 'el-icon-document',
        word: 'el-icon-document',
        tabel: 'el-icon-s-grid',
        gambar: 'el-icon-picture-outline',
        audio: 'el-icon-headset'
      }
      return peta[jenis] || 'el-icon-folder'
    },
    belumTersedia () { this.$message('Belum aktif di prototipe ini.') }
  }
}
</script>

<style scoped>
.screen-you { padding-top: 0; }

.profil { padding: 0; overflow: hidden; margin-top: 12px; }

.cover {
  height: 88px;
  background: linear-gradient(120deg, var(--brand), #3fc9c0);
}

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

.tab-kamu { margin-top: 14px; }
.tab-kamu >>> .el-tabs__nav-wrap::after { height: 1px; background: var(--line); }
.tab-kamu >>> .el-tabs__item { padding: 0 9px; font-size: 13.5px; }
.tab-kamu >>> .el-tabs__nav-prev,
.tab-kamu >>> .el-tabs__nav-next { display: none; }
.tab-kamu >>> .el-tabs__nav-scroll { padding: 0 2px; }

.post-konten { margin: 6px 0 0; font-size: 14.5px; }

.card-foot {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
}

.bar { margin-top: 10px; }

.setelan {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  min-height: 44px;
}

.setelan:last-child { border-bottom: 0; }

.baris-setelan {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: none;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.baris-setelan:last-child { border-bottom: 0; }
.baris-setelan:hover .title { color: var(--brand); }

.setelan-ikon { width: 38px; height: 38px; font-size: 17px; }

.panah { color: var(--muted); flex: none; }

.keluar { width: 100%; min-height: 44px; color: #c0392b; }
</style>

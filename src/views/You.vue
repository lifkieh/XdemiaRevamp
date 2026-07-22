<template>
  <div class="screen screen-you">
    <div class="profil card">
      <div class="cover"></div>
      <div class="profil-isi">
        <div class="avatar-besar">{{ profil.initial }}</div>
        <h1 class="title-lg" data-content="true">{{ profil.name }}</h1>
        <p class="muted">{{ profil.handle }} · {{ profil.Institute }}</p>
        <p class="bio" data-content="true">{{ profil.bio }}</p>

        <div class="statistik">
          <div class="stat"><b>{{ profil.stats.postingan }}</b><span class="muted">{{ $t('you.stats.posts') }}</span></div>
          <div class="stat"><b>{{ profil.stats.pengikut }}</b><span class="muted">{{ $t('you.stats.followers') }}</span></div>
          <div class="stat"><b>{{ profil.stats.mengikuti }}</b><span class="muted">{{ $t('you.stats.following') }}</span></div>
        </div>
      </div>
    </div>

    <!-- Pintasan ke fitur yang tidak muat di navigasi bawah -->
    <div class="pintasan">
      <router-link v-for="p in pintasan" :key="p.rute" :to="p.rute" class="pintas">
        <i :class="p.ikon"></i>
        <span>{{ p.label }}</span>
      </router-link>
    </div>

    <el-tabs v-model="tab" class="tab-kamu">
      <el-tab-pane :label="$t('you.tabs.posts')" name="postingan">
        <CardSkeleton v-if="memuat" :jumlah="2" />
        <template v-else>
          <div v-for="p in profil.posts" :key="p.id" class="card">
            <p class="muted">{{ $waktuRelatif(p.waktu) }}</p>
            <p class="post-konten" data-content="true">{{ p.konten }}</p>
            <div class="card-foot">
              <span class="tap"><i class="el-icon-star-off"></i><span>{{ $t('common.like') }} {{ p.suka }}</span></span>
              <span class="tap"><i class="el-icon-chat-line-round"></i><span>{{ $t('common.comment') }} {{ p.komentar }}</span></span>
            </div>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane :label="$t('you.tabs.courses')" name="materi">
        <CardSkeleton v-if="memuat" :jumlah="2" />
        <EmptyState
          v-else-if="materiSaya.length === 0"
          ikon="el-icon-reading"
          :judul="$t('you.emptyCoursesTitle')"
          :pesan="$t('you.emptyCoursesText')"
        >
          <el-button type="primary" @click="$router.push('/learn')">{{ $t('you.emptyCoursesAction') }}</el-button>
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

      <el-tab-pane :label="$t('you.tabs.saved')" name="tersimpan">
        <EmptyState
          v-if="tersimpan.length === 0"
          ikon="el-icon-collection-tag"
          :judul="$t('you.emptySavedTitle')"
          :pesan="$t('you.emptySavedText')"
        />
        <BaseCard
          v-for="t in tersimpan"
          v-else
          :key="t.label + t.id"
          :inisial="t.inisial"
          :judul="t.judul"
          :subjudul="t.subjudul"
          clickable
          @click.native="$router.push(t.rute)"
        >
          <template slot="meta">
            <span class="pill">{{ t.label }}</span>
          </template>
        </BaseCard>
      </el-tab-pane>

      <el-tab-pane :label="$t('you.tabs.files')" name="file">
        <div class="card ringkasan-drive">
          <div class="row">
            <div class="thumb drive-ikon"><i class="el-icon-folder-opened"></i></div>
            <div class="grow">
              <p class="title">{{ $t('you.driveTitle') }}</p>
              <p class="muted">{{ $t('you.driveText', { n: profil.files.length }) }}</p>
            </div>
            <el-button size="small" type="primary" @click="$router.push('/drive')">{{ $t('you.openDrive') }}</el-button>
          </div>
        </div>

        <BaseCard
          v-for="f in profil.files"
          :key="f.id"
          :inisial="labelJenis(f.jenis)"
          :judul="f.nama"
          :subjudul="$ukuran(f.ukuranByte) + ' · ' + $waktuRelatif(f.waktu)"
        >
          <template slot="meta">
            <span class="pill"><i :class="ikonJenis(f.jenis)"></i> {{ namaJenis(f.jenis) }}</span>
          </template>
          <template slot="action">
            <el-button size="small" @click="belumTersedia">{{ $t('common.download') }}</el-button>
          </template>
        </BaseCard>
      </el-tab-pane>

      <el-tab-pane :label="$t('you.tabs.settings')" name="pengaturan">
        <div class="card">
          <button
            v-for="item in menuSetelan"
            :key="item.id"
            class="baris-setelan"
            @click="bukaSetelan(item)"
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
              <p class="title">{{ $t('you.dailyReminder') }}</p>
              <p class="muted">{{ $t('you.dailyReminderSub') }}</p>
            </div>
            <el-switch v-model="setelan.pengingat" active-color="#17a2a2" />
          </div>
          <div class="setelan">
            <div class="grow">
              <p class="title">{{ $t('you.scholarshipAlerts') }}</p>
              <p class="muted">{{ $t('you.scholarshipAlertsSub') }}</p>
            </div>
            <el-switch v-model="setelan.beasiswa" active-color="#17a2a2" />
          </div>
        </div>

        <el-button class="keluar" @click="belumTersedia">
          <i class="el-icon-switch-button"></i> {{ $t('you.signOut') }}
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
import articles from '@/mock/articles.json'
import events from '@/mock/events.json'

export default {
  name: 'YouView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return {
      memuat: true,
      tab: 'postingan',
      setelan: { pengingat: true, beasiswa: true },
      kunciPintasan: ['events', 'cart', 'drive', 'journals', 'settings']
    }
  },
  computed: {
    profil () { return this.$store.state.user.profil },
    pintasan () {
      const rute = { events: '/events', cart: '/keranjang', drive: '/drive', journals: '/jurnal', settings: '/pengaturan' }
      const ikon = {
        events: 'el-icon-date',
        cart: 'el-icon-shopping-cart-2',
        drive: 'el-icon-folder',
        journals: 'el-icon-notebook-2',
        settings: 'el-icon-setting'
      }
      return this.kunciPintasan.map((k) => ({ rute: rute[k], ikon: ikon[k], label: this.$t('nav.' + k) }))
    },
    menuSetelan () {
      return [
        { id: 's-1', judul: this.$t('you.menu.editProfile'), keterangan: this.$t('you.menu.editProfileSub'), ikon: 'el-icon-edit' },
        { id: 's-2', judul: this.$t('you.menu.privacy'), keterangan: this.$t('you.menu.privacySub'), ikon: 'el-icon-lock' },
        { id: 's-3', judul: this.$t('you.menu.notifications'), keterangan: this.$t('you.menu.notificationsSub'), ikon: 'el-icon-bell' },
        { id: 's-4', judul: this.$t('you.menu.language'), keterangan: this.$t('you.menu.languageSub'), ikon: 'el-icon-chat-line-square' },
        { id: 's-5', judul: this.$t('you.menu.help'), keterangan: this.$t('you.menu.helpSub'), ikon: 'el-icon-question' }
      ]
    },
    materiSaya () { return courses.filter((c) => c.progress > 0) },
    // Tersimpan menampung empat jenis isi sekaligus
    tersimpan () {
      const b = this.$store.state.bookmarks
      const dariBeasiswa = scholarships
        .filter((s) => b.beasiswa.indexOf(s.id) !== -1)
        .map((s) => ({ id: s.id, inisial: s.inisial, judul: s.nama, subjudul: s.penyelenggara, label: this.$t('you.labels.scholarship'), rute: '/beasiswa/' + s.id }))
      const dariMateri = courses
        .filter((c) => b.materi.indexOf(c.id) !== -1)
        .map((c) => ({ id: c.id, inisial: c.judul.charAt(0), judul: c.judul, subjudul: c.penyedia, label: c.jenis === 'kursus' ? this.$t('you.labels.class') : this.$t('you.labels.course'), rute: '/materi/' + c.id }))
      const dariArtikel = articles
        .filter((a) => b.artikel.indexOf(a.id) !== -1)
        .map((a) => ({ id: a.id, inisial: a.inisial, judul: a.judul, subjudul: a.penulis + ' · ' + this.$t('common.readTime', { n: a.menitBaca }), label: this.$t('you.labels.article'), rute: '/artikel/' + a.id }))
      const dariAcara = events
        .filter((e) => b.acara.indexOf(e.id) !== -1)
        .map((e) => ({ id: e.id, inisial: e.inisial, judul: e.judul, subjudul: this.$tanggal(e.tanggalIso, true) + ' · ' + this.$jam(e.jamMulai), label: this.$t('you.labels.event'), rute: '/acara/' + e.id }))
      return dariBeasiswa.concat(dariMateri, dariArtikel, dariAcara)
    }
  },
  created () {
    // pintasan bisa membuka tab tertentu, mis. /you?tab=tersimpan
    this.pilihTabDariRute()
    this.timer = setTimeout(() => { this.memuat = false }, 500)
  },
  watch: {
    '$route.query.tab' () { this.pilihTabDariRute() }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    pilihTabDariRute () {
      const sah = ['postingan', 'materi', 'tersimpan', 'file', 'pengaturan']
      const t = this.$route.query.tab
      if (t && sah.indexOf(String(t)) !== -1) this.tab = String(t)
    },
    bukaSetelan (item) {
      if (item.id === 's-5') {
        this.$message(this.$t('you.helpNote'))
        return
      }
      this.$router.push('/pengaturan')
    },
    labelJenis (jenis) {
      const peta = { pdf: 'PDF', word: 'DOC', tabel: 'CSV', gambar: 'IMG', audio: 'MP3' }
      return peta[jenis] || 'FILE'
    },
    namaJenis (jenis) {
      const peta = { pdf: 'document', word: 'document', tabel: 'sheet', gambar: 'image', audio: 'audio' }
      return this.$t('you.fileTypes.' + (peta[jenis] || 'file'))
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
    belumTersedia () { this.$message(this.$t('common.notAvailable')) }
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

.pintasan {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.pintasan::-webkit-scrollbar { display: none; }

.pintas {
  flex: none;
  min-width: 76px;
  min-height: 64px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}

.pintas i { font-size: 19px; color: var(--brand); }
.pintas:hover { border-color: var(--brand); color: var(--brand); }

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

.ringkasan-drive { border-color: var(--brand); background: var(--brand-soft); }
.drive-ikon { width: 42px; height: 42px; background: var(--brand); color: #fff; font-size: 19px; }

.panah { color: var(--muted); flex: none; }

.keluar { width: 100%; min-height: 44px; color: #c0392b; }
</style>

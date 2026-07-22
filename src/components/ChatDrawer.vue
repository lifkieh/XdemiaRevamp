<template>
  <OverlayPanel :terbuka="terbuka" kelas="chat-drawer" @tutup="$emit('tutup')">
    <div class="drawer-isi">
      <header class="drawer-head">
        <button class="tap" @click="kembali">
          <i class="el-icon-arrow-left"></i>
          <span>{{ aktif ? $t('chat.list') : $t('common.close') }}</span>
        </button>
        <div v-if="aktif" class="grow drawer-lawan" @click="lihatProfil">
          <div class="thumb thumb-round drawer-avatar">{{ aktif.inisial }}</div>
          <div class="drawer-lawan-teks">
            <p class="title drawer-judul" data-content="true">{{ aktif.nama }}</p>
            <p class="muted drawer-status">{{ $t('chat.online') }}</p>
          </div>
        </div>
        <p v-else class="title grow drawer-judul">{{ $t('chat.title') }}</p>
        <button v-if="!aktif" class="tap tombol-baru" @click="komposerTerbuka = true">
          <i class="el-icon-edit"></i><span>{{ $t('chat.new') }}</span>
        </button>
      </header>

      <!-- Daftar percakapan -->
      <template v-if="!aktif">
        <FilterChips v-model="tab" :opsi="opsiTab" :nilai="idTab" class="tab-chat" />

        <div class="daftar">
          <EmptyState
            v-if="daftar.length === 0"
            ikon="el-icon-chat-dot-round"
            :judul="$t('chat.emptyTitle')"
            :pesan="$t('chat.emptyText')"
          />

          <button
            v-for="c in daftar"
            v-else
            :key="c.id"
            class="percakapan"
            @click="bukaChat(c)"
          >
            <div class="thumb" :class="c.tipe === 'grup' ? '' : 'thumb-round'">{{ c.inisial }}</div>
            <div class="grow teks">
              <p class="title" data-content="true">{{ c.nama }}</p>
              <p class="muted clamp-1" data-content="true">
                <i v-if="cuplikanIkon(c)" :class="cuplikanIkon(c)" class="cuplikan-ikon"></i>{{ c.cuplikan }}
              </p>
            </div>
            <div class="kanan">
              <span class="muted">{{ waktuChat(c.waktu) }}</span>
              <span v-if="c.belumDibaca" class="badge">{{ c.belumDibaca }}</span>
            </div>
          </button>
        </div>
      </template>

      <!-- Jendela chat -->
      <div v-else class="jendela">
        <div ref="gulir" class="pesan-area">
          <div
            v-for="p in aktif.pesan"
            :key="p.id"
            class="bubble-baris"
            :class="p.dari === 'saya' ? 'kanan-baris' : 'kiri-baris'"
          >
            <!-- teks biasa -->
            <div v-if="p.jenis === 'teks' || !p.jenis" class="bubble" :class="p.dari === 'saya' ? 'bubble-saya' : 'bubble-mereka'">
              <p data-content="true">{{ p.teks }}</p>
              <span class="waktu">{{ waktuChat(p.waktu) }}</span>
            </div>

            <!-- gambar -->
            <div v-else-if="p.jenis === 'gambar'" class="bubble bubble-media" :class="p.dari === 'saya' ? 'bubble-saya' : 'bubble-mereka'">
              <div class="media-preview"><i class="el-icon-picture"></i></div>
              <p v-if="p.teks" data-content="true" class="media-caption">{{ p.teks }}</p>
              <span class="waktu">{{ waktuChat(p.waktu) }}</span>
            </div>

            <!-- video -->
            <div v-else-if="p.jenis === 'video'" class="bubble bubble-media" :class="p.dari === 'saya' ? 'bubble-saya' : 'bubble-mereka'">
              <div class="media-preview media-video"><i class="el-icon-video-play"></i></div>
              <p v-if="p.teks" data-content="true" class="media-caption">{{ p.teks }}</p>
              <span class="waktu">{{ waktuChat(p.waktu) }}</span>
            </div>

            <!-- berkas -->
            <div v-else-if="p.jenis === 'file'" class="bubble bubble-file" :class="p.dari === 'saya' ? 'bubble-saya' : 'bubble-mereka'">
              <div class="file-chip">
                <span class="file-ikon"><i class="el-icon-document"></i></span>
                <span class="grow file-info">
                  <span class="file-nama" data-content="true">{{ p.berkas.nama }}</span>
                  <span class="file-ukuran">{{ p.berkas.ukuran }}</span>
                </span>
                <i class="el-icon-download file-unduh"></i>
              </div>
              <span class="waktu">{{ waktuChat(p.waktu) }}</span>
            </div>

            <!-- bagikan konten dari Xdemia -->
            <button
              v-else-if="p.jenis === 'bagikan'"
              class="bubble bubble-share"
              :class="p.dari === 'saya' ? 'bubble-saya-share' : 'bubble-mereka-share'"
              @click="bukaBagikan(p.bagikan)"
            >
              <div class="share-card">
                <div class="share-ikon" :class="'share-' + p.bagikan.tipe"><i :class="ikonBagikan(p.bagikan.tipe)"></i></div>
                <div class="share-teks">
                  <span class="share-tag">{{ $t('chat.shareType.' + p.bagikan.tipe) }}</span>
                  <span class="share-judul" data-content="true">{{ p.bagikan.judul }}</span>
                  <span class="share-sub" data-content="true">{{ p.bagikan.sub }}</span>
                </div>
              </div>
              <p v-if="p.teks" data-content="true" class="media-caption share-caption">{{ p.teks }}</p>
              <span class="waktu">{{ waktuChat(p.waktu) }}</span>
            </button>
          </div>
        </div>

        <!-- pratinjau lampiran sebelum dikirim -->
        <div v-if="lampiran" class="lampiran-preview">
          <div v-if="lampiran.jenis === 'bagikan'" class="share-card share-card-mini">
            <div class="share-ikon" :class="'share-' + lampiran.bagikan.tipe"><i :class="ikonBagikan(lampiran.bagikan.tipe)"></i></div>
            <div class="share-teks">
              <span class="share-tag">{{ $t('chat.shareType.' + lampiran.bagikan.tipe) }}</span>
              <span class="share-judul" data-content="true">{{ lampiran.bagikan.judul }}</span>
            </div>
          </div>
          <div v-else class="lampiran-generik">
            <i :class="lampiran.jenis === 'gambar' ? 'el-icon-picture' : lampiran.jenis === 'video' ? 'el-icon-video-camera' : 'el-icon-document'"></i>
            <span data-content="true">{{ lampiran.label }}</span>
          </div>
          <button class="tap hapus-lampiran" :aria-label="$t('common.close')" @click="lampiran = null">
            <i class="el-icon-close"></i>
          </button>
        </div>

        <!-- toolbar lampiran -->
        <div class="toolbar-lampiran">
          <button class="tap opsi-lampiran" @click="tambahLampiran('gambar')"><i class="el-icon-picture-outline"></i></button>
          <button class="tap opsi-lampiran" @click="tambahLampiran('video')"><i class="el-icon-video-camera"></i></button>
          <button class="tap opsi-lampiran" @click="tambahLampiran('file')"><i class="el-icon-folder-add"></i></button>
          <button class="tap opsi-lampiran" @click="bagikanTerbuka = true"><i class="el-icon-share"></i></button>
        </div>

        <form class="kirim" @submit.prevent="kirim">
          <el-input v-model="draf" :placeholder="$t('chat.messagePlaceholder')" />
          <el-button type="primary" native-type="submit" class="tombol-kirim">
            <i class="el-icon-position"></i>
          </el-button>
        </form>
      </div>

      <!-- Chat baru: pilih penerima -->
      <div v-if="komposerTerbuka" class="komposer">
        <header class="drawer-head">
          <button class="tap" @click="komposerTerbuka = false">
            <i class="el-icon-arrow-left"></i><span>{{ $t('common.cancel') }}</span>
          </button>
          <p class="title grow drawer-judul">{{ $t('chat.newTitle') }}</p>
        </header>

        <div class="daftar">
          <p class="muted petunjuk">{{ $t('chat.pickRecipient') }}</p>
          <button
            v-for="o in penerima"
            :key="o.id"
            class="percakapan"
            @click="mulaiChat(o)"
          >
            <div class="thumb thumb-round">{{ o.inisial }}</div>
            <div class="grow teks">
              <p class="title" data-content="true">{{ o.nama }}</p>
              <p class="muted clamp-1" data-content="true">{{ o.peran }}</p>
            </div>
            <i class="el-icon-arrow-right muted"></i>
          </button>
        </div>
      </div>

      <!-- Bagikan dari Xdemia: pilih beasiswa/materi/acara -->
      <div v-if="bagikanTerbuka" class="komposer">
        <header class="drawer-head">
          <button class="tap" @click="bagikanTerbuka = false">
            <i class="el-icon-arrow-left"></i><span>{{ $t('common.cancel') }}</span>
          </button>
          <p class="title grow drawer-judul">{{ $t('chat.shareTitle') }}</p>
        </header>

        <div class="daftar">
          <FilterChips v-model="tabBagikan" :opsi="opsiBagikan" :nilai="idTabBagikan" class="tab-chat" />

          <button
            v-for="s in daftarBagikan"
            :key="s.tipe + s.id"
            class="percakapan"
            @click="pilihBagikan(s)"
          >
            <div class="thumb bagikan-thumb" :class="'share-' + s.tipe">
              <i :class="ikonBagikan(s.tipe)"></i>
            </div>
            <div class="grow teks">
              <p class="title clamp-1" data-content="true">{{ s.judul }}</p>
              <p class="muted clamp-1" data-content="true">{{ s.sub }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>

<script>
import OverlayPanel from '@/components/OverlayPanel.vue'
import FilterChips from '@/components/FilterChips.vue'
import EmptyState from '@/components/EmptyState.vue'
import chatsData from '@/mock/chats.json'
import people from '@/mock/people.json'
import scholarships from '@/mock/scholarships.json'
import courses from '@/mock/courses.json'
import events from '@/mock/events.json'

export default {
  name: 'ChatDrawer',
  components: { OverlayPanel, FilterChips, EmptyState },
  props: {
    terbuka: { type: Boolean, default: false }
  },
  data () {
    return {
      chats: chatsData.map((c) => ({ ...c, pesan: c.pesan.slice() })),
      aktif: null,
      draf: '',
      tab: 'all',
      idTab: ['all', 'direct', 'group'],
      komposerTerbuka: false,
      bagikanTerbuka: false,
      lampiran: null,
      tabBagikan: 'beasiswa',
      idTabBagikan: ['beasiswa', 'materi', 'acara']
    }
  },
  computed: {
    opsiTab () {
      return this.idTab.map((id) => this.$t('chat.filters.' + id))
    },
    opsiBagikan () {
      return this.idTabBagikan.map((id) => this.$t('chat.shareType.' + id))
    },
    daftar () {
      if (this.tab === 'direct') return this.chats.filter((c) => c.tipe === 'pribadi')
      if (this.tab === 'group') return this.chats.filter((c) => c.tipe === 'grup')
      return this.chats
    },
    penerima () {
      const sudahAda = this.chats.map((c) => c.nama)
      return people.filter((o) => sudahAda.indexOf(o.nama) === -1)
    },
    daftarBagikan () {
      if (this.tabBagikan === 'materi') {
        return courses.slice(0, 6).map((c) => ({ tipe: 'materi', id: c.id, judul: c.judul, sub: c.penyedia }))
      }
      if (this.tabBagikan === 'acara') {
        return events.slice(0, 6).map((e) => ({ tipe: 'acara', id: e.id, judul: e.judul, sub: e.lokasi }))
      }
      return scholarships.slice(0, 6).map((s) => ({ tipe: 'beasiswa', id: s.id, judul: s.nama, sub: s.penyelenggara + ' · ' + s.cakupan }))
    }
  },
  methods: {
    // jam dinding pakai format jam, sisanya waktu relatif
    waktuChat (w) {
      if (w && w.jamDinding) return this.$jam(w)
      return this.$waktuRelatif(w)
    },
    cuplikanIkon (c) {
      const peta = { gambar: 'el-icon-picture', video: 'el-icon-video-camera', file: 'el-icon-document', bagikan: 'el-icon-share' }
      return peta[c.jenisTerakhir] || ''
    },
    kembali () {
      if (this.aktif) this.aktif = null
      else this.$emit('tutup')
    },
    bukaChat (c) {
      this.aktif = c
      c.belumDibaca = 0
      this.$nextTick(() => {
        const el = this.$refs.gulir
        if (el) el.scrollTop = el.scrollHeight
      })
    },
    lihatProfil () {
      if (this.aktif && this.aktif.orangId) this.$router.push('/profil/' + this.aktif.orangId)
    },
    mulaiChat (o) {
      const baru = {
        id: 'ch-baru-' + o.id,
        nama: o.nama,
        inisial: o.inisial,
        orangId: o.id,
        tipe: 'pribadi',
        cuplikan: this.$t('chat.newConversation'),
        waktu: {},
        belumDibaca: 0,
        pesan: []
      }
      this.chats.unshift(baru)
      this.komposerTerbuka = false
      this.aktif = baru
    },
    ikonBagikan (tipe) {
      const peta = { beasiswa: 'el-icon-medal', materi: 'el-icon-reading', acara: 'el-icon-date' }
      return peta[tipe] || 'el-icon-link'
    },
    tambahLampiran (jenis) {
      const label = {
        gambar: this.$t('chat.attachPhoto'),
        video: this.$t('chat.attachVideo'),
        file: this.$t('chat.attachFile')
      }[jenis]
      this.lampiran = { jenis, label }
    },
    pilihBagikan (s) {
      this.lampiran = { jenis: 'bagikan', bagikan: s }
      this.bagikanTerbuka = false
    },
    bukaBagikan (bagikan) {
      const peta = { beasiswa: '/beasiswa/', materi: '/learn/', acara: '/acara/' }
      const rute = peta[bagikan.tipe]
      if (rute) this.$router.push(rute + bagikan.id)
    },
    kirim () {
      const teks = this.draf.trim()
      if (!teks && !this.lampiran) return

      const pesanBaru = {
        id: 'p-' + (this.aktif.pesan.length + 1),
        dari: 'saya',
        teks,
        waktu: {}
      }

      if (this.lampiran) {
        pesanBaru.jenis = this.lampiran.jenis
        if (this.lampiran.jenis === 'file') {
          pesanBaru.berkas = { nama: this.lampiran.label, ukuran: '—' }
        }
        if (this.lampiran.jenis === 'bagikan') {
          pesanBaru.bagikan = this.lampiran.bagikan
        }
      } else {
        pesanBaru.jenis = 'teks'
      }

      this.aktif.pesan.push(pesanBaru)
      this.aktif.cuplikan = teks || (this.lampiran ? this.lampiran.label || this.lampiran.bagikan.judul : '')
      this.aktif.jenisTerakhir = this.lampiran ? this.lampiran.jenis : undefined
      this.draf = ''
      this.lampiran = null
      this.$nextTick(() => {
        const el = this.$refs.gulir
        if (el) el.scrollTop = el.scrollHeight
      })
    }
  }
}
</script>

<style scoped>
.drawer-isi {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
  position: relative;
}

.drawer-head {
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}

.drawer-judul { margin: 0; }

.drawer-lawan {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  cursor: pointer;
}

.drawer-avatar { width: 36px; height: 36px; flex: none; background: var(--brand); color: #fff; }
.drawer-lawan-teks { min-width: 0; }
.drawer-status { font-size: 11.5px; }

.tombol-baru { color: var(--brand); font-weight: 600; }

.tab-chat { flex: none; padding: 8px 10px 0; background: var(--card); }

.tab-chat >>> .chips {
  overflow: visible;
  padding: 2px 0 8px;
}

.tab-chat >>> .chip {
  flex: 1;
  padding: 0 8px;
  text-align: center;
  justify-content: center;
}

.daftar { flex: 1; min-height: 0; overflow-y: auto; padding: 8px; }

.petunjuk { padding: 4px 4px 10px; }

.percakapan {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 64px;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.percakapan:hover { border-color: var(--brand); }

.cuplikan-ikon { margin-right: 4px; color: var(--muted); }

.bagikan-thumb { color: #fff; font-size: 20px; }
.share-beasiswa { background: #e08a3c; }
.share-materi { background: var(--brand); }
.share-acara { background: #8b5cf6; }

.teks { min-width: 0; }
.teks .title { margin: 0; }

.clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kanan {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.badge {
  background: var(--brand);
  color: #fff;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
}

.jendela { display: flex; flex-direction: column; flex: 1; min-height: 0; }

.pesan-area {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: var(--bg);
}

.bubble-baris { display: flex; margin-bottom: 8px; }
.kanan-baris { justify-content: flex-end; }
.kiri-baris { justify-content: flex-start; }

.bubble {
  max-width: 78%;
  padding: 8px 12px;
  border-radius: var(--radius);
  font-size: 14px;
}

.bubble p { margin: 0; }

.bubble-saya { background: var(--brand); color: #fff; border-bottom-right-radius: 4px; }
.bubble-mereka { background: var(--card); border: 1px solid var(--line); border-bottom-left-radius: 4px; }

.waktu { display: block; font-size: 11px; opacity: .75; margin-top: 2px; }

/* media (gambar/video) */
.bubble-media { padding: 6px; }
.media-preview {
  width: 220px;
  max-width: 60vw;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  background: var(--bg-soft, #eef3f5);
  display: grid;
  place-items: center;
  color: var(--muted);
  font-size: 28px;
}
.media-video { background: #0c2329; color: #fff; }
.media-caption { margin: 6px 4px 2px; font-size: 13px; }
.bubble-saya .media-caption { color: #fff; }

/* berkas */
.bubble-file { padding: 8px; }
.file-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}
.file-ikon {
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 9px;
  background: rgba(255, 255, 255, .25);
  display: grid;
  place-items: center;
  font-size: 18px;
}
.bubble-mereka .file-ikon { background: var(--brand-soft); color: var(--brand-dark); }
.file-info { display: flex; flex-direction: column; min-width: 0; }
.file-nama { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-ukuran { font-size: 11.5px; opacity: .8; }
.file-unduh { flex: none; font-size: 18px; }

/* bagikan */
.bubble-share {
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  padding: 8px;
  display: block;
}
.bubble-saya-share { background: var(--brand); color: #fff; border-radius: var(--radius); border-bottom-right-radius: 4px; }
.bubble-mereka-share { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); border-bottom-left-radius: 4px; }
.share-caption { margin-top: 8px; }

.share-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, .16);
  border-radius: 10px;
  padding: 8px;
}
.bubble-mereka-share .share-card { background: var(--bg); }
.share-card-mini { background: var(--bg); }

.share-ikon {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 19px;
}

.share-teks { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
.share-tag { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; opacity: .75; }
.share-judul { font-weight: 700; font-size: 13.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.share-sub { font-size: 12px; opacity: .8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* lampiran pratinjau + toolbar */
.lampiran-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--card);
  border-top: 1px solid var(--line);
}

.lampiran-preview .share-card { flex: 1; min-width: 0; }

.lampiran-generik {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text);
}

.lampiran-generik span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.hapus-lampiran { flex: none; color: var(--muted); }

.toolbar-lampiran {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px 0;
  background: var(--card);
}

.opsi-lampiran {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;
  color: var(--brand);
  font-size: 17px;
}

.opsi-lampiran:hover { background: var(--brand-soft); }

.kirim {
  display: flex;
  gap: 8px;
  padding: 8px 10px 10px;
  background: var(--card);
  border-top: 1px solid var(--line);
}

.kirim >>> .el-input { flex: 1; }
.tombol-kirim { min-width: 44px; min-height: 44px; }

.komposer {
  position: absolute;
  inset: 0;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  z-index: 2;
}
</style>

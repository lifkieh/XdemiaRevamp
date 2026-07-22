<template>
  <OverlayPanel :terbuka="terbuka" kelas="chat-drawer" @tutup="$emit('tutup')">
    <div class="drawer-isi">
      <header class="drawer-head">
        <button class="tap" @click="kembali">
          <i class="el-icon-arrow-left"></i>
          <span>{{ aktif ? $t('chat.list') : $t('common.close') }}</span>
        </button>
        <p class="title grow drawer-judul">{{ aktif ? aktif.nama : $t('chat.title') }}</p>
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
            @click="aktif = c"
          >
            <div class="thumb" :class="c.tipe === 'grup' ? '' : 'thumb-round'">{{ c.inisial }}</div>
            <div class="grow teks">
              <p class="title" data-content="true">{{ c.nama }}</p>
              <p class="muted clamp-1" data-content="true">{{ c.cuplikan }}</p>
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
            <div class="bubble" :class="p.dari === 'saya' ? 'bubble-saya' : 'bubble-mereka'">
              <p data-content="true">{{ p.teks }}</p>
              <span class="waktu">{{ waktuChat(p.waktu) }}</span>
            </div>
          </div>
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
    </div>
  </OverlayPanel>
</template>

<script>
import OverlayPanel from '@/components/OverlayPanel.vue'
import FilterChips from '@/components/FilterChips.vue'
import EmptyState from '@/components/EmptyState.vue'
import chatsData from '@/mock/chats.json'
import people from '@/mock/people.json'

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
      komposerTerbuka: false
    }
  },
  computed: {
    opsiTab () {
      return this.idTab.map((id) => this.$t('chat.filters.' + id))
    },
    daftar () {
      if (this.tab === 'direct') return this.chats.filter((c) => c.tipe === 'pribadi')
      if (this.tab === 'group') return this.chats.filter((c) => c.tipe === 'grup')
      return this.chats
    },
    penerima () {
      const sudahAda = this.chats.map((c) => c.nama)
      return people.filter((o) => sudahAda.indexOf(o.nama) === -1)
    }
  },
  methods: {
    // jam dinding pakai format jam, sisanya waktu relatif
    waktuChat (w) {
      if (w && w.jamDinding) return this.$jam(w)
      return this.$waktuRelatif(w)
    },
    kembali () {
      if (this.aktif) this.aktif = null
      else this.$emit('tutup')
    },
    mulaiChat (o) {
      const baru = {
        id: 'ch-baru-' + o.id,
        nama: o.nama,
        inisial: o.inisial,
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
    kirim () {
      const teks = this.draf.trim()
      if (!teks) return
      this.aktif.pesan.push({
        id: 'p-' + (this.aktif.pesan.length + 1),
        dari: 'saya',
        teks,
        waktu: {}
      })
      this.aktif.cuplikan = teks
      this.draf = ''
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
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}

.drawer-judul { margin: 0; }

.tombol-baru { color: var(--brand); font-weight: 600; }

.tab-chat { padding: 8px 10px 0; background: var(--card); }

.daftar { overflow-y: auto; padding: 8px; }

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

.kirim {
  display: flex;
  gap: 8px;
  padding: 10px;
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

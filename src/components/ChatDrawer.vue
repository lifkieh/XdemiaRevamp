<template>
  <el-drawer
    :visible="terbuka"
    direction="rtl"
    size="100%"
    :with-header="false"
    custom-class="chat-drawer"
    @update:visible="tutup"
  >
    <div class="drawer-isi">
      <header class="drawer-head">
        <button class="tap" @click="kembali">
          <i class="el-icon-arrow-left"></i>
          <span>{{ aktif ? 'Daftar' : 'Tutup' }}</span>
        </button>
        <p class="title grow drawer-judul">{{ aktif ? aktif.nama : 'Chat' }}</p>
      </header>

      <!-- Daftar percakapan -->
      <div v-if="!aktif" class="daftar">
        <button
          v-for="c in chats"
          :key="c.id"
          class="percakapan"
          @click="aktif = c"
        >
          <div class="thumb thumb-round">{{ c.inisial }}</div>
          <div class="grow teks">
            <p class="title">{{ c.nama }}</p>
            <p class="muted clamp-1">{{ c.cuplikan }}</p>
          </div>
          <div class="kanan">
            <span class="muted">{{ c.waktu }}</span>
            <span v-if="c.belumDibaca" class="badge">{{ c.belumDibaca }}</span>
          </div>
        </button>
      </div>

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
              <p>{{ p.teks }}</p>
              <span class="waktu">{{ p.waktu }}</span>
            </div>
          </div>
        </div>

        <form class="kirim" @submit.prevent="kirim">
          <el-input v-model="draf" placeholder="Tulis pesan..." />
          <el-button type="primary" native-type="submit" class="tombol-kirim">
            <i class="el-icon-position"></i>
          </el-button>
        </form>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import chatsData from '@/mock/chats.json'

export default {
  name: 'ChatDrawer',
  props: {
    terbuka: { type: Boolean, default: false }
  },
  data () {
    return {
      chats: chatsData.map((c) => ({ ...c, pesan: c.pesan.slice() })),
      aktif: null,
      draf: ''
    }
  },
  methods: {
    tutup (nilai) {
      if (!nilai) this.$emit('tutup')
    },
    kembali () {
      if (this.aktif) this.aktif = null
      else this.$emit('tutup')
    },
    kirim () {
      const teks = this.draf.trim()
      if (!teks) return
      this.aktif.pesan.push({
        id: 'p-' + (this.aktif.pesan.length + 1),
        dari: 'saya',
        teks,
        waktu: 'Baru saja'
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

.daftar { overflow-y: auto; padding: 8px; }

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
</style>

<style>
.chat-drawer { max-width: 480px; margin: 0 auto; }
.chat-drawer .el-drawer__body { padding: 0; height: 100%; overflow: hidden; }
</style>

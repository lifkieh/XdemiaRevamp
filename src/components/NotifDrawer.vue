<template>
  <el-drawer
    :visible="terbuka"
    direction="rtl"
    size="100%"
    :with-header="false"
    custom-class="notif-drawer"
    @update:visible="tutup"
  >
    <div class="drawer-isi">
      <header class="drawer-head">
        <button class="tap" @click="$emit('tutup')">
          <i class="el-icon-arrow-left"></i><span>Tutup</span>
        </button>
        <p class="title grow drawer-judul">Notifikasi</p>
        <el-button size="mini" @click="tandaiSemua">Tandai semua dibaca</el-button>
      </header>

      <div class="daftar">
        <EmptyState
          v-if="notifikasi.length === 0"
          ikon="el-icon-bell"
          judul="Belum ada notifikasi"
          pesan="Nanti kalau ada kabar, muncul di sini."
        />

        <div
          v-for="n in notifikasi"
          v-else
          :key="n.id"
          class="notif"
          :class="{ 'is-baru': n.baru }"
        >
          <div class="thumb notif-ikon"><i :class="ikon(n.tipe)"></i></div>
          <div class="grow">
            <p class="notif-teks">{{ n.teks }}</p>
            <p class="muted">{{ n.waktu }}</p>
          </div>
          <span v-if="n.baru" class="titik"></span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import EmptyState from '@/components/EmptyState.vue'
import notifData from '@/mock/notifications.json'

export default {
  name: 'NotifDrawer',
  components: { EmptyState },
  props: {
    terbuka: { type: Boolean, default: false }
  },
  data () {
    return {
      notifikasi: notifData.map((n) => ({ ...n }))
    }
  },
  methods: {
    tutup (nilai) {
      if (!nilai) this.$emit('tutup')
    },
    ikon (tipe) {
      const peta = {
        beasiswa: 'el-icon-medal',
        suka: 'el-icon-star-on',
        belajar: 'el-icon-reading',
        komentar: 'el-icon-chat-line-round',
        komunitas: 'el-icon-s-flag',
        pengikut: 'el-icon-user'
      }
      return peta[tipe] || 'el-icon-bell'
    },
    tandaiSemua () {
      this.notifikasi.forEach((n) => { n.baru = false })
      this.$store.dispatch('user/bacaSemuaNotif')
      this.$message({ message: 'Semua notifikasi ditandai dibaca.', type: 'success' })
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

.notif {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  min-height: 44px;
}

.is-baru { border-color: var(--brand); background: var(--brand-soft); }

.notif-ikon { width: 38px; height: 38px; font-size: 18px; }

.notif-teks { margin: 0 0 2px; font-size: 14px; }

.titik {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand);
  margin-top: 6px;
}
</style>

<style>
.notif-drawer { max-width: 480px; }
.notif-drawer .el-drawer__body { padding: 0; height: 100%; overflow: hidden; }
</style>

<template>
  <OverlayPanel :terbuka="terbuka" kelas="notif-drawer" @tutup="$emit('tutup')">
    <div class="drawer-isi">
      <header class="drawer-head">
        <button class="tap" @click="$emit('tutup')">
          <i class="el-icon-arrow-left"></i><span>{{ $t('common.close') }}</span>
        </button>
        <p class="title grow drawer-judul">{{ $t('notif.title') }}</p>
        <el-button v-if="tab === 'notif'" size="mini" @click="tandaiSemua">{{ $t('notif.markAllRead') }}</el-button>
      </header>

      <el-tabs v-model="tab" class="tab-notif">
        <el-tab-pane name="notif">
          <span slot="label">
            <i class="el-icon-bell"></i> {{ $t('notif.tabNotif') }}
          </span>

          <div class="daftar">
            <EmptyState
              v-if="notifikasi.length === 0"
              ikon="el-icon-bell"
              :judul="$t('notif.emptyTitle')"
              :pesan="$t('notif.emptyText')"
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
                <p class="notif-teks" data-content="true">{{ n.teks }}</p>
                <p class="muted">{{ $waktuRelatif(n.waktu) }}</p>
              </div>
              <span v-if="n.baru" class="titik"></span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="undangan">
          <span slot="label">
            <i class="el-icon-message-solid"></i> {{ $t('notif.tabInvites') }}
          </span>

          <div class="daftar">
            <EmptyState
              v-if="undangan.length === 0"
              ikon="el-icon-message-solid"
              :judul="$t('notif.emptyInvitesTitle')"
              :pesan="$t('notif.emptyInvitesText')"
            />

            <div v-for="u in undangan" v-else :key="u.id" class="undangan">
              <div class="row row-top">
                <div class="thumb notif-ikon">
                  <i :class="u.tipe === 'acara' ? 'el-icon-date' : 'el-icon-s-flag'"></i>
                </div>
                <div class="grow">
                  <p class="title" data-content="true">{{ u.judul }}</p>
                  <p class="muted">{{ keterangan(u) }}</p>
                  <p class="muted waktu">{{ $waktuRelatif(u.waktu) }}</p>
                </div>
              </div>
              <div class="aksi-undangan">
                <el-button size="small" type="primary" @click="jawab(u, true)">{{ $t('notif.accept') }}</el-button>
                <el-button size="small" @click="jawab(u, false)">{{ $t('notif.decline') }}</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </OverlayPanel>
</template>

<script>
import OverlayPanel from '@/components/OverlayPanel.vue'
import EmptyState from '@/components/EmptyState.vue'
import notifData from '@/mock/notifications.json'
import undanganData from '@/mock/invitations.json'
import acaraData from '@/mock/events.json'

export default {
  name: 'NotifDrawer',
  components: { OverlayPanel, EmptyState },
  props: {
    terbuka: { type: Boolean, default: false }
  },
  data () {
    return {
      tab: 'notif',
      notifikasi: notifData.map((n) => ({ ...n })),
      undangan: undanganData.map((u) => ({ ...u }))
    }
  },
  methods: {
    // undangan acara merangkai tanggal + jam dari data acara supaya ikut bahasa
    keterangan (u) {
      if (u.tipe !== 'acara') return u.keterangan
      const a = acaraData.filter((x) => x.id === u.acaraId)[0]
      if (!a) return ''
      return this.$tanggal(a.tanggalIso, true) + ' · ' + this.$jam(a.jamMulai) + ' · ' + a.lokasi
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
      this.$message({ message: this.$t('notif.markedRead'), type: 'success' })
    },
    jawab (u, terima) {
      this.$message({
        message: terima ? this.$t('notif.accepted', { name: u.judul }) : this.$t('notif.declined', { name: u.judul }),
        type: terima ? 'success' : 'info'
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

.tab-notif {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tab-notif >>> .el-tabs__header { margin: 0; background: var(--card); }
.tab-notif >>> .el-tabs__nav { width: 100%; display: flex; }
.tab-notif >>> .el-tabs__item { flex: 1; text-align: center; min-height: 44px; line-height: 44px; }
.tab-notif >>> .el-tabs__content { flex: 1; min-height: 0; overflow-y: auto; }
.tab-notif >>> .el-tab-pane { height: 100%; }

.daftar { padding: 8px; }

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

.undangan {
  padding: 12px;
  margin-bottom: 8px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.undangan .waktu { font-size: 12px; margin-top: 2px; }

.aksi-undangan {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}

.aksi-undangan .el-button { flex: 1; }
</style>

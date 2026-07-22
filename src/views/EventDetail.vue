<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>{{ $t('common.back') }}</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!acara"
      ikon="el-icon-warning-outline"
      :judul="$t('event.notFoundTitle')"
      :pesan="$t('event.notFoundText')"
    >
      <el-button type="primary" @click="$router.push('/events')">{{ $t('event.notFoundAction') }}</el-button>
    </EmptyState>

    <template v-else>
      <div class="card hero">
        <div class="cover">
          <span class="cover-inisial">{{ acara.inisial }}</span>
        </div>
        <div class="hero-isi">
          <h1 class="title-lg">{{ acara.judul }}</h1>
          <p class="muted">{{ $t('event.organiser', { name: acara.penyelenggara }) }}</p>

          <div class="pil-baris">
            <span class="pill">{{ $t('eventAccess.' + acara.akses) }}</span>
            <span class="pill">{{ $t('eventPrivacy.' + acara.privasi) }}</span>
            <span v-if="acara.hadiah > 0" class="pill pill-warn">
              <i class="el-icon-trophy"></i> {{ $t('event.prize', { amount: rupiah(acara.hadiah) }) }}
            </span>
            <span v-if="acara.lewat" class="pill">{{ $t('event.past') }}</span>
          </div>

          <div class="ringkas">
            <div class="ringkas-baris">
              <i class="el-icon-date"></i>
              <div>
                <p class="ringkas-judul">{{ acara.tanggal }}</p>
                <p class="muted">{{ $t('common.start') }} {{ acara.waktu }}</p>
              </div>
            </div>
            <div class="ringkas-baris">
              <i :class="acara.daring ? 'el-icon-video-camera' : 'el-icon-location-outline'"></i>
              <div>
                <p class="ringkas-judul">{{ acara.lokasi }}</p>
                <p class="muted">{{ acara.daring ? $t('event.online') : $t('event.offline') }}</p>
              </div>
            </div>
            <div class="ringkas-baris">
              <i class="el-icon-user"></i>
              <div>
                <p class="ringkas-judul">{{ acara.lewat ? $t('event.attended', { n: acara.peserta }) : $t('event.joining', { n: acara.peserta }) }}</p>
                <p class="muted">{{ acara.akses === 'Tertutup' ? $t('event.quotaLimited') : $t('event.quotaOpen') }}</p>
              </div>
            </div>
          </div>

          <div class="aksi">
            <el-button
              class="tombol-utama"
              :type="ikut ? 'default' : 'primary'"
              :disabled="acara.lewat"
              @click="toggleIkut"
            >
              {{ acara.lewat ? $t('event.over') : (ikut ? $t('event.cancelJoin') : $t('event.joinEvent')) }}
            </el-button>
            <el-button class="tombol-simpan" @click="toggleSimpan">
              <i :class="tersimpan ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
              {{ tersimpan ? $t('common.saved') : $t('common.save') }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="card">
        <p class="title">{{ $t('event.aboutEvent') }}</p>
        <p class="paragraf">{{ acara.deskripsi }}</p>
      </div>

      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('event.participants') }}</h2>
          <span class="muted">{{ $t('event.shown', { n: acara.daftarPeserta.length }) }}</span>
        </div>
        <BaseCard
          v-for="p in acara.daftarPeserta"
          :key="p.id"
          :inisial="p.inisial"
          :judul="p.nama"
          :subjudul="p.peran"
          bulat
        />
      </section>
    </template>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import events from '@/mock/events.json'

export default {
  name: 'EventDetailView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, acara: null, ikut: false }
  },
  computed: {
    tersimpan () {
      return this.acara ? this.$store.getters['bookmarks/isAcaraTersimpan'](this.acara.id) : false
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
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.acara = events.filter((e) => e.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    rupiah (n) { return 'Rp' + n.toLocaleString('id-ID') },
    toggleIkut () {
      this.ikut = !this.ikut
      this.$message({
        message: this.ikut ? this.$t('event.joinedToast', { name: this.acara.judul }) : this.$t('event.cancelledToast', { name: this.acara.judul }),
        type: this.ikut ? 'success' : 'info'
      })
    },
    toggleSimpan () {
      this.$store.dispatch('bookmarks/toggleAcara', this.acara.id)
    }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.hero { padding: 0; overflow: hidden; }

.cover {
  height: 120px;
  background: linear-gradient(120deg, var(--brand), #3fc9c0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-inisial { color: #fff; font-size: 40px; font-weight: 800; letter-spacing: 1px; }

.hero-isi { padding: 14px; }

.pil-baris { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }

.ringkas { margin-top: 14px; }

.ringkas-baris {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}

.ringkas-baris i { font-size: 18px; color: var(--brand); margin-top: 2px; }
.ringkas-judul { margin: 0; font-size: 14px; font-weight: 600; }

.aksi { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.tombol-utama { flex: 1; min-height: 44px; min-width: 180px; }
.tombol-simpan { min-height: 44px; }

.paragraf { margin: 8px 0 0; font-size: 14.5px; }
</style>

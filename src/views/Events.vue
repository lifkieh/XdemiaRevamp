<template>
  <div class="screen">
    <div class="row acara-head">
      <div class="grow">
        <h1 class="title-lg">Acara</h1>
        <p class="muted">Kelas, diskusi, dan sesi live dari komunitas.</p>
      </div>
    </div>

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <template v-else>
      <section class="section">
        <div class="section-head">
          <h2 class="title">Akan datang</h2>
          <span class="muted">{{ akanDatang.length }} acara</span>
        </div>

        <EmptyState
          v-if="akanDatang.length === 0"
          ikon="el-icon-date"
          judul="Belum ada acara"
          pesan="Gabung komunitas dulu biar dapat undangan acara."
        />

        <BaseCard
          v-for="e in akanDatang"
          :key="e.id"
          :inisial="e.inisial"
          :judul="e.judul"
          :subjudul="e.penyelenggara"
        >
          <template slot="meta">
            <span class="pill"><i class="el-icon-date"></i> {{ e.tanggal }}</span>
            <span class="pill">{{ e.waktu }}</span>
            <span class="pill">{{ e.lokasi }}</span>
          </template>
          <div class="kaki">
            <span class="muted">{{ e.peserta }} orang ikut</span>
            <el-button
              size="small"
              :type="ikut[e.id] ? 'default' : 'primary'"
              @click="toggleIkut(e)"
            >
              {{ ikut[e.id] ? 'Batal ikut' : 'Ikut' }}
            </el-button>
          </div>
        </BaseCard>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="title">Sudah lewat</h2>
          <span class="muted">{{ sudahLewat.length }} acara</span>
        </div>

        <BaseCard
          v-for="e in sudahLewat"
          :key="e.id"
          :inisial="e.inisial"
          :judul="e.judul"
          :subjudul="e.penyelenggara"
          class="lewat"
        >
          <template slot="meta">
            <span class="pill">{{ e.tanggal }}</span>
            <span class="pill">{{ e.lokasi }}</span>
          </template>
          <div class="kaki">
            <span class="muted">{{ e.peserta }} orang hadir</span>
            <el-button size="small" @click="belumTersedia">Lihat rekaman</el-button>
          </div>
        </BaseCard>
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
  name: 'EventsView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, data: [], ikut: {} }
  },
  computed: {
    akanDatang () { return this.data.filter((e) => !e.lewat) },
    sudahLewat () { return this.data.filter((e) => e.lewat) }
  },
  created () {
    this.timer = setTimeout(() => {
      this.data = events
      this.memuat = false
    }, 600)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    toggleIkut (e) {
      const baru = !this.ikut[e.id]
      this.$set(this.ikut, e.id, baru)
      this.$message({
        message: baru ? 'Kamu ikut: ' + e.judul : 'Batal ikut: ' + e.judul,
        type: baru ? 'success' : 'info'
      })
    },
    belumTersedia () { this.$message('Belum aktif di prototipe ini.') }
  }
}
</script>

<style scoped>
.acara-head { margin: 4px 2px 12px; }
.acara-head .title-lg { margin-bottom: 2px; }

.kaki {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

.lewat >>> .thumb { background: var(--bg); color: var(--muted); }
</style>

<template>
  <div class="screen">
    <div class="row acara-head">
      <div class="grow">
        <h1 class="title-lg">Acara</h1>
        <p class="muted">Kelas, diskusi, dan sesi live dari komunitas.</p>
      </div>
      <el-button type="primary" size="small" class="tombol-buat" @click="formTerbuka = true">
        <i class="el-icon-plus"></i> Buat acara
      </el-button>
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
          clickable
          @click.native="$router.push('/acara/' + e.id)"
        >
          <template slot="meta">
            <span class="pill"><i class="el-icon-date"></i> {{ e.tanggal }}</span>
            <span class="pill">{{ e.waktu }}</span>
            <span class="pill">{{ e.lokasi }}</span>
            <span class="pill">{{ e.akses }}</span>
            <span class="pill">{{ e.privasi }}</span>
            <span v-if="e.hadiah > 0" class="pill pill-warn">
              <i class="el-icon-trophy"></i> Hadiah {{ rupiah(e.hadiah) }}
            </span>
          </template>
          <div class="kaki">
            <span class="muted">{{ e.peserta }} orang ikut</span>
            <el-button
              size="small"
              :type="ikut[e.id] ? 'default' : 'primary'"
              @click.stop="toggleIkut(e)"
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
          clickable
          @click.native="$router.push('/acara/' + e.id)"
        >
          <template slot="meta">
            <span class="pill">{{ e.tanggal }}</span>
            <span class="pill">{{ e.lokasi }}</span>
            <span class="pill">{{ e.akses }}</span>
          </template>
          <div class="kaki">
            <span class="muted">{{ e.peserta }} orang hadir</span>
            <el-button size="small" @click.stop="belumTersedia">Lihat rekaman</el-button>
          </div>
        </BaseCard>
      </section>
    </template>

    <!-- Form buat acara (dummy) -->
    <el-dialog
      title="Buat acara baru"
      :visible.sync="formTerbuka"
      :width="lebarDialog"
      custom-class="dialog-acara"
    >
      <div class="isian">
        <label class="label">Nama acara</label>
        <el-input v-model="form.judul" placeholder="Contoh: Kelas Menulis Esai" />
      </div>

      <div class="isian">
        <label class="label">Tanggal &amp; jam</label>
        <div class="dua-kolom">
          <el-input v-model="form.tanggal" placeholder="Sabtu, 30 Agustus 2026" />
          <el-input v-model="form.waktu" placeholder="19.30 WIB" />
        </div>
      </div>

      <div class="isian">
        <label class="label">Lokasi</label>
        <el-input v-model="form.lokasi" placeholder="Online · Zoom, atau nama tempat" />
      </div>

      <div class="isian">
        <label class="label">Siapa yang boleh ikut</label>
        <div class="dua-kolom">
          <el-select v-model="form.akses" class="pilihan">
            <el-option label="Terbuka" value="Terbuka" />
            <el-option label="Tertutup" value="Tertutup" />
          </el-select>
          <el-select v-model="form.privasi" class="pilihan">
            <el-option label="Publik" value="Publik" />
            <el-option label="Privat" value="Privat" />
          </el-select>
        </div>
      </div>

      <div class="isian">
        <label class="label">Hadiah (kosongkan kalau tidak ada)</label>
        <el-input v-model="form.hadiah" placeholder="Contoh: 2500000" />
      </div>

      <div class="isian">
        <label class="label">Deskripsi</label>
        <el-input v-model="form.deskripsi" type="textarea" :rows="3" placeholder="Ceritakan acaranya" />
      </div>

      <span slot="footer">
        <el-button @click="formTerbuka = false">Batal</el-button>
        <el-button type="primary" @click="buatAcara">Buat acara</el-button>
      </span>
    </el-dialog>
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
    return {
      memuat: true,
      data: [],
      ikut: {},
      formTerbuka: false,
      form: {
        judul: '',
        tanggal: '',
        waktu: '',
        lokasi: '',
        akses: 'Terbuka',
        privasi: 'Publik',
        hadiah: '',
        deskripsi: ''
      }
    }
  },
  computed: {
    akanDatang () { return this.data.filter((e) => !e.lewat) },
    sudahLewat () { return this.data.filter((e) => e.lewat) },
    lebarDialog () { return this.$store.getters['layout/isDesktop'] ? '520px' : '92%' }
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
    rupiah (n) { return 'Rp' + n.toLocaleString('id-ID') },
    toggleIkut (e) {
      const baru = !this.ikut[e.id]
      this.$set(this.ikut, e.id, baru)
      this.$message({
        message: baru ? 'Kamu ikut: ' + e.judul : 'Batal ikut: ' + e.judul,
        type: baru ? 'success' : 'info'
      })
    },
    buatAcara () {
      if (!this.form.judul.trim()) {
        this.$message({ message: 'Nama acara belum diisi.', type: 'warning' })
        return
      }
      this.formTerbuka = false
      this.$message({ message: 'Acara "' + this.form.judul + '" dibuat (contoh prototipe).', type: 'success' })
    },
    belumTersedia () { this.$message('Belum aktif di prototipe ini.') }
  }
}
</script>

<style scoped>
.acara-head { margin: 4px 2px 12px; }
.acara-head .title-lg { margin-bottom: 2px; }
.tombol-buat { min-height: 44px; }

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

.isian { margin-bottom: 12px; }

.label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 6px;
}

.dua-kolom { display: flex; gap: 8px; }
.dua-kolom > * { flex: 1; }
.pilihan { width: 100%; }
</style>

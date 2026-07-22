<template>
  <div class="screen">
    <div class="row acara-head">
      <div class="grow">
        <h1 class="title-lg">{{ $t('event.title') }}</h1>
        <p class="muted">{{ $t('event.subtitle') }}</p>
      </div>
      <el-button type="primary" size="small" class="tombol-buat" @click="formTerbuka = true">
        <i class="el-icon-plus"></i> {{ $t('event.create') }}
      </el-button>
    </div>

    <CardSkeleton v-if="memuat" :jumlah="4" />

    <template v-else>
      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('event.upcoming') }}</h2>
          <span class="muted">{{ $t('event.count', { n: akanDatang.length }) }}</span>
        </div>

        <EmptyState
          v-if="akanDatang.length === 0"
          ikon="el-icon-date"
          :judul="$t('event.emptyTitle')"
          :pesan="$t('event.emptyText')"
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
            <span class="pill">{{ labelAkses(e.akses) }}</span>
            <span class="pill">{{ labelPrivasi(e.privasi) }}</span>
            <span v-if="e.hadiah > 0" class="pill pill-warn">
              <i class="el-icon-trophy"></i> {{ $t('event.prize', { amount: rupiah(e.hadiah) }) }}
            </span>
          </template>
          <div class="kaki">
            <span class="muted">{{ $t('event.joining', { n: e.peserta }) }}</span>
            <el-button
              size="small"
              :type="ikut[e.id] ? 'default' : 'primary'"
              @click.stop="toggleIkut(e)"
            >
              {{ ikut[e.id] ? $t('event.cancelJoin') : $t('event.join') }}
            </el-button>
          </div>
        </BaseCard>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('event.past') }}</h2>
          <span class="muted">{{ $t('event.count', { n: sudahLewat.length }) }}</span>
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
            <span class="pill">{{ labelAkses(e.akses) }}</span>
          </template>
          <div class="kaki">
            <span class="muted">{{ $t('event.attended', { n: e.peserta }) }}</span>
            <el-button size="small" @click.stop="belumTersedia">{{ $t('event.recording') }}</el-button>
          </div>
        </BaseCard>
      </section>
    </template>

    <!-- Form buat acara (dummy) -->
    <el-dialog
      :title="$t('event.form.title')"
      :visible.sync="formTerbuka"
      :width="lebarDialog"
      custom-class="dialog-acara"
    >
      <div class="isian">
        <label class="label">{{ $t('event.form.name') }}</label>
        <el-input v-model="form.judul" :placeholder="$t('event.form.namePlaceholder')" />
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.when') }}</label>
        <div class="dua-kolom">
          <el-input v-model="form.tanggal" :placeholder="$t('event.form.datePlaceholder')" />
          <el-input v-model="form.waktu" :placeholder="$t('event.form.timePlaceholder')" />
        </div>
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.where') }}</label>
        <el-input v-model="form.lokasi" :placeholder="$t('event.form.wherePlaceholder')" />
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.who') }}</label>
        <div class="dua-kolom">
          <el-select v-model="form.akses" class="pilihan">
            <el-option :label="$t('eventAccess.Terbuka')" value="Terbuka" />
            <el-option :label="$t('eventAccess.Tertutup')" value="Tertutup" />
          </el-select>
          <el-select v-model="form.privasi" class="pilihan">
            <el-option :label="$t('eventPrivacy.Publik')" value="Publik" />
            <el-option :label="$t('eventPrivacy.Privat')" value="Privat" />
          </el-select>
        </div>
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.prize') }}</label>
        <el-input v-model="form.hadiah" :placeholder="$t('event.form.prizePlaceholder')" />
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.description') }}</label>
        <el-input v-model="form.deskripsi" type="textarea" :rows="3" :placeholder="$t('event.form.descriptionPlaceholder')" />
      </div>

      <span slot="footer">
        <el-button @click="formTerbuka = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="buatAcara">{{ $t('event.form.submit') }}</el-button>
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
    labelAkses (v) { return this.$t('eventAccess.' + v) },
    labelPrivasi (v) { return this.$t('eventPrivacy.' + v) },
    toggleIkut (e) {
      const baru = !this.ikut[e.id]
      this.$set(this.ikut, e.id, baru)
      this.$message({
        message: baru ? this.$t('event.joinedToast', { name: e.judul }) : this.$t('event.cancelledToast', { name: e.judul }),
        type: baru ? 'success' : 'info'
      })
    },
    buatAcara () {
      if (!this.form.judul.trim()) {
        this.$message({ message: this.$t('event.form.needName'), type: 'warning' })
        return
      }
      this.formTerbuka = false
      this.$message({ message: this.$t('event.form.created', { name: this.form.judul }), type: 'success' })
    },
    belumTersedia () { this.$message(this.$t('common.notAvailable')) }
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

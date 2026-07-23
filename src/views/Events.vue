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
            <span class="pill"><i class="el-icon-date"></i> {{ $tanggal(e.tanggalIso, true) }}</span>
            <span class="pill">{{ $jam(e.jamMulai) }}</span>
            <span class="pill" data-content="true">{{ e.lokasi }}</span>
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
            <span class="pill">{{ $tanggal(e.tanggalIso, true) }}</span>
            <span class="pill" data-content="true">{{ e.lokasi }}</span>
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
      <!-- Detail: jenis acara + nama -->
      <p class="bagian-judul">{{ $t('event.form.about') }}</p>

      <div class="isian">
        <label class="label">{{ $t('event.form.eventType') }}</label>
        <el-select v-model="form.tipe" class="pilihan">
          <el-option :label="$t('event.form.typePersonal')" value="personal" />
          <el-option :label="$t('event.form.typeCommunity')" value="community" />
        </el-select>
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.name') }} <span class="wajib">*</span></label>
        <el-input v-model="form.judul" :placeholder="$t('event.form.namePlaceholder')" />
      </div>

      <!-- Banner & avatar -->
      <p class="bagian-judul">{{ $t('event.form.bannerAvatar') }}</p>

      <div class="unggah-baris">
        <div class="unggah-thumb unggah-banner"><i class="el-icon-picture-outline"></i></div>
        <div class="grow unggah-info">
          <p class="title">{{ $t('event.form.uploadBanner') }}</p>
          <p class="muted clamp-1">{{ form.banner || $t('event.form.noFileChosen') }}</p>
        </div>
        <div class="unggah-aksi">
          <button type="button" class="tap" @click="form.banner = 'banner.jpg'">{{ $t('event.form.change') }}</button>
          <button v-if="form.banner" type="button" class="tap hapus" @click="form.banner = ''">{{ $t('event.form.remove') }}</button>
        </div>
      </div>

      <div class="unggah-baris">
        <div class="unggah-thumb unggah-avatar thumb-round"><i class="el-icon-user"></i></div>
        <div class="grow unggah-info">
          <p class="title">{{ $t('event.form.uploadAvatar') }}</p>
          <p class="muted clamp-1">{{ form.avatar || $t('event.form.noFileChosen') }}</p>
        </div>
        <div class="unggah-aksi">
          <button type="button" class="tap" @click="form.avatar = 'avatar.jpg'">{{ $t('event.form.change') }}</button>
          <button v-if="form.avatar" type="button" class="tap hapus" @click="form.avatar = ''">{{ $t('event.form.remove') }}</button>
        </div>
      </div>

      <!-- About -->
      <p class="bagian-judul">{{ $t('event.form.description') }} <span class="wajib">*</span></p>

      <div class="isian">
        <el-input v-model="form.deskripsi" type="textarea" :rows="4" :placeholder="$t('event.form.aboutPlaceholder')" />
      </div>

      <!-- Lokasi -->
      <p class="bagian-judul">{{ $t('event.form.location') }}</p>

      <div class="isian">
        <el-input v-model="form.gedung" :placeholder="$t('event.form.buildingPlaceholder')" />
      </div>

      <div class="isian">
        <el-input v-model="form.alamat" :placeholder="$t('event.form.addressPlaceholder')" prefix-icon="el-icon-location-outline" />
      </div>

      <div class="setelan-online">
        <div class="grow">
          <p class="title">{{ $t('event.form.online') }}</p>
        </div>
        <el-switch v-model="form.online" active-color="#088898" />
      </div>

      <div v-if="form.online" class="isian">
        <el-input v-model="form.tautan" :placeholder="$t('event.form.onlineLinkPlaceholder')" prefix-icon="el-icon-link" />
      </div>

      <!-- Tanggal -->
      <p class="bagian-judul">{{ $t('event.form.when') }} <span class="wajib">*</span></p>

      <div class="isian">
        <label class="label">{{ $t('event.form.start') }}</label>
        <div class="dua-kolom">
          <el-time-select
            v-model="form.jamMulai"
            class="pilihan"
            :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
            :placeholder="$t('event.form.timePlaceholder')"
          />
          <el-date-picker v-model="form.tanggalMulai" type="date" class="pilihan" />
        </div>
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.end') }}</label>
        <div class="dua-kolom">
          <el-time-select
            v-model="form.jamSelesai"
            class="pilihan"
            :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
            :placeholder="$t('event.form.timePlaceholder')"
          />
          <el-date-picker v-model="form.tanggalSelesai" type="date" class="pilihan" />
        </div>
      </div>

      <div class="isian">
        <label class="label">{{ $t('event.form.repeat') }}</label>
        <el-select v-model="form.ulang" class="pilihan">
          <el-option :label="$t('event.form.repeatOptions.never')" value="never" />
          <el-option :label="$t('event.form.repeatOptions.daily')" value="daily" />
          <el-option :label="$t('event.form.repeatOptions.weekly')" value="weekly" />
          <el-option :label="$t('event.form.repeatOptions.monthly')" value="monthly" />
        </el-select>
      </div>

      <!-- Privasi -->
      <p class="bagian-judul">{{ $t('event.form.privacyType') }}</p>

      <el-radio-group v-model="form.privasiTipe" class="privasi-grup">
        <label class="privasi-opsi" :class="{ 'is-aktif': form.privasiTipe === 'publik' }">
          <el-radio label="publik">{{ $t('event.form.privacyPublic') }}</el-radio>
        </label>
        <label class="privasi-opsi" :class="{ 'is-aktif': form.privasiTipe === 'anggota' }">
          <el-radio label="anggota">{{ $t('event.form.privacyMembers') }}</el-radio>
        </label>
        <label class="privasi-opsi" :class="{ 'is-aktif': form.privasiTipe === 'tersembunyi' }">
          <el-radio label="tersembunyi">{{ $t('event.form.privacyHidden') }}</el-radio>
        </label>
      </el-radio-group>

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
        tipe: 'personal',
        judul: '',
        banner: '',
        avatar: '',
        deskripsi: '',
        gedung: '',
        alamat: '',
        online: false,
        tautan: '',
        jamMulai: '',
        tanggalMulai: '',
        jamSelesai: '',
        tanggalSelesai: '',
        ulang: 'never',
        privasiTipe: 'publik'
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
      if (!this.form.deskripsi.trim()) {
        this.$message({ message: this.$t('event.form.needAbout'), type: 'warning' })
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
  margin-top: 14px;
  padding-top: 12px;
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

.bagian-judul {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--brand-dark);
  margin: 18px 0 10px;
}

.bagian-judul:first-child { margin-top: 0; }

.wajib { color: #c0392b; }

.unggah-baris {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
}

.unggah-thumb {
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: var(--radius-sm);
  background: var(--brand-soft);
  color: var(--brand-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.unggah-info { min-width: 0; }
.unggah-info .title { font-size: 13.5px; }
.unggah-info .muted { font-size: 12px; }

.unggah-aksi {
  display: flex;
  flex: none;
  gap: 4px;
}

.unggah-aksi .tap {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--brand);
  min-height: 32px;
  padding: 0 8px;
}

.unggah-aksi .hapus { color: #c0392b; }

.setelan-online {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.privasi-grup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.privasi-opsi {
  display: block;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.privasi-opsi.is-aktif { border-color: var(--brand); background: var(--brand-soft); }

.privasi-opsi >>> .el-radio__label {
  white-space: normal;
  font-size: 13.5px;
  line-height: 1.4;
  color: var(--text);
}
</style>

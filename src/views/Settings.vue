<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>{{ $t('common.back') }}</span>
    </button>

    <h1 class="title-lg judul">{{ $t('settings.title') }}</h1>

    <!-- Bahasa: paling atas supaya gampang ketemu -->
    <div class="card">
      <p class="title bagian">{{ $t('settings.language') }}</p>
      <p class="muted keterangan">{{ $t('settings.languageSub') }}</p>

      <el-radio-group v-model="bahasa" class="pilih-bahasa" @change="gantiBahasa">
        <el-radio label="en" border class="opsi-bahasa">{{ $t('settings.english') }}</el-radio>
        <el-radio label="id" border class="opsi-bahasa">{{ $t('settings.indonesian') }}</el-radio>
      </el-radio-group>
    </div>

    <!-- Profil -->
    <div class="card">
      <p class="title bagian">{{ $t('settings.profile') }}</p>

      <div class="row foto-baris">
        <div class="thumb thumb-round avatar">{{ inisial }}</div>
        <div class="grow">
          <p class="title">{{ $t('settings.photo') }}</p>
          <p class="muted">{{ $t('settings.photoSub') }}</p>
        </div>
        <el-button size="small" @click="belumTersedia">{{ $t('settings.change') }}</el-button>
      </div>

      <div class="isian">
        <label class="label">{{ $t('settings.displayName') }}</label>
        <el-input v-model="form.nama" :placeholder="$t('settings.displayNamePlaceholder')" />
      </div>

      <div class="isian">
        <label class="label">{{ $t('settings.bio') }}</label>
        <el-input v-model="form.bio" type="textarea" :rows="3" :placeholder="$t('settings.bioPlaceholder')" />
      </div>

      <div class="isian">
        <label class="label">{{ $t('settings.campus') }}</label>
        <el-input v-model="form.kampus" :placeholder="$t('settings.campusPlaceholder')" />
      </div>
    </div>

    <!-- Privasi -->
    <div class="card">
      <p class="title bagian">{{ $t('settings.privacy') }}</p>

      <div class="isian">
        <label class="label">{{ $t('settings.whoCanSee') }}</label>
        <el-select v-model="form.siapaLihat" class="pilihan">
          <el-option :label="$t('settings.everyone')" value="semua" />
          <el-option :label="$t('settings.followersOnly')" value="pengikut" />
          <el-option :label="$t('settings.onlyMe')" value="sendiri" />
        </el-select>
      </div>

      <div class="setelan">
        <div class="grow">
          <p class="title">{{ $t('settings.searchable') }}</p>
          <p class="muted">{{ $t('settings.searchableSub') }}</p>
        </div>
        <el-switch v-model="form.bisaDicari" active-color="#17a2a2" />
      </div>

      <div class="setelan">
        <div class="grow">
          <p class="title">{{ $t('settings.openMessages') }}</p>
          <p class="muted">{{ $t('settings.openMessagesSub') }}</p>
        </div>
        <el-switch v-model="form.pesanBebas" active-color="#17a2a2" />
      </div>
    </div>

    <!-- Tanda tangan email -->
    <div class="card">
      <p class="title bagian">{{ $t('settings.signature') }}</p>
      <p class="muted keterangan">{{ $t('settings.signatureSub') }}</p>
      <el-input v-model="form.tandaTangan" type="textarea" :rows="4" :placeholder="$t('settings.signaturePlaceholder')" />
    </div>

    <!-- Status -->
    <div class="card">
      <p class="title bagian">{{ $t('settings.status') }}</p>
      <div class="setelan">
        <div class="grow">
          <p class="title">
            <span class="titik" :class="form.online ? 'hijau' : 'abu'"></span>
            {{ form.online ? $t('settings.online') : $t('settings.offline') }}
          </p>
          <p class="muted">{{ $t('settings.statusSub') }}</p>
        </div>
        <el-switch v-model="form.online" active-color="#17a2a2" />
      </div>
    </div>

    <!-- Notifikasi -->
    <div class="card">
      <p class="title bagian">{{ $t('settings.notifications') }}</p>
      <div v-for="n in notifikasi" :key="n.id" class="setelan">
        <div class="grow">
          <p class="title">{{ $t('settings.notif.' + n.id) }}</p>
          <p class="muted">{{ $t('settings.notif.' + n.id + 'Sub') }}</p>
        </div>
        <el-switch v-model="n.aktif" active-color="#17a2a2" />
      </div>
    </div>

    <div class="aksi-bawah">
      <el-button type="primary" class="tombol-simpan" @click="simpan">{{ $t('settings.saveChanges') }}</el-button>
      <el-button class="tombol-keluar" @click="belumTersedia">
        <i class="el-icon-switch-button"></i> {{ $t('settings.signOut') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { setBahasa } from '@/i18n'

export default {
  name: 'SettingsView',
  data () {
    const profil = this.$store.state.user.profil
    return {
      bahasa: this.$i18n.locale,
      form: {
        nama: profil.name,
        bio: profil.bio,
        kampus: profil.campus,
        siapaLihat: 'semua',
        bisaDicari: true,
        pesanBebas: false,
        online: true,
        tandaTangan: 'Raka Mahendra\nUniversitas Brawijaya'
      },
      notifikasi: [
        { id: 'daily', aktif: true },
        { id: 'scholarship', aktif: true },
        { id: 'replies', aktif: true },
        { id: 'invites', aktif: false },
        { id: 'weekly', aktif: false }
      ]
    }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] }
  },
  watch: {
    // ikut kalau bahasa diubah dari tempat lain
    '$i18n.locale' (nilai) { this.bahasa = nilai }
  },
  methods: {
    gantiBahasa (nilai) {
      setBahasa(nilai)
      this.$message({ message: this.$t('settings.languageChanged'), type: 'success' })
    },
    simpan () {
      this.$message({ message: this.$t('settings.saved'), type: 'success' })
    },
    belumTersedia () { this.$message(this.$t('common.notAvailable')) }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }
.judul { margin: 0 2px 12px; }

.bagian { margin-bottom: 10px; font-size: 16px; }

.keterangan { margin-bottom: 10px; }

.pilih-bahasa { display: flex; flex-wrap: wrap; gap: 8px; }

.pilih-bahasa .opsi-bahasa {
  margin: 0;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
}

.pilih-bahasa >>> .el-radio__label { font-size: 14px; }
.pilih-bahasa >>> .el-radio.is-bordered.is-checked { border-color: var(--brand); }
.pilih-bahasa >>> .el-radio__input.is-checked .el-radio__inner { background: var(--brand); border-color: var(--brand); }
.pilih-bahasa >>> .el-radio__input.is-checked + .el-radio__label { color: var(--brand); }

.foto-baris {
  padding-bottom: 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--line);
}

.avatar { width: 48px; height: 48px; background: var(--brand); color: #fff; font-size: 18px; }

.isian { margin-top: 12px; }

.label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 6px;
}

.pilihan { width: 100%; }

.setelan {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  min-height: 44px;
}

.setelan:last-child { border-bottom: 0; }

.titik {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.hijau { background: #22c07a; }
.abu { background: var(--muted); }

.aksi-bawah { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.tombol-simpan { width: 100%; min-height: 46px; }
.tombol-keluar { width: 100%; min-height: 44px; color: #c0392b; }
</style>

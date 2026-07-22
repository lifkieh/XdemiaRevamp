<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>Kembali</span>
    </button>

    <h1 class="title-lg judul">Pengaturan</h1>

    <!-- Profil -->
    <div class="card">
      <p class="title bagian">Profil</p>

      <div class="row foto-baris">
        <div class="thumb thumb-round avatar">{{ inisial }}</div>
        <div class="grow">
          <p class="title">Foto profil</p>
          <p class="muted">Ukuran ideal 400 x 400 piksel.</p>
        </div>
        <el-button size="small" @click="belumTersedia">Ubah</el-button>
      </div>

      <div class="isian">
        <label class="label">Nama tampilan</label>
        <el-input v-model="form.nama" placeholder="Nama kamu" />
      </div>

      <div class="isian">
        <label class="label">Bio singkat</label>
        <el-input v-model="form.bio" type="textarea" :rows="3" placeholder="Ceritakan sedikit tentang kamu" />
      </div>

      <div class="isian">
        <label class="label">Kampus</label>
        <el-input v-model="form.kampus" placeholder="Nama kampus" />
      </div>
    </div>

    <!-- Privasi -->
    <div class="card">
      <p class="title bagian">Privasi &amp; izin</p>

      <div class="isian">
        <label class="label">Siapa yang bisa lihat profil kamu</label>
        <el-select v-model="form.siapaLihat" placeholder="Pilih" class="pilihan">
          <el-option label="Semua orang" value="semua" />
          <el-option label="Hanya pengikut" value="pengikut" />
          <el-option label="Hanya kamu" value="sendiri" />
        </el-select>
      </div>

      <div class="setelan">
        <div class="grow">
          <p class="title">Profil bisa dicari</p>
          <p class="muted">Orang lain bisa menemukan kamu di Jelajah.</p>
        </div>
        <el-switch v-model="form.bisaDicari" active-color="#17a2a2" />
      </div>

      <div class="setelan">
        <div class="grow">
          <p class="title">Izinkan pesan dari siapa saja</p>
          <p class="muted">Kalau dimatikan, hanya pengikut yang bisa mengirim pesan.</p>
        </div>
        <el-switch v-model="form.pesanBebas" active-color="#17a2a2" />
      </div>
    </div>

    <!-- Tanda tangan email -->
    <div class="card">
      <p class="title bagian">Tanda tangan email</p>
      <p class="muted keterangan">Dipakai saat kamu mengirim undangan atau berkas lewat email.</p>
      <el-input v-model="form.tandaTangan" type="textarea" :rows="4" placeholder="Salam, nama, kampus" />
    </div>

    <!-- Status -->
    <div class="card">
      <p class="title bagian">Status</p>
      <div class="setelan">
        <div class="grow">
          <p class="title">
            <span class="titik" :class="form.online ? 'hijau' : 'abu'"></span>
            {{ form.online ? 'Online' : 'Offline' }}
          </p>
          <p class="muted">Tampilkan ke orang lain kalau kamu sedang aktif.</p>
        </div>
        <el-switch v-model="form.online" active-color="#17a2a2" />
      </div>
    </div>

    <!-- Notifikasi -->
    <div class="card">
      <p class="title bagian">Notifikasi</p>
      <div v-for="n in notifikasi" :key="n.id" class="setelan">
        <div class="grow">
          <p class="title">{{ n.judul }}</p>
          <p class="muted">{{ n.keterangan }}</p>
        </div>
        <el-switch v-model="n.aktif" active-color="#17a2a2" />
      </div>
    </div>

    <div class="aksi-bawah">
      <el-button type="primary" class="tombol-simpan" @click="simpan">Simpan perubahan</el-button>
      <el-button class="tombol-keluar" @click="belumTersedia">
        <i class="el-icon-switch-button"></i> Keluar akun
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  data () {
    const profil = this.$store.state.user.profil
    return {
      form: {
        nama: profil.name,
        bio: profil.bio,
        kampus: profil.campus,
        siapaLihat: 'semua',
        bisaDicari: true,
        pesanBebas: false,
        online: true,
        tandaTangan: 'Salam,\nRaka Mahendra\nMahasiswa Informatika, Universitas Brawijaya'
      },
      notifikasi: [
        { id: 'n-1', judul: 'Pengingat belajar harian', keterangan: 'Biar streak kamu nggak putus.', aktif: true },
        { id: 'n-2', judul: 'Info beasiswa baru', keterangan: 'Kabar kalau ada beasiswa yang cocok.', aktif: true },
        { id: 'n-3', judul: 'Balasan dan komentar', keterangan: 'Kalau ada yang membalas postingan kamu.', aktif: true },
        { id: 'n-4', judul: 'Undangan komunitas dan acara', keterangan: 'Ajakan gabung dari orang lain.', aktif: false },
        { id: 'n-5', judul: 'Ringkasan mingguan lewat email', keterangan: 'Rangkuman aktivitas tiap Senin pagi.', aktif: false }
      ]
    }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] }
  },
  methods: {
    simpan () {
      this.$message({ message: 'Perubahan disimpan (contoh prototipe).', type: 'success' })
    },
    belumTersedia () { this.$message('Belum aktif di prototipe ini.') }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }
.judul { margin: 0 2px 12px; }

.bagian { margin-bottom: 10px; font-size: 16px; }

.keterangan { margin-bottom: 8px; }

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

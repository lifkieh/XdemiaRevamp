<template>
  <div v-if="terbuka" class="compose">
    <!-- ================= DESKTOP: modal di tengah ================= -->
    <template v-if="isDesktop">
      <div class="latar" @click="tutup"></div>

      <div class="modal" role="dialog" aria-label="Buat postingan">
        <header class="modal-head">
          <div class="thumb thumb-round avatar">{{ inisial }}</div>
          <div class="grow">
            <p class="title">{{ nama }}</p>
            <div class="visibilitas">
              <span class="muted">Postingan ·</span>
              <el-select v-model="visibilitas" size="mini" class="pilih-visibilitas">
                <el-option label="Publik" value="Publik" />
                <el-option label="Koneksi" value="Koneksi" />
              </el-select>
            </div>
          </div>
          <button class="tap tutup" aria-label="Tutup" @click="tutup">
            <i class="el-icon-close"></i>
          </button>
        </header>

        <div class="modal-body">
          <textarea
            ref="teks"
            v-model="draf"
            class="teks"
            placeholder="Mulai buat posting"
          ></textarea>

          <!-- pratinjau lampiran: kosong, cuma contoh tampilan -->
          <div v-if="lampiran" class="pratinjau">
            <div class="pratinjau-kotak">
              <i :class="lampiran === 'Foto' ? 'el-icon-picture-outline' : 'el-icon-video-camera'"></i>
              <span>{{ lampiran }} contoh</span>
            </div>
            <button class="tap hapus-lampiran" @click="lampiran = ''">
              <i class="el-icon-delete"></i><span>Hapus</span>
            </button>
          </div>
        </div>

        <div class="baris-lampiran">
          <button class="tap opsi" @click="pilihLampiran('Foto')">
            <i class="el-icon-picture-outline"></i><span>Foto</span>
          </button>
          <button class="tap opsi" @click="pilihLampiran('Video')">
            <i class="el-icon-video-camera"></i><span>Video</span>
          </button>
          <button class="tap opsi" @click="belumTersedia">
            <i class="el-icon-document"></i><span>Tulis artikel</span>
          </button>
        </div>

        <footer class="modal-foot">
          <el-button type="primary" class="tombol-posting" @click="posting">Posting</el-button>
        </footer>
      </div>
    </template>

    <!-- ================= MOBILE: satu layar penuh ================= -->
    <div v-else class="penuh" role="dialog" aria-label="Buat postingan">
      <header class="penuh-head">
        <button class="tap kembali" aria-label="Tutup" @click="tutup">
          <i class="el-icon-arrow-left"></i>
        </button>
        <p class="penuh-judul grow">Buat postingan</p>
        <button class="tap posting-teks" @click="posting">Posting</button>
      </header>

      <div class="penuh-isi">
        <button class="media-kosong" @click="pilihLampiran('Foto')">
          <i class="el-icon-picture-outline"></i>
          <span class="media-judul">Tambah foto atau video</span>
          <span class="muted">Ketuk untuk memilih dari galeri</span>
        </button>

        <div class="row identitas">
          <div class="thumb thumb-round avatar">{{ inisial }}</div>
          <div class="grow">
            <p class="title">{{ nama }}</p>
            <p class="muted">Postingan · {{ visibilitas }}</p>
          </div>
        </div>

        <textarea
          ref="teks"
          v-model="draf"
          class="teks teks-mobile"
          placeholder="Tulis caption…"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComposePost',
  data () {
    return {
      draf: '',
      visibilitas: 'Publik',
      lampiran: ''
    }
  },
  computed: {
    terbuka () { return this.$store.state.compose.terbuka },
    isDesktop () { return this.$store.getters['layout/isDesktop'] },
    inisial () { return this.$store.getters['user/inisial'] },
    nama () { return this.$store.getters['user/nama'] }
  },
  watch: {
    terbuka (nilai) {
      if (nilai) {
        document.addEventListener('keydown', this.onEsc)
        this.$nextTick(() => {
          if (this.$refs.teks) this.$refs.teks.focus()
        })
      } else {
        document.removeEventListener('keydown', this.onEsc)
        this.draf = ''
        this.lampiran = ''
      }
    },
    // pindah antara modal dan layar penuh saat lebar berubah: fokus dipasang ulang
    isDesktop () {
      if (!this.terbuka) return
      this.$nextTick(() => {
        if (this.$refs.teks) this.$refs.teks.focus()
      })
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onEsc)
  },
  methods: {
    onEsc (e) {
      if (e.key === 'Escape') this.tutup()
    },
    tutup () { this.$store.dispatch('compose/tutup') },
    pilihLampiran (jenis) {
      this.lampiran = jenis
      this.$message('Pilih ' + jenis.toLowerCase() + ' belum aktif — ini contoh tampilan saja.')
    },
    belumTersedia () {
      this.$message('Tulis artikel belum aktif di prototipe ini.')
    },
    posting () {
      this.tutup()
      this.$message({
        message: 'Ini prototipe — postingan tidak benar-benar terkirim.',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.compose { position: relative; z-index: 3000; }

.latar {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(16, 32, 42, .45);
}

/* ---------- desktop: modal ---------- */
.modal {
  position: fixed;
  z-index: 3001;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: 0 18px 48px rgba(16, 32, 42, .28);
  overflow: hidden;
}

.modal-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
}

.avatar { width: 44px; height: 44px; background: var(--brand); color: #fff; }

.visibilitas { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
.pilih-visibilitas { width: 110px; }

.tutup { font-size: 20px; color: var(--muted); }

.modal-body { padding: 14px 16px; overflow-y: auto; }

.teks {
  width: 100%;
  min-height: 180px;
  border: 0;
  outline: none;
  resize: vertical;
  font-family: inherit;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--text);
  background: transparent;
}

.teks::placeholder { color: var(--muted); }

.pratinjau {
  margin-top: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 10px;
}

.pratinjau-kotak {
  height: 140px;
  border-radius: var(--radius-sm);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.pratinjau-kotak i { font-size: 26px; }

.hapus-lampiran { margin-top: 6px; color: #c0392b; }

.baris-lampiran {
  display: flex;
  gap: 6px;
  padding: 6px 12px;
  border-top: 1px solid var(--line);
}

.opsi { padding: 0 12px; font-size: 13.5px; }
.opsi i { font-size: 17px; }

.modal-foot {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px 14px;
}

.tombol-posting { min-height: 44px; min-width: 104px; }

/* ---------- mobile: satu layar penuh ---------- */
.penuh {
  position: fixed;
  inset: 0;
  z-index: 3001;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.penuh-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}

.penuh-judul {
  margin: 0;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
}

.kembali { font-size: 20px; }

.posting-teks {
  color: var(--brand);
  font-weight: 700;
  font-size: 14.5px;
  padding: 0 12px;
}

.penuh-isi {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 14px 24px;
}

.media-kosong {
  width: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--card);
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  color: var(--muted);
  font-family: inherit;
  cursor: pointer;
}

.media-kosong i { font-size: 34px; color: var(--brand); }
.media-judul { font-size: 14.5px; font-weight: 600; color: var(--text); }

.identitas {
  margin-top: 14px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.identitas .avatar { width: 40px; height: 40px; }

.teks-mobile {
  min-height: 140px;
  margin-top: 10px;
  font-size: 15px;
}
</style>

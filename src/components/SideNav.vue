<template>
  <aside class="sidenav" :aria-label="$t('nav.mainNav')">
    <div class="sidenav-isi">
      <router-link to="/" class="logo">
        <span class="logo-mark">xδ</span>
        <span class="logo-teks">Xdemia</span>
      </router-link>

      <nav class="menu">
        <router-link
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="item"
          active-class="is-active"
          :exact="item.exact"
        >
          <i :class="item.ikon"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <button class="tulis" @click="tulis">
        <i class="el-icon-edit"></i>
        <span>{{ $t('nav.write') }}</span>
      </button>

      <!-- Sekunder: tujuan yang tidak masuk lima nav utama -->
      <nav class="pintasan-samping" :aria-label="$t('nav.shortcuts')">
        <p class="pintasan-samping-judul">{{ $t('nav.shortcuts') }}</p>
        <router-link
          v-for="p in pintasan"
          :key="p.path"
          :to="p.path"
          class="pintas-samping"
        >
          <i :class="p.ikon"></i>
          <span>{{ p.label }}</span>
        </router-link>
      </nav>

      <p class="catatan-kaki">{{ $t('common.prototypeNote') }}</p>

      <div class="kartu-user">
        <div class="thumb thumb-round avatar-kecil">{{ inisial }}</div>
        <div class="grow">
          <p class="title">{{ nama }}</p>
          <p class="muted">{{ handle }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SideNav',
  computed: {
    menu () {
      return [
        { path: '/', label: this.$t('nav.home'), ikon: 'el-icon-house', exact: true },
        { path: '/explore', label: this.$t('nav.explore'), ikon: 'el-icon-search', exact: false },
        { path: '/learn', label: this.$t('nav.learn'), ikon: 'el-icon-reading', exact: false },
        { path: '/scholarships', label: this.$t('nav.scholarships'), ikon: 'el-icon-medal', exact: false },
        { path: '/you', label: this.$t('nav.you'), ikon: 'el-icon-user', exact: false }
      ]
    },
    pintasan () {
      return [
        { path: '/events', label: this.$t('nav.events'), ikon: 'el-icon-date' },
        { path: '/jurnal', label: this.$t('nav.journals'), ikon: 'el-icon-notebook-2' },
        { path: '/drive', label: this.$t('nav.drive'), ikon: 'el-icon-folder' },
        { path: '/you?tab=tersimpan', label: this.$t('nav.saved'), ikon: 'el-icon-collection-tag' }
      ]
    },
    inisial () { return this.$store.getters['user/inisial'] },
    nama () { return this.$store.getters['user/nama'] },
    handle () { return this.$store.state.user.profil.handle }
  },
  methods: {
    tulis () { this.$store.dispatch('compose/buka') }
  }
}
</script>

<style scoped>
.sidenav-isi {
  position: sticky;
  top: 0;
  padding: 14px 8px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 100vh;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 14px;
}

.logo-mark {
  font-size: 26px;
  font-weight: 800;
  color: var(--brand);
  letter-spacing: -1px;
}

.logo-teks {
  font-size: 17px;
  font-weight: 700;
}

.menu { display: flex; flex-direction: column; gap: 2px; }

.item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  padding: 0 14px;
  border-radius: 999px;
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
}

.item i { font-size: 20px; color: var(--muted); }

.item:hover { background: var(--brand-soft); }

.item.is-active { color: var(--brand); background: var(--brand-soft); }
.item.is-active i { color: var(--brand); }

.tulis {
  margin: 12px 6px 0;
  min-height: 46px;
  border: 0;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tulis:hover { background: var(--brand-dark); }

/* sengaja lebih tenang dari nav utama: teks lebih kecil, tanpa warna brand */
.pintasan-samping {
  margin: 18px 6px 0;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.pintasan-samping-judul {
  margin: 0 8px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--muted);
}

.pintas-samping {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 13.5px;
  font-weight: 500;
}

.pintas-samping i { font-size: 16px; color: var(--muted); }

.pintas-samping:hover { background: var(--bg); }
.pintas-samping:hover i { color: var(--text); }

/* menutup kolom sebelum kartu profil, sekaligus mengurangi rongga di tengah */
.catatan-kaki {
  margin: auto 14px 10px;
  font-size: 11.5px;
  color: var(--muted);
}

.kartu-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--line);
}

.kartu-user .title { font-size: 14px; }
.kartu-user .grow { min-width: 0; }
.kartu-user p { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.avatar-kecil {
  width: 36px;
  height: 36px;
  background: var(--brand);
  color: #fff;
}
</style>

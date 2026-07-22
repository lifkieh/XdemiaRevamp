<template>
  <aside class="sidenav" aria-label="Navigasi utama">
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
        <span>Tulis</span>
      </button>

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
  data () {
    return {
      menu: [
        { path: '/', label: 'Beranda', ikon: 'el-icon-house', exact: true },
        { path: '/explore', label: 'Jelajah', ikon: 'el-icon-search', exact: false },
        { path: '/learn', label: 'Belajar', ikon: 'el-icon-reading', exact: false },
        { path: '/scholarships', label: 'Beasiswa', ikon: 'el-icon-medal', exact: false },
        { path: '/you', label: 'Kamu', ikon: 'el-icon-user', exact: false }
      ]
    }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] },
    nama () { return this.$store.getters['user/nama'] },
    handle () { return this.$store.state.user.profil.handle }
  },
  methods: {
    tulis () { this.$message('Tulis postingan belum aktif di prototipe ini.') }
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

.kartu-user {
  margin-top: auto;
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

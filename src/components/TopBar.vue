<template>
  <header class="topbar" :class="{ 'topbar-desktop': isDesktop }">
    <div class="topbar-inner">
      <router-link v-if="!isDesktop" to="/" class="logo" aria-label="Beranda Xdemia">xδ</router-link>

      <!-- desktop: search jadi pintu utama, langsung di top bar -->
      <div v-if="isDesktop" class="cari grow">
        <el-input
          v-model="kueri"
          placeholder="Cari orang, komunitas, kampus, jurnal"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="cari"
        />
      </div>
      <span v-else class="grow"></span>

      <router-link to="/keranjang" class="tap topbar-btn btn-keranjang">
        <el-badge :value="jumlahKeranjang" :hidden="jumlahKeranjang === 0">
          <i class="el-icon-shopping-cart-2"></i>
        </el-badge>
        <span>Keranjang</span>
      </router-link>

      <button class="tap topbar-btn btn-chat" @click="$emit('buka-chat')">
        <i class="el-icon-chat-dot-round"></i>
        <span>Chat</span>
      </button>

      <button class="tap topbar-btn btn-notif" @click="$emit('buka-notif')">
        <el-badge :value="notifBelumDibaca" :hidden="notifBelumDibaca === 0">
          <i class="el-icon-bell"></i>
        </el-badge>
        <span>Notif</span>
      </button>

      <router-link to="/you" class="avatar-tap" aria-label="Halaman kamu">
        <span class="avatar">{{ inisial }}</span>
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TopBar',
  data () {
    return { kueri: '' }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] },
    notifBelumDibaca () { return this.$store.state.user.notifBelumDibaca },
    jumlahKeranjang () { return this.$store.getters['cart/jumlahItem'] },
    isDesktop () { return this.$store.getters['layout/isDesktop'] }
  },
  methods: {
    cari () {
      const q = this.kueri.trim()
      if (!q) return
      this.$router.push({ path: '/explore', query: { q } }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}

.topbar-inner {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 56px;
  padding: 0 12px;
}

.topbar-desktop .topbar-inner {
  height: 64px;
  gap: 8px;
  padding: 0 14px;
}

.cari { max-width: 340px; }

.logo {
  font-size: 22px;
  font-weight: 800;
  color: var(--brand);
  letter-spacing: -1px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding-right: 6px;
}

.topbar-btn {
  flex-direction: column;
  gap: 0;
  font-size: 11px;
  line-height: 1.1;
  padding: 0 6px;
}

.topbar-btn i { font-size: 19px; }
.topbar-btn span { white-space: nowrap; }

/* area tap 44px, lingkaran visual tetap 36px */
.avatar-tap {
  min-width: var(--tap);
  min-height: var(--tap);
  margin-left: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--brand);
  color: #fff;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.topbar >>> .el-badge__content.is-fixed {
  top: 8px;
  right: 8px;
  border: 0;
  height: 16px;
  line-height: 16px;
  padding: 0 5px;
}
</style>

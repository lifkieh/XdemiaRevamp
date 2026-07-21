<template>
  <header class="topbar">
    <div class="topbar-inner">
      <router-link to="/" class="logo" aria-label="Beranda Xdemia">xδ</router-link>

      <span class="grow"></span>

      <button class="tap topbar-btn" @click="$emit('buka-chat')">
        <i class="el-icon-chat-dot-round"></i>
        <span>Chat</span>
      </button>

      <button class="tap topbar-btn" @click="$emit('buka-notif')">
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
  computed: {
    inisial () { return this.$store.getters['user/inisial'] },
    notifBelumDibaca () { return this.$store.state.user.notifBelumDibaca }
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

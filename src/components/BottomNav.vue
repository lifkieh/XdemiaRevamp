<template>
  <nav class="bottomnav" :aria-label="$t('nav.mainNav')">
    <div class="bottomnav-inner">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="navtab"
        active-class="is-active"
        :exact="tab.exact"
      >
        <i :class="tab.ikon"></i>
        <span>{{ tab.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'BottomNav',
  computed: {
    tabs () {
      return [
        { path: '/home', label: this.$t('nav.home'), ikon: 'el-icon-house', exact: true },
        { path: '/explore', label: this.$t('nav.explore'), ikon: 'el-icon-search', exact: false },
        { path: '/learn', label: this.$t('nav.learn'), ikon: 'el-icon-reading', exact: false },
        { path: '/scholarships', label: this.$t('nav.scholarships'), ikon: 'el-icon-medal', exact: false },
        { path: '/you', label: this.$t('nav.you'), ikon: 'el-icon-user', exact: false }
      ]
    }
  }
}
</script>

<style scoped>
.bottomnav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  pointer-events: none;
}

.bottomnav-inner {
  max-width: var(--maxw);
  margin: 0 auto;
  display: flex;
  background: var(--card);
  border-top: 1px solid var(--line);
  padding: 4px 4px calc(4px + env(safe-area-inset-bottom));
  pointer-events: auto;
}

.navtab {
  flex: 1;
  min-height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-sm);
}

.navtab i { font-size: 21px; }

.navtab:active { background: var(--bg); }

.navtab.is-active {
  color: var(--brand);
}
</style>

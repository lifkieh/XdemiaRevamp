<template>
  <div id="app" :class="isDesktop ? 'app-desktop' : 'app-container'">
    <SideNav v-if="isDesktop" />

    <div class="kolom-tengah">
      <TopBar
        @buka-chat="bukaChat"
        @buka-notif="bukaNotif"
      />
      <main>
        <router-view />
      </main>
    </div>

    <RightRail v-if="isDesktop" class="rail" />

    <BottomNav v-if="!isDesktop" />

    <ChatDrawer :terbuka="chatTerbuka" @tutup="chatTerbuka = false" />
    <NotifDrawer :terbuka="notifTerbuka" @tutup="notifTerbuka = false" />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import SideNav from '@/components/SideNav.vue'
import RightRail from '@/components/RightRail.vue'
import ChatDrawer from '@/components/ChatDrawer.vue'
import NotifDrawer from '@/components/NotifDrawer.vue'

export default {
  name: 'App',
  components: { TopBar, BottomNav, SideNav, RightRail, ChatDrawer, NotifDrawer },
  data () {
    return {
      chatTerbuka: false,
      notifTerbuka: false
    }
  },
  computed: {
    isDesktop () { return this.$store.getters['layout/isDesktop'] }
  },
  created () {
    this.onResize = () => {
      if (this.tungguFrame) return
      this.tungguFrame = true
      window.requestAnimationFrame(() => {
        this.tungguFrame = false
        this.$store.commit('layout/SET_LEBAR', window.innerWidth)
      })
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    // hanya satu overlay terbuka dalam satu waktu
    bukaChat () {
      this.notifTerbuka = false
      this.chatTerbuka = true
    },
    bukaNotif () {
      this.chatTerbuka = false
      this.notifTerbuka = true
    }
  }
}
</script>

<style scoped>
.kolom-tengah { min-width: 0; }

.app-desktop .kolom-tengah {
  border-left: 1px solid var(--line);
  border-right: 1px solid var(--line);
  background: var(--bg);
  min-height: 100vh;
}
</style>

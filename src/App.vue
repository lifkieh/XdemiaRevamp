<template>
  <div id="app" class="app-container">
    <TopBar
      @buka-chat="chatTerbuka = true"
      @buka-notif="notifTerbuka = true"
    />

    <main>
      <router-view />
    </main>

    <BottomNav />

    <ChatDrawer :terbuka="chatTerbuka" @tutup="chatTerbuka = false" />
    <NotifDrawer :terbuka="notifTerbuka" @tutup="notifTerbuka = false" />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import ChatDrawer from '@/components/ChatDrawer.vue'
import NotifDrawer from '@/components/NotifDrawer.vue'

export default {
  name: 'App',
  components: { TopBar, BottomNav, ChatDrawer, NotifDrawer },
  data () {
    return {
      chatTerbuka: false,
      notifTerbuka: false
    }
  }
}
</script>

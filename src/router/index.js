import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  // --- publik: landing & login ---
  { path: '/', name: 'landing', component: () => import(/* webpackChunkName: "landing" */ '@/views/Landing.vue'), meta: { judul: 'Xdemia', public: true } },
  { path: '/login', name: 'login', component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'), meta: { judul: 'Masuk', public: true } },

  // --- lima tab utama ---
  { path: '/home', name: 'home', component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'), meta: { judul: 'Beranda', requiresAuth: true } },
  { path: '/explore', name: 'explore', component: () => import(/* webpackChunkName: "explore" */ '@/views/Explore.vue'), meta: { judul: 'Jelajah', requiresAuth: true } },
  { path: '/learn', name: 'learn', component: () => import(/* webpackChunkName: "learn" */ '@/views/Learn.vue'), meta: { judul: 'Belajar', requiresAuth: true } },
  { path: '/scholarships', name: 'scholarships', component: () => import(/* webpackChunkName: "scholarships" */ '@/views/Scholarships.vue'), meta: { judul: 'Beasiswa', requiresAuth: true } },
  { path: '/you', name: 'you', component: () => import(/* webpackChunkName: "you" */ '@/views/You.vue'), meta: { judul: 'Kamu', requiresAuth: true } },

  // --- daftar lain ---
  { path: '/events', name: 'events', component: () => import(/* webpackChunkName: "events" */ '@/views/Events.vue'), meta: { judul: 'Acara', requiresAuth: true } },
  { path: '/jurnal', name: 'journals', component: () => import(/* webpackChunkName: "journals" */ '@/views/Journals.vue'), meta: { judul: 'Jurnal', requiresAuth: true } },
  { path: '/newsroom', name: 'newsroom', component: () => import(/* webpackChunkName: "newsroom" */ '@/views/Newsroom.vue'), meta: { judul: 'Newsroom', requiresAuth: true } },
  { path: '/keranjang', name: 'cart', component: () => import(/* webpackChunkName: "cart" */ '@/views/Cart.vue'), meta: { judul: 'Keranjang', requiresAuth: true } },
  { path: '/drive', name: 'drive', component: () => import(/* webpackChunkName: "drive" */ '@/views/Drive.vue'), meta: { judul: 'Drive', requiresAuth: true } },
  { path: '/pengaturan', name: 'settings', component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'), meta: { judul: 'Pengaturan', requiresAuth: true } },

  // --- halaman detail ---
  { path: '/learn/:id', name: 'learn-detail', component: () => import(/* webpackChunkName: "learn-detail" */ '@/views/LearnDetail.vue'), meta: { judul: 'Materi', requiresAuth: true } },
  { path: '/materi/:id', name: 'materi-detail', component: () => import(/* webpackChunkName: "learn-detail" */ '@/views/LearnDetail.vue'), meta: { judul: 'Materi', requiresAuth: true } },
  { path: '/beasiswa/:id', name: 'scholarship-detail', component: () => import(/* webpackChunkName: "scholarship-detail" */ '@/views/ScholarshipDetail.vue'), meta: { judul: 'Beasiswa', requiresAuth: true } },
  { path: '/acara/:id', name: 'event-detail', component: () => import(/* webpackChunkName: "event-detail" */ '@/views/EventDetail.vue'), meta: { judul: 'Acara', requiresAuth: true } },
  { path: '/artikel/:id', name: 'article-detail', component: () => import(/* webpackChunkName: "article-detail" */ '@/views/ArticleDetail.vue'), meta: { judul: 'Artikel', requiresAuth: true } },
  { path: '/community/:id', name: 'community-detail', component: () => import(/* webpackChunkName: "community" */ '@/views/CommunityDetail.vue'), meta: { judul: 'Komunitas', requiresAuth: true } },
  { path: '/kampus/:id', name: 'Institute-detail', component: () => import(/* webpackChunkName: "institution" */ '@/views/InstitutionDetail.vue'), meta: { judul: 'Kampus', requiresAuth: true } },
  { path: '/organisasi/:id', name: 'org-detail', component: () => import(/* webpackChunkName: "institution" */ '@/views/InstitutionDetail.vue'), meta: { judul: 'Organisasi', requiresAuth: true } },
  { path: '/jurnal/:id', name: 'journal-detail', component: () => import(/* webpackChunkName: "journal-detail" */ '@/views/JournalDetail.vue'), meta: { judul: 'Jurnal', requiresAuth: true } },
  { path: '/profil/:id', name: 'person-profile', component: () => import(/* webpackChunkName: "person" */ '@/views/PersonProfile.vue'), meta: { judul: 'Profil', requiresAuth: true } },

  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () { return { x: 0, y: 0 } }
})

router.beforeEach((to, from, next) => {
  const sudahMasuk = store.getters['auth/sudahMasuk']

  if (to.meta.requiresAuth && !sudahMasuk) {
    next({ name: 'login', query: to.fullPath !== '/home' ? { next: to.fullPath } : {} })
    return
  }

  if (to.meta.public && sudahMasuk && (to.name === 'landing' || to.name === 'login')) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router

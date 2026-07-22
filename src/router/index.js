import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // --- lima tab utama ---
  { path: '/', name: 'home', component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'), meta: { judul: 'Beranda' } },
  { path: '/explore', name: 'explore', component: () => import(/* webpackChunkName: "explore" */ '@/views/Explore.vue'), meta: { judul: 'Jelajah' } },
  { path: '/learn', name: 'learn', component: () => import(/* webpackChunkName: "learn" */ '@/views/Learn.vue'), meta: { judul: 'Belajar' } },
  { path: '/scholarships', name: 'scholarships', component: () => import(/* webpackChunkName: "scholarships" */ '@/views/Scholarships.vue'), meta: { judul: 'Beasiswa' } },
  { path: '/you', name: 'you', component: () => import(/* webpackChunkName: "you" */ '@/views/You.vue'), meta: { judul: 'Kamu' } },

  // --- daftar lain ---
  { path: '/events', name: 'events', component: () => import(/* webpackChunkName: "events" */ '@/views/Events.vue'), meta: { judul: 'Acara' } },
  { path: '/jurnal', name: 'journals', component: () => import(/* webpackChunkName: "journals" */ '@/views/Journals.vue'), meta: { judul: 'Jurnal' } },
  { path: '/keranjang', name: 'cart', component: () => import(/* webpackChunkName: "cart" */ '@/views/Cart.vue'), meta: { judul: 'Keranjang' } },
  { path: '/drive', name: 'drive', component: () => import(/* webpackChunkName: "drive" */ '@/views/Drive.vue'), meta: { judul: 'Drive' } },
  { path: '/pengaturan', name: 'settings', component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'), meta: { judul: 'Pengaturan' } },

  // --- halaman detail ---
  { path: '/learn/:id', name: 'learn-detail', component: () => import(/* webpackChunkName: "learn-detail" */ '@/views/LearnDetail.vue'), meta: { judul: 'Materi' } },
  { path: '/materi/:id', name: 'materi-detail', component: () => import(/* webpackChunkName: "learn-detail" */ '@/views/LearnDetail.vue'), meta: { judul: 'Materi' } },
  { path: '/beasiswa/:id', name: 'scholarship-detail', component: () => import(/* webpackChunkName: "scholarship-detail" */ '@/views/ScholarshipDetail.vue'), meta: { judul: 'Beasiswa' } },
  { path: '/acara/:id', name: 'event-detail', component: () => import(/* webpackChunkName: "event-detail" */ '@/views/EventDetail.vue'), meta: { judul: 'Acara' } },
  { path: '/artikel/:id', name: 'article-detail', component: () => import(/* webpackChunkName: "article-detail" */ '@/views/ArticleDetail.vue'), meta: { judul: 'Artikel' } },
  { path: '/community/:id', name: 'community-detail', component: () => import(/* webpackChunkName: "community" */ '@/views/CommunityDetail.vue'), meta: { judul: 'Komunitas' } },
  { path: '/kampus/:id', name: 'campus-detail', component: () => import(/* webpackChunkName: "institution" */ '@/views/InstitutionDetail.vue'), meta: { judul: 'Kampus' } },
  { path: '/organisasi/:id', name: 'org-detail', component: () => import(/* webpackChunkName: "institution" */ '@/views/InstitutionDetail.vue'), meta: { judul: 'Organisasi' } },
  { path: '/jurnal/:id', name: 'journal-detail', component: () => import(/* webpackChunkName: "journal-detail" */ '@/views/JournalDetail.vue'), meta: { judul: 'Jurnal' } },
  { path: '/profil/:id', name: 'person-profile', component: () => import(/* webpackChunkName: "person" */ '@/views/PersonProfile.vue'), meta: { judul: 'Profil' } },

  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () { return { x: 0, y: 0 } }
})

export default router

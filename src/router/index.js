import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'), meta: { judul: 'Beranda' } },
  { path: '/explore', name: 'explore', component: () => import(/* webpackChunkName: "explore" */ '@/views/Explore.vue'), meta: { judul: 'Jelajah' } },
  { path: '/learn', name: 'learn', component: () => import(/* webpackChunkName: "learn" */ '@/views/Learn.vue'), meta: { judul: 'Belajar' } },
  { path: '/learn/:id', name: 'learn-detail', component: () => import(/* webpackChunkName: "learn-detail" */ '@/views/LearnDetail.vue'), meta: { judul: 'Materi' } },
  { path: '/scholarships', name: 'scholarships', component: () => import(/* webpackChunkName: "scholarships" */ '@/views/Scholarships.vue'), meta: { judul: 'Beasiswa' } },
  { path: '/you', name: 'you', component: () => import(/* webpackChunkName: "you" */ '@/views/You.vue'), meta: { judul: 'Kamu' } },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () { return { x: 0, y: 0 } }
})

export default router

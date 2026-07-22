// Satu sumber state untuk UI membuat postingan.
// Dipicu dari tombol Tulis di sidebar maupun composer di Beranda.
export default {
  namespaced: true,
  state: () => ({
    terbuka: false
  }),
  mutations: {
    BUKA (state) { state.terbuka = true },
    TUTUP (state) { state.terbuka = false }
  },
  actions: {
    buka ({ commit }) { commit('BUKA') },
    tutup ({ commit }) { commit('TUTUP') }
  }
}

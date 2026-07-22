export default {
  namespaced: true,
  state: () => ({
    masuk: false
  }),
  getters: {
    sudahMasuk: (state) => state.masuk
  },
  mutations: {
    SET_MASUK (state, nilai) { state.masuk = nilai }
  },
  actions: {
    // Prototipe: terima email + password apa saja yang tidak kosong
    login ({ commit }, { email, password }) {
      if (!email || !password) return false
      commit('SET_MASUK', true)
      return true
    },
    logout ({ commit }) { commit('SET_MASUK', false) }
  }
}

// Beasiswa & materi yang disimpan user. Cukup di memori — prototipe tanpa API.
export default {
  namespaced: true,
  state: () => ({
    beasiswa: ['s-2'],
    materi: ['c-3']
  }),
  getters: {
    isBeasiswaTersimpan: (state) => (id) => state.beasiswa.indexOf(id) !== -1,
    isMateriTersimpan: (state) => (id) => state.materi.indexOf(id) !== -1,
    jumlahTersimpan: (state) => state.beasiswa.length + state.materi.length
  },
  mutations: {
    // dipakai plugin persist saat memuat isi localStorage
    HYDRATE (state, data) {
      state.beasiswa = data.beasiswa
      state.materi = data.materi
    },
    TOGGLE_BEASISWA (state, id) {
      const i = state.beasiswa.indexOf(id)
      if (i === -1) state.beasiswa.push(id)
      else state.beasiswa.splice(i, 1)
    },
    TOGGLE_MATERI (state, id) {
      const i = state.materi.indexOf(id)
      if (i === -1) state.materi.push(id)
      else state.materi.splice(i, 1)
    }
  },
  actions: {
    toggleBeasiswa ({ commit }, id) { commit('TOGGLE_BEASISWA', id) },
    toggleMateri ({ commit }, id) { commit('TOGGLE_MATERI', id) }
  }
}

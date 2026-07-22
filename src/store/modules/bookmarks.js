// Semua yang disimpan user. Satu modul untuk empat jenis isi supaya
// tab "Tersimpan" di profil bisa menampilkan semuanya sekaligus.
export const JENIS = ['beasiswa', 'materi', 'artikel', 'acara']

export default {
  namespaced: true,
  state: () => ({
    beasiswa: ['s-2'],
    materi: ['c-3'],
    artikel: ['ar-2'],
    acara: ['ev-1']
  }),
  getters: {
    isBeasiswaTersimpan: (state) => (id) => state.beasiswa.indexOf(id) !== -1,
    isMateriTersimpan: (state) => (id) => state.materi.indexOf(id) !== -1,
    isArtikelTersimpan: (state) => (id) => state.artikel.indexOf(id) !== -1,
    isAcaraTersimpan: (state) => (id) => state.acara.indexOf(id) !== -1,
    isTersimpan: (state) => (jenis, id) => (state[jenis] || []).indexOf(id) !== -1,
    jumlahTersimpan: (state) => JENIS.reduce((n, j) => n + state[j].length, 0)
  },
  mutations: {
    // dipakai plugin persist saat memuat isi localStorage
    HYDRATE (state, data) {
      JENIS.forEach((j) => { state[j] = data[j] || [] })
    },
    TOGGLE (state, { jenis, id }) {
      const daftar = state[jenis]
      if (!daftar) return
      const i = daftar.indexOf(id)
      if (i === -1) daftar.push(id)
      else daftar.splice(i, 1)
    }
  },
  actions: {
    toggle ({ commit }, muatan) { commit('TOGGLE', muatan) },
    toggleBeasiswa ({ commit }, id) { commit('TOGGLE', { jenis: 'beasiswa', id }) },
    toggleMateri ({ commit }, id) { commit('TOGGLE', { jenis: 'materi', id }) },
    toggleArtikel ({ commit }, id) { commit('TOGGLE', { jenis: 'artikel', id }) },
    toggleAcara ({ commit }, id) { commit('TOGGLE', { jenis: 'acara', id }) }
  }
}

import data from '@/mock/cart.json'

// Keranjang dummy: cukup untuk menampilkan jumlah item dan total harga.
export default {
  namespaced: true,
  state: () => ({
    item: data.item.map((i) => ({ ...i })),
    riwayat: data.riwayat.map((i) => ({ ...i }))
  }),
  getters: {
    jumlahItem: (state) => state.item.reduce((n, i) => n + i.jumlah, 0),
    total: (state) => state.item.reduce((n, i) => n + i.harga * i.jumlah, 0)
  },
  mutations: {
    HAPUS (state, id) {
      const i = state.item.findIndex((x) => x.id === id)
      if (i !== -1) state.item.splice(i, 1)
    },
    KOSONGKAN (state) { state.item = [] }
  },
  actions: {
    hapus ({ commit }, id) { commit('HAPUS', id) },
    kosongkan ({ commit }) { commit('KOSONGKAN') }
  }
}

import profil from '@/mock/user.json'

export default {
  namespaced: true,
  state: () => ({
    profil,
    notifBelumDibaca: 2
  }),
  getters: {
    nama: (state) => state.profil.name,
    inisial: (state) => state.profil.initial,
    streak: (state) => state.profil.streak,
    peran: (state) => state.profil.peran || 'mahasiswa'
  },
  mutations: {
    BACA_SEMUA_NOTIF (state) { state.notifBelumDibaca = 0 },
    SET_PERAN (state, peran) { state.profil.peran = peran }
  },
  actions: {
    bacaSemuaNotif ({ commit }) { commit('BACA_SEMUA_NOTIF') },
    gantiPeran ({ commit }, peran) { commit('SET_PERAN', peran) }
  }
}

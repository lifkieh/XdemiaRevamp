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
    streak: (state) => state.profil.streak
  },
  mutations: {
    BACA_SEMUA_NOTIF (state) { state.notifBelumDibaca = 0 }
  },
  actions: {
    bacaSemuaNotif ({ commit }) { commit('BACA_SEMUA_NOTIF') }
  }
}

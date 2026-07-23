// Satu sumber kebenaran untuk mode tampilan.
// Dipakai supaya bottom nav (mobile) dan sidebar (desktop) tidak pernah muncul bersamaan.
export const BATAS_DESKTOP = 900

export default {
  namespaced: true,
  state: () => ({
    lebar: typeof window !== 'undefined' ? window.innerWidth : 1024,
    tema: 'terang'
  }),
  getters: {
    isDesktop: (state) => state.lebar >= BATAS_DESKTOP,
    isMobile: (state) => state.lebar < BATAS_DESKTOP,
    isGelap: (state) => state.tema === 'gelap'
  },
  mutations: {
    SET_LEBAR (state, lebar) { state.lebar = lebar },
    SET_TEMA (state, tema) { state.tema = tema }
  },
  actions: {
    toggleTema ({ commit, state }) {
      commit('SET_TEMA', state.tema === 'gelap' ? 'terang' : 'gelap')
    }
  }
}

// Satu sumber kebenaran untuk mode tampilan.
// Dipakai supaya bottom nav (mobile) dan sidebar (desktop) tidak pernah muncul bersamaan.
export const BATAS_DESKTOP = 900

export default {
  namespaced: true,
  state: () => ({
    lebar: typeof window !== 'undefined' ? window.innerWidth : 1024
  }),
  getters: {
    isDesktop: (state) => state.lebar >= BATAS_DESKTOP,
    isMobile: (state) => state.lebar < BATAS_DESKTOP
  },
  mutations: {
    SET_LEBAR (state, lebar) { state.lebar = lebar }
  }
}

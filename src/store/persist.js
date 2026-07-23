// Plugin Vuex kecil: menyimpan bookmark ke localStorage supaya pilihan user
// tidak hilang saat halaman di-refresh. Hanya modul "bookmarks" yang dipersist.
import { JENIS } from './modules/bookmarks'

const KEY = 'xdemia:bookmarks'
const KEY_AUTH = 'xdemia:auth'
const KEY_PERAN = 'xdemia:peran'
const KEY_TEMA = 'xdemia:tema'

const daftarString = (nilai) =>
  Array.isArray(nilai) ? nilai.filter((v) => typeof v === 'string') : []

// Baca + validasi isi localStorage. Kembalikan null kalau kosong/rusak
// supaya pemanggil bisa memakai nilai bawaan.
export function bacaBookmarks () {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const mentah = window.localStorage.getItem(KEY)
    if (!mentah) return null
    const data = JSON.parse(mentah)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null
    const hasil = {}
    JENIS.forEach((j) => { hasil[j] = daftarString(data[j]) })
    return hasil
  } catch (e) {
    // JSON rusak, localStorage diblokir, atau mode privat penuh
    return null
  }
}

function tulisBookmarks (bookmarks) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    const isi = {}
    JENIS.forEach((j) => { isi[j] = bookmarks[j] })
    window.localStorage.setItem(KEY, JSON.stringify(isi))
  } catch (e) {
    // kuota penuh atau storage ditolak — abaikan, app tetap jalan
  }
}

function bacaAuth () {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    return window.localStorage.getItem(KEY_AUTH) === '1'
  } catch (e) {
    return false
  }
}

function tulisAuth (masuk) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(KEY_AUTH, masuk ? '1' : '0')
  } catch (e) {
    // abaikan
  }
}

function bacaPeran () {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage.getItem(KEY_PERAN)
  } catch (e) {
    return null
  }
}

function tulisPeran (peran) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(KEY_PERAN, peran)
  } catch (e) {
    // abaikan
  }
}

function bacaTema () {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage.getItem(KEY_TEMA)
  } catch (e) {
    return null
  }
}

function tulisTema (tema) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(KEY_TEMA, tema)
  } catch (e) {
    // abaikan
  }
}

function terapkanTema (tema) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', tema === 'gelap' ? 'dark' : 'light')
}

export default function persist (store) {
  const tersimpan = bacaBookmarks()
  if (tersimpan) store.commit('bookmarks/HYDRATE', tersimpan)

  if (bacaAuth()) store.commit('auth/SET_MASUK', true)

  const peranTersimpan = bacaPeran()
  if (peranTersimpan) store.commit('user/SET_PERAN', peranTersimpan)

  const temaTersimpan = bacaTema()
  if (temaTersimpan) store.commit('layout/SET_TEMA', temaTersimpan)
  terapkanTema(store.state.layout.tema)

  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('bookmarks/') === 0) {
      tulisBookmarks(state.bookmarks)
      return
    }
    if (mutation.type.indexOf('auth/') === 0) {
      tulisAuth(state.auth.masuk)
      return
    }
    if (mutation.type === 'user/SET_PERAN') {
      tulisPeran(state.user.profil.peran)
      return
    }
    if (mutation.type === 'layout/SET_TEMA') {
      tulisTema(state.layout.tema)
      terapkanTema(state.layout.tema)
    }
  })
}

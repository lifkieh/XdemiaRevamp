// Plugin Vuex kecil: menyimpan bookmark (beasiswa & materi) ke localStorage
// supaya pilihan user tidak hilang saat halaman di-refresh.
// Hanya modul "bookmarks" yang dipersist, bukan seluruh store.

const KEY = 'xdemia:bookmarks'

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
    return {
      beasiswa: daftarString(data.beasiswa),
      materi: daftarString(data.materi)
    }
  } catch (e) {
    // JSON rusak, localStorage diblokir, atau mode privat penuh
    return null
  }
}

function tulisBookmarks (bookmarks) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(KEY, JSON.stringify({
      beasiswa: bookmarks.beasiswa,
      materi: bookmarks.materi
    }))
  } catch (e) {
    // kuota penuh atau storage ditolak — abaikan, app tetap jalan
  }
}

export default function persist (store) {
  const tersimpan = bacaBookmarks()
  if (tersimpan) store.commit('bookmarks/HYDRATE', tersimpan)

  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('bookmarks/') !== 0) return
    tulisBookmarks(state.bookmarks)
  })
}

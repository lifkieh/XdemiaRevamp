// Pemformat yang sadar locale. Semua angka, tanggal, durasi, dan waktu relatif
// lewat sini supaya tidak ada satuan atau nama bulan yang tertanam di data.
import i18n from './index'

const LOCALE = { en: 'en-GB', id: 'id-ID' }

function tagLocale () {
  return LOCALE[i18n.locale] || LOCALE.en
}

// { menit: 10 } | { jam: 2 } | { hari: 3 } | { minggu: 1 } | { kemarin: true }
export function waktuRelatif (nilai) {
  if (!nilai) return ''
  if (typeof nilai === 'string') return nilai
  if (nilai.kemarin) return i18n.t('common.kemarin')
  if (nilai.bulan) return i18n.t('common.bulanLalu', { n: nilai.bulan })
  if (nilai.minggu) return i18n.t('common.mingguLalu', { n: nilai.minggu })
  if (nilai.hari) return i18n.t('common.hariLalu', { n: nilai.hari })
  if (nilai.jam) return i18n.t('common.jamLalu', { n: nilai.jam })
  if (nilai.menit) return i18n.t('common.menitLalu', { n: nilai.menit })
  return i18n.t('common.baruSaja')
}

// "2026-07-26" -> "Saturday, 26 July 2026" / "Sabtu, 26 Juli 2026"
export function tanggalPanjang (iso, denganHari) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  const opsi = denganHari
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'long', year: 'numeric' }
  return new Intl.DateTimeFormat(tagLocale(), opsi).format(d)
}

// "2021-03" -> "March 2021" / "Maret 2021"
export function bulanTahun (iso) {
  if (!iso) return ''
  const d = new Date(iso + '-01T00:00:00')
  return new Intl.DateTimeFormat(tagLocale(), { month: 'long', year: 'numeric' }).format(d)
}

// { jam: 19, menit: 30 } -> "19.30" / "7:30 pm"
export function jamMenit (nilai) {
  if (!nilai) return ''
  const d = new Date(2026, 0, 1, nilai.jam || 0, nilai.menit || 0)
  return new Intl.DateTimeFormat(tagLocale(), { hour: '2-digit', minute: '2-digit' }).format(d)
}

export function angka (n) {
  if (n === null || n === undefined) return ''
  return Number(n).toLocaleString(tagLocale())
}

// 1.5 -> "1.5 hrs" / "1,5 jam"
export function durasiJam (jam) {
  const teks = Number(jam).toLocaleString(tagLocale(), { maximumFractionDigits: 1 })
  return i18n.t('course.durasiJam', { n: teks })
}

// { pola: 'modulTersisa', modul: 2, menit: 25 } -> kalimat sesuai bahasa
export function sisaLanjut (sisa) {
  if (!sisa || !sisa.pola) return ''
  const param = Object.assign({}, sisa)
  // nama bab/bagian ikut bahasa
  if (sisa.bagianKunci) param.bagian = i18n.t('chapter.' + sisa.bagianKunci)
  if (sisa.babKunci) param.bab = i18n.t('chapter.' + sisa.babKunci)
  return i18n.t('continueCard.sisa.' + sisa.pola, param)
}

export function ukuranBerkas (byte) {
  const mb = byte / 1048576
  if (mb >= 1) {
    return mb.toLocaleString(tagLocale(), { maximumFractionDigits: 1 }) + ' MB'
  }
  return Math.round(byte / 1024).toLocaleString(tagLocale()) + ' KB'
}

export default {
  install (Vue) {
    Vue.prototype.$waktuRelatif = waktuRelatif
    Vue.prototype.$tanggal = tanggalPanjang
    Vue.prototype.$bulanTahun = bulanTahun
    Vue.prototype.$jam = jamMenit
    Vue.prototype.$angka = angka
    Vue.prototype.$durasi = durasiJam
    Vue.prototype.$sisa = sisaLanjut
    Vue.prototype.$ukuran = ukuranBerkas
  }
}

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import elEn from 'element-ui/lib/locale/lang/en'
import elId from 'element-ui/lib/locale/lang/id'
import en from './en.json'
import id from './id.json'

Vue.use(VueI18n)

const KUNCI = 'xdemia:lang'
export const BAHASA = ['en', 'id']
export const BAWAAN = 'en'

// Bahasa tersimpan dipulihkan saat load; kalau kosong atau rusak, pakai English.
export function bacaBahasa () {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return BAWAAN
    const nilai = window.localStorage.getItem(KUNCI)
    return BAHASA.indexOf(nilai) !== -1 ? nilai : BAWAAN
  } catch (e) {
    return BAWAAN
  }
}

const i18n = new VueI18n({
  locale: bacaBahasa(),
  fallbackLocale: BAWAAN,
  silentFallbackWarn: true,
  // pesan Element UI ikut digabung supaya komponen bawaannya ikut berganti bahasa
  messages: {
    en: Object.assign({}, en, elEn),
    id: Object.assign({}, id, elId)
  }
})

ElementLocale.i18n((kunci, nilai) => i18n.t(kunci, nilai))

export function setBahasa (bahasa) {
  if (BAHASA.indexOf(bahasa) === -1) return
  i18n.locale = bahasa
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(KUNCI, bahasa)
    }
  } catch (e) {
    // storage diblokir — bahasa tetap berganti untuk sesi ini
  }
  if (typeof document !== 'undefined') document.documentElement.lang = bahasa
}

export default i18n

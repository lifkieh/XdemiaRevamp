import Vue from 'vue'
import Vuex from 'vuex'
import bookmarks from './modules/bookmarks'
import user from './modules/user'
import layout from './modules/layout'
import persist from './persist'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { bookmarks, user, layout },
  plugins: [persist]
})

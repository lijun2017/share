import Vue from 'vue'
import Vuex from 'vuex'

import module1 from '../views/Vuex_module/module1/vuex_module'
import module2 from '../views/Vuex_module/module2/vuex_module'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    module1,
    module2
  }
})

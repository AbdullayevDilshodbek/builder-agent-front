import Vue from 'vue'
import Vuex from 'vuex'
import login from './login/index'
import user from './user/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login,
    user
  }
})
